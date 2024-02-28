"use server";

import { z } from "zod";

import { and, db, eq, exists, or, schema } from "@acme/db";
import { createServerQuery } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { getSignedUrl } from "../files/get-signed-url";
import { authenticatedMiddlewares } from "../middlewares/user";

export const getVideoUrl = createServerQuery({
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
  }),
  query: async ({ input: { courseId, chapterId }, ctx: { user } }) => {
    const chapter = await db.query.chapters.findFirst({
      where: and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.courseId, courseId),
        or(
          // chapter is free and published
          and(
            eq(schema.chapters.published, true),
            eq(schema.chapters.free, true),
          ),
          // current user is enrolled in the course and the chapter is published
          and(
            eq(schema.chapters.published, true),
            exists(
              db
                .select()
                .from(schema.usersCourses)
                .where(
                  and(
                    eq(schema.chapters.courseId, schema.usersCourses.courseId),
                    eq(schema.usersCourses.userId, user.id),
                  ),
                ),
            ),
          ),
          // current user is the owner of the course
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
      ),
      columns: {
        id: true,
        videoUrl: true,
      },
    });

    if (!chapter) {
      return null;
    }

    if (!chapter.videoUrl) {
      return null;
    }

    return await getSignedUrl(chapter.videoUrl);
  },
});
