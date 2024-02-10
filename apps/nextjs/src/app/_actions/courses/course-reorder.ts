"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const courseReorder = createServerAction({
  actionName: "courseReorder",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    list: z.array(
      z.object({
        id: RequiredString,
        position: z.number(),
      }),
    ),
  }),
  action: async ({ input: { courseId, list }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
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
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    await db.transaction(async (tx) => {
      for (const item of list) {
        await tx
          .update(schema.chapters)
          .set({
            position: item.position,
          })
          .where(eq(schema.chapters.id, item.id));
      }
    });
  },
});
