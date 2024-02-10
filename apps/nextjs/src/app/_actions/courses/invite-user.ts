"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { inngest } from "@acme/inngest";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredEmail, RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const inviteUser = createServerAction({
  actionName: "inviteUser",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    email: RequiredEmail,
  }),
  action: async ({ input: { courseId, email }, ctx: { user } }) => {
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
        title: true,
      },
    });

    if (!course) {
      throw new ErrorForClient("Course not found");
    }

    const invitedUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      columns: {
        id: true,
        name: true,
        email: true,
      },
      with: {
        courses: {
          columns: {
            courseId: true,
          },
        },
      },
    });

    if (!invitedUser) {
      throw new ErrorForClient("User not found");
    }

    if (invitedUser.courses.some((c) => c.courseId === course.id)) {
      throw new ErrorForClient("User is already enrolled in this course");
    }

    await db.insert(schema.usersCourses).values({
      courseId: course.id,
      userId: invitedUser.id,
      invited: true,
    });

    await inngest.send({
      name: "course/invitation",
      data: {
        course: {
          title: course.title,
        },
        user: {
          name: invitedUser.name,
          email: invitedUser.email,
        },
      },
    });
  },
});
