import { relations } from "drizzle-orm";
import {
  mysqlTable,
  primaryKey,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { chapters } from "../chapters/schema";
import { users } from "../users/schema";

export const usersChaptersProgresses = mysqlTable(
  "usersChaptersProgresses",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    chapterId: varchar("chapterId", { length: 255 }).notNull(),
    percentage: tinyint("percentage", {
      unsigned: true,
    })
      .notNull()
      .default(0),
    createdAt: timestamp("createdAt", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (columns) => ({
    userIdchapterIdPk: primaryKey({
      columns: [columns.userId, columns.chapterId],
    }),
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
