"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { mux } from "~/lib/mux";
import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { deleteFile } from "../files/delete-file";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteChapter = createServerAction({
  actionName: "deleteChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
  }),
  action: async ({ input: { courseId, chapterId }, ctx: { user } }) => {
    if (!isTeacher(user.email)) {
      throw new ErrorForClient("You are not a teacher");
    }

    const course = await db.query.courses.findFirst({
      where: and(
        eq(schema.courses.id, courseId),
        eq(schema.courses.ownerId, user.id),
      ),
      columns: {
        id: true,
      },
      with: {
        chapters: {
          where: eq(schema.chapters.id, chapterId),
          columns: {
            id: true,
            videoUrl: true,
          },
          with: {
            mux: true,
          },
        },
      },
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    const chapter = course.chapters[0];

    if (!chapter) {
      throw new ErrorForClient("Chapter not found");
    }

    if (chapter.videoUrl && chapter.mux) {
      await mux.Video.Assets.del(chapter.mux.assetId);
      await db.delete(schema.mux).where(eq(schema.mux.id, chapter.mux.id));
      await deleteFile(chapter.videoUrl);
    }

    await db.delete(schema.chapters).where(eq(schema.chapters.id, chapterId));

    const publishedChaptersInCourse = await db.query.chapters.findMany({
      where: and(
        eq(schema.chapters.courseId, courseId),
        eq(schema.chapters.published, true),
      ),
      columns: {
        id: true,
      },
    });

    if (publishedChaptersInCourse.length === 0) {
      await db
        .update(schema.courses)
        .set({
          published: false,
        })
        .where(eq(schema.courses.id, courseId));
    }

    redirect(`/dashboard/teacher/courses/${courseId}`);
  },
});
