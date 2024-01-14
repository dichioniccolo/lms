"use server";

import { z } from "zod";

import { and, db, eq, exists, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { mux } from "~/lib/mux";
import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
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
      })
      .partial(),
  }),
  action: async ({ input: { courseId, chapterId, values }, ctx: { user } }) => {
    if (!isTeacher(user.email)) {
      throw new ErrorForClient("You are not a teacher");
    }

    await db.transaction(async (tx) => {
      await tx
        .update(schema.chapters)
        .set({
          ...values,
        })
        .where(
          and(
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
          ),
        );

      if (values.videoUrl) {
        const existingMuxData = await tx.query.mux.findFirst({
          where: eq(schema.mux.chapterId, chapterId),
        });

        if (existingMuxData) {
          await mux.Video.Assets.del(existingMuxData.assetId);
          await tx
            .delete(schema.mux)
            .where(eq(schema.mux.chapterId, chapterId));
        }

        const asset = await mux.Video.Assets.create({
          input: values.videoUrl,
          // TODO: this needs to be signed but I need to
          // check better MUX docs to understand how to do it
          playback_policy: "public",
          encoding_tier: "baseline",
          test: false,
        });

        await tx.insert(schema.mux).values({
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          chapterId,
        });
      }
    });
  },
});
