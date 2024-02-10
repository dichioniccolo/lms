"use server";

import { z } from "zod";

import { createId, db, desc, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const createChapter = createServerAction({
  actionName: "createChapter",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
    title: RequiredString,
  }),
  action: async ({ input: { courseId, title }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      throw new ErrorForClient("You are not a teacher");
    }

    const id = createId();

    const lastChapter = await db.query.chapters.findFirst({
      where: eq(schema.chapters.courseId, courseId),
      orderBy: desc(schema.chapters.position),
      columns: {
        position: true,
      },
    });

    const newPosition = lastChapter ? lastChapter.position! + 1 : 1;

    await db.insert(schema.chapters).values({
      id,
      courseId,
      title,
      position: newPosition,
    });
  },
});
