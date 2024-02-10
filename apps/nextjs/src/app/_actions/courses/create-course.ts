"use server";

import { z } from "zod";

import { createId, db, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { isTeacher } from "~/lib/utils";
import { authenticatedMiddlewares } from "../middlewares/user";

export const createCourse = createServerAction({
  actionName: "createCourse",
  middlewares: authenticatedMiddlewares,
  initialState: undefined as unknown as string,
  schema: z.object({
    title: z.string().min(1),
  }),
  action: async ({ input: { title }, ctx: { user } }) => {
    if (!isTeacher(user.role)) {
      throw new ErrorForClient("You are not a teacher");
    }

    const id = createId();

    await db.insert(schema.courses).values({
      id,
      ownerId: user.id,
      title,
    });

    return id;
  },
});
