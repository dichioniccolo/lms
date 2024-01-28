"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const publishChapter = createServerAction({
  actionName: "publishChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
  }),
  action: async ({ input: { courseId, chapterId }, ctx: { user } }) => {
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
            title: true,
            description: true,
            videoUrl: true,
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

    if (!chapter.title) {
      throw new ErrorForClient("Missing chapter title");
    }

    if (!chapter.description) {
      throw new ErrorForClient("Missing chapter description");
    }

    if (!chapter.videoUrl) {
      throw new ErrorForClient("Missing chapter video");
    }

    await db
      .update(schema.chapters)
      .set({
        published: true,
      })
      .where(eq(schema.chapters.id, chapterId));
  },
});
