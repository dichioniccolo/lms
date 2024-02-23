import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { createServerQuery } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "~/app/_actions/middlewares/user";
import { RequiredString } from "~/lib/validation";

export const getChapterCacheKey = "teacher:getChapter";

export const getChapter = createServerQuery({
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
  }),
  cache: {
    keys: [getChapterCacheKey],
    tags: [getChapterCacheKey],
    revalidate: 300,
  },
  query: async ({ input: { courseId, chapterId }, ctx: { user } }) => {
    const chapter = await db.query.chapters.findFirst({
      where: and(
        eq(schema.chapters.courseId, courseId),
        eq(schema.chapters.id, chapterId),
        exists(
          db
            .select()
            .from(schema.courses)
            .where(
              and(
                eq(schema.courses.id, schema.chapters.courseId),
                eq(schema.courses.ownerId, user.id),
              ),
            ),
        ),
      ),
    });

    return chapter;
  },
});
