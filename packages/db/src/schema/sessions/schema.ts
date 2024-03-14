import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const sessions = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  expires: timestamp("expires", { mode: "date" }).notNull(), // here i left timestamp because the schema is used also by @auth/core
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
