"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { and, db, eq, exists, or, schema } from "@acme/db";
import { createServerQuery } from "@acme/server-actions/server";

import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { RequiredString } from "~/lib/validation";
import { getKey } from "../files";
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
        eq(schema.chapters.published, true),
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.courseId, courseId),
        or(
          eq(schema.chapters.free, true),
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
      ),
      columns: {
        id: true,
        videoUrl: true,
        videoContentLength: true,
        videoContentType: true,
      },
    });

    if (!chapter) {
      return null;
    }

    if (!chapter.videoUrl) {
      return null;
    }

    const key = getKey(chapter.videoUrl);

    const command = new GetObjectCommand({
      Bucket: env.DO_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });

    return url;
  },
});
