"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const unpublishCourse = createServerAction({
  actionName: "unpublishCourse",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
  }),
  action: async ({ input: { courseId }, ctx: { user } }) => {
    await db
      .update(schema.courses)
      .set({
        published: false,
      })
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.ownerId, user.id),
        ),
      );
  },
});
