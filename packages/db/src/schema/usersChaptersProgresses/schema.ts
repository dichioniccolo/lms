import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  mysqlTable,
  serial,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { chapters } from "../chapters/schema";
import { users } from "../users/schema";

export const usersChaptersProgresses = mysqlTable(
  "usersChaptersProgresses",
  {
    id: serial("id").notNull().autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    chapterId: varchar("chapterId", { length: 255 })
      .notNull()
      .references(() => chapters.id, {
        onDelete: "cascade",
      }),
    completed: boolean("completed").notNull().default(false),
    createdAt: datetime("createdAt", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .default(sql`(now())`),
  },
  (columns) => ({
    userIdChapterId: unique().on(columns.userId, columns.chapterId),
  }),
);

export const usersChaptersProgressesRelations = relations(
  usersChaptersProgresses,
  ({ one }) => ({
    user: one(users, {
      fields: [usersChaptersProgresses.userId],
      references: [users.id],
    }),
    chapter: one(chapters, {
      fields: [usersChaptersProgresses.chapterId],
      references: [chapters.id],
    }),
  }),
);
