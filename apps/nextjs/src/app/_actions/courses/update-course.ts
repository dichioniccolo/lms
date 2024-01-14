"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const updateCourse = createServerAction({
  actionName: "updateCourse",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    values: z
      .object({
        title: RequiredString,
        description: RequiredString,
        imageUrl: RequiredString,
        price: RequiredString,
      })
      .partial(),
  }),
  action: async ({ input: { courseId, values }, ctx: { user } }) => {
    if (!isTeacher(user.email)) {
      throw new ErrorForClient("You are not a teacher");
    }

    await db
      .update(schema.courses)
      .set({
        ...values,
      })
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.ownerId, user.id),
        ),
      );
  },
});
