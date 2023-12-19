import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import * as auth from "./schema/auth";

export const schema = { ...auth };

export * from "drizzle-orm";

const client = new Client({
  url: env.DATABASE_URL,
});

export const db = drizzle(client.connection(), { schema });
