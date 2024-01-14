import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";
import { mux } from "../mux/schema";
import { usersChaptersProgresses } from "../usersChaptersProgresses/schema";

export const chapters = mysqlTable("chapters", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl"),
  position: int("position", {
    unsigned: true,
  }),
  published: boolean("published").notNull().default(false),
  free: boolean("free").notNull().default(false),
  createdAt: datetime("createdAt", {
    mode: "date",
    fsp: 3,
  })
    .notNull()
    .default(sql`(now())`),
  updatedAt: datetime("updatedAt", {
    mode: "date",
    fsp: 3,
  })
    .notNull()
    .default(sql`(now())`),
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  progresses: many(usersChaptersProgresses),
  mux: one(mux),
}));
