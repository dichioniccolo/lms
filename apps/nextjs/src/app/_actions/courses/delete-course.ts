"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { deleteFile, deleteFiles } from "../files/delete-file";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteCourse = createServerAction({
  actionName: "deleteCourse",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
  }),
  action: async ({ input: { courseId }, ctx: { user } }) => {
    const course = await db.query.courses.findFirst({
      where: and(
        eq(schema.courses.id, courseId),
        eq(schema.courses.ownerId, user.id),
      ),
      columns: {
        id: true,
        imageUrl: true,
      },
      with: {
        chapters: {
          columns: {
            videoUrl: true,
          },
        },
      },
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    if (course.imageUrl) {
      await deleteFile(course.imageUrl);
    }

    await deleteFiles(course.chapters.map((x) => x.videoUrl).filter(Boolean));

    await db
      .delete(schema.courses)
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.ownerId, user.id),
        ),
      );

    redirect("/dashboard/teacher/courses");
  },
});
