"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const createAttachment = createServerAction({
  actionName: "createAttachment",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    name: RequiredString,
    url: RequiredString.url(),
  }),
  action: async ({ input: { courseId, name, url }, ctx: { user } }) => {
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

    await db.insert(schema.attachments).values({
      courseId,
      name,
      url,
    });
  },
});
