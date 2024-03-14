import { relations, sql } from "drizzle-orm";
import {
  datetime,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

import { accounts } from "../accounts/schema";
import { usersCourses } from "../usersCourses/schema";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: datetime("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`(now())`),
  role: mysqlEnum("role", ["ADMIN", "USER", "TEACHER"])
    .notNull()
    .default("USER"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).unique(),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  courses: many(usersCourses),
}));
