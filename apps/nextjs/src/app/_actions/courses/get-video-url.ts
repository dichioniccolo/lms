"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { and, db, eq, exists, or, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";

import { getCurrentUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { getKey } from "../files";

export const getVideoUrl = // createServerAction({
  // actionName: "getVideoUrl",
  // middlewares: authenticatedMiddlewares,
  // schema: z.object({
  //   courseId: RequiredString,
  //   chapterId: RequiredString,
  // }),
  // initialState: undefined as unknown as string,
  // action:
  async (courseId: string, chapterId: string) => {
    const user = await getCurrentUser();

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
      throw new ErrorForClient("Non hai accesso a questo video");
    }

    if (!chapter.videoUrl) {
      throw new ErrorForClient("Non hai accesso a questo video");
    }

    const key = getKey(chapter.videoUrl);

    const command = new GetObjectCommand({
      Bucket: env.DO_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 });

    return url;
  };
// });
