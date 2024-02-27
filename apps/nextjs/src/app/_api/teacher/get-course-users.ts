"use server";

import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { createServerQuery } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "~/app/_actions/middlewares/user";
import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";

export const getCourseUsers = createServerQuery({
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
  }),
  query: async ({ input: { courseId }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      return [];
    }

    const users = await db.query.usersCourses.findMany({
      where: and(
        eq(schema.usersCourses.courseId, courseId),
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
      columns: {
        courseId: true,
        invited: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return users;
  },
});
