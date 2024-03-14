import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { accounts } from "../accounts/schema";
import { usersCourses } from "../usersCourses/schema";

export const roleEnum = pgEnum("Role", ["ADMIN", "USER", "TEACHER"]);

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    precision: 3,
  }).defaultNow(),
  role: roleEnum("role").notNull().default("USER"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }).unique(),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  courses: many(usersCourses),
}));
