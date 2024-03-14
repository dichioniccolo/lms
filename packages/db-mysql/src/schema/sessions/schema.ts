import { relations } from "drizzle-orm";
import { index, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

import { users } from "../users/schema";

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    expires: timestamp("expires", { mode: "date" }).notNull(), // here i left timestamp because the schema is used also by @auth/core
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
