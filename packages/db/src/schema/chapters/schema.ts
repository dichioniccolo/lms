import { relations } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";
import { mux } from "../mux/schema";
import { usersChaptersProgresses } from "../usersChaptersProgresses/schema";

export const chapters = mysqlTable("chapters", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  courseId: varchar("courseId", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl"),
  position: tinyint("position", {
    unsigned: true,
  }),
  published: boolean("published").notNull().default(false),
  free: boolean("free").notNull().default(false),
  createdAt: timestamp("createdAt", {
    mode: "date",
    fsp: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    fsp: 3,
  })
    .notNull()
    .defaultNow()
    .onUpdateNow(),
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  progresses: many(usersChaptersProgresses),
  mux: one(mux),
}));
