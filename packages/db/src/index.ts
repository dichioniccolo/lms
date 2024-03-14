import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "./env.mjs";
import * as accounts from "./schema/accounts/schema";
import * as attachments from "./schema/attachments/schema";
import * as categories from "./schema/categories/schema";
import * as categoriesCourses from "./schema/categoriesCourses/schema";
import * as chapters from "./schema/chapters/schema";
import * as courses from "./schema/courses/schema";
import * as sessions from "./schema/sessions/schema";
import * as users from "./schema/users/schema";
import * as usersChaptersProgresses from "./schema/usersChaptersProgresses/schema";
import * as usersCourses from "./schema/usersCourses/schema";
import * as verificationTokens from "./schema/verificationTokens/schema";

export const schema = {
  ...accounts,
  ...attachments,
  ...categories,
  ...categoriesCourses,
  ...chapters,
  ...courses,
  ...sessions,
  ...users,
  ...usersChaptersProgresses,
  ...usersCourses,
  ...verificationTokens,
};

export * from "drizzle-orm";

const client = neon(env.DATABASE_URL_POSTGRES);

// @ts-expect-error error TS2322: Type 'Neon' is not assignable to type 'Client'.
export const db = drizzle(client, { schema });

export { createId } from "@paralleldrive/cuid2";

export * from "./helpers";
