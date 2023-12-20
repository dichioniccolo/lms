import { relations } from "drizzle-orm";
import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { accounts } from "../accounts/schema";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));
