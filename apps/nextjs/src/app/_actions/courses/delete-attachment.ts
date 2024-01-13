"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteAttachment = createServerAction({
  actionName: "deleteAttachment",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    id: z.number(),
  }),
  action: async ({ input: { courseId, id }, ctx: { user } }) => {
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
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    // TODO: delete uploaded file

    await db
      .delete(schema.attachments)
      .where(
        and(
          eq(schema.attachments.courseId, courseId),
          eq(schema.attachments.id, id),
        ),
      );
  },
});
