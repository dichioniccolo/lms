"use server";

import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { authenticatedMiddlewares } from "../middlewares/user";

export const removeUser = createServerAction({
  actionName: "removeUser",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: z.string(),
    userId: z.string(),
  }),
  action: async ({ input: { courseId, userId }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      throw new ErrorForClient("You are not a teacher");
    }

    const userCourse = await db.query.usersCourses.findFirst({
      where: and(
        eq(schema.usersCourses.courseId, courseId),
        eq(schema.usersCourses.userId, userId),
        exists(
          db
            .select()
            .from(schema.courses)
            .where(
              and(
                eq(schema.courses.id, schema.usersCourses.courseId),
                eq(schema.courses.ownerId, user.id),
              ),
            ),
        ),
      ),
    });

    if (!userCourse) {
      throw new ErrorForClient("User is not enrolled in this course");
    }

    if (!userCourse.invited) {
      throw new ErrorForClient("You cannot remove a user paid for the course");
    }

    await db
      .delete(schema.usersCourses)
      .where(eq(schema.usersCourses.id, userCourse.id));
  },
});
