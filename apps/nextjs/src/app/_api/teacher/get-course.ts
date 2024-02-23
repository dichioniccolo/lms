import { z } from "zod";

import { and, asc, db, eq, schema } from "@acme/db";
import { createServerQuery } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "~/app/_actions/middlewares/user";
import { RequiredString } from "~/lib/validation";

export const getCourseCacheKey = "teacher:getCourse";

export const getCourse = createServerQuery({
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
  }),
  cache: {
    keys: [getCourseCacheKey],
    tags: [getCourseCacheKey],
    revalidate: 300,
  },
  query: async ({ input: { courseId }, ctx: { user } }) => {
    const course = await db.query.courses.findFirst({
      where: and(
        eq(schema.courses.id, courseId),
        eq(schema.courses.ownerId, user.id),
      ),
      with: {
        chapters: {
          orderBy: asc(schema.chapters.position),
        },
        attachments: true,
        categories: {
          with: {
            category: true,
          },
        },
      },
    });

    return course;
  },
});
