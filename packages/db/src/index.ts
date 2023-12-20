import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import * as accounts from "./schema/accounts/schema";
import * as sessions from "./schema/sessions/schema";
import * as users from "./schema/users/schema";
import * as verificationTokens from "./schema/verificationTokens/schema";

export const schema = {
  ...accounts,
  ...sessions,
  ...users,
  ...verificationTokens,
};

export * from "drizzle-orm";

const client = new Client({
  url: env.DATABASE_URL,
});

export const db = drizzle(client.connection(), { schema });

export { createId } from "@paralleldrive/cuid2";
