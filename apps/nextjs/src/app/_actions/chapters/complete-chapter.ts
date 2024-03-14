"use server";

import { z } from "zod";

import { and, db, eq, exists, or, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const completeChapter = createServerAction({
  actionName: "completeChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    chapterId: RequiredString,
    completed: z.coerce.boolean(),
  }),
  action: async ({
    input: { courseId, chapterId, completed },
    ctx: { user },
  }) => {
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
    });

    if (!chapter) {
      throw new ErrorForClient("Chapter not found or not available");
    }

    const existing = await db.query.usersChaptersProgresses.findFirst({
      where: and(
        eq(schema.usersChaptersProgresses.userId, user.id),
        eq(schema.usersChaptersProgresses.chapterId, chapter.id),
      ),
    });

    if (!existing) {
      await db.insert(schema.usersChaptersProgresses).values({
        userId: user.id,
        chapterId: chapter.id,
        completed,
      });
      return;
    }

    await db
      .update(schema.usersChaptersProgresses)
      .set({
        completed,
      })
      .where(
        and(
          eq(schema.usersChaptersProgresses.userId, user.id),
          eq(schema.usersChaptersProgresses.chapterId, chapter.id),
        ),
      );
  },
});
