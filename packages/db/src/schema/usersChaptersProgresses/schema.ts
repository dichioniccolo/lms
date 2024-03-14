import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { chapters } from "../chapters/schema";
import { users } from "../users/schema";

export const usersChaptersProgresses = pgTable(
  "usersChaptersProgresses",
  {
    id: serial("id").notNull().primaryKey(),
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
    createdAt: timestamp("createdAt", {
      mode: "date",
      precision: 3,
    })
      .notNull()
      .defaultNow(),
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
