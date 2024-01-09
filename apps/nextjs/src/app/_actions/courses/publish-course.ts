"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const publishCourse = createServerAction({
  actionName: "publishCourse",
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
      },
      with: {
        chapters: {
          where: eq(schema.chapters.published, true),
        },
      },
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    const hasPublishedChapters = course.chapters.some((x) => x.published);

    if (!hasPublishedChapters) {
      throw new ErrorForClient("Course has no published chapters");
    }

    await db
      .update(schema.courses)
      .set({
        published: true,
      })
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.ownerId, user.id),
        ),
      );
  },
});
