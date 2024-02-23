"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { getChapterCacheKey } from "~/app/_api/teacher/get-chapter";
import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { deleteFile } from "../files/delete-file";
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
  cache: { revalidateTags: [getChapterCacheKey] },
  action: async ({ input: { courseId, values }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      throw new ErrorForClient("You are not a teacher");
    }

    const course = await db
      .select()
      .from(schema.courses)
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.ownerId, user.id),
        ),
      )
      .then((x) => x[0]);

    if (!course) {
      throw new ErrorForClient("Course not found");
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

    if (values.imageUrl && course.imageUrl) {
      await deleteFile(course.imageUrl);
    }
  },
});
