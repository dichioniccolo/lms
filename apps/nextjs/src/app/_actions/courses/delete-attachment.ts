"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { deleteFile } from "../files/delete-file";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteAttachment = createServerAction({
  actionName: "deleteAttachment",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    id: z.number(),
  }),
  action: async ({ input: { courseId, id }, ctx: { user } }) => {
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
      with: {
        attachments: {
          where: eq(schema.attachments.id, id),
          columns: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    const attachment = course.attachments[0];

    if (!attachment) {
      throw new ErrorForClient("Attachment not found");
    }

    await deleteFile(attachment.url);

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
