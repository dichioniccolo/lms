"use server";

import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const unpublishChapter = createServerAction({
  actionName: "unpublishChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
  }),
  action: async ({ input: { courseId, chapterId }, ctx: { user } }) => {
    await db
      .update(schema.chapters)
      .set({
        published: false,
      })
      .where(
        and(
          eq(schema.chapters.courseId, courseId),
          eq(schema.chapters.id, chapterId),
          exists(
            db
              .select()
              .from(schema.courses)
              .where(
                and(
                  eq(schema.courses.id, schema.chapters.courseId),
                  eq(schema.courses.ownerId, user.id),
                ),
              ),
          ),
        ),
      );
  },
});
