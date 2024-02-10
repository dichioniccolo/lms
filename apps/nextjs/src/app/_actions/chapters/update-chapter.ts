"use server";

import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { deleteFile } from "../files/delete-file";
import { authenticatedMiddlewares } from "../middlewares/user";

export const updateChapter = createServerAction({
  actionName: "updateChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
    values: z
      .object({
        title: RequiredString,
        description: RequiredString,
        free: z.coerce.boolean(),
        videoUrl: RequiredString.url(),
        videoContentLength: z.number(),
        videoContentType: RequiredString,
      })
      .partial(),
  }),
  action: async ({ input: { courseId, chapterId, values }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      throw new ErrorForClient("You are not a teacher");
    }

    await db.transaction(async (tx) => {
      const where = and(
        eq(schema.chapters.id, chapterId),
        eq(schema.chapters.courseId, courseId),
        exists(
          tx
            .select()
            .from(schema.courses)
            .where(
              and(
                eq(schema.courses.id, courseId),
                eq(schema.courses.ownerId, user.id),
              ),
            ),
        ),
      );

      const chapter = await tx.query.chapters.findFirst({
        where,
        columns: {
          videoUrl: true,
        },
      });

      await tx
        .update(schema.chapters)
        .set({
          ...values,
        })
        .where(where);

      if (values.videoUrl && chapter?.videoUrl) {
        await deleteFile(chapter.videoUrl);
      }
    });
  },
});
