import { z } from "zod";

import { createId, db, schema } from "@acme/db";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";

export const createCourse = createServerAction({
  actionName: "createCourse",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    title: z.string().min(1),
  }),
  action: async ({ input: { title }, ctx: { user } }) => {
    await db.insert(schema.courses).values({
      id: createId(),
      ownerId: user.id,
      title,
    });
  },
});
