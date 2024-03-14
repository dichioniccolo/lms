import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { courses } from "../courses/schema";
import { usersChaptersProgresses } from "../usersChaptersProgresses/schema";

export const chapters = pgTable("chapters", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl"),
  videoContentLength: bigint("videoContentLength", {
    mode: "number",
  }),
  videoContentType: varchar("videoContentType", { length: 255 }),
  position: integer("position"),
  published: boolean("published").notNull().default(false),
  free: boolean("free").notNull().default(false),
  createdAt: timestamp("createdAt", {
    mode: "date",
    precision: 3,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    precision: 3,
  })
    .notNull()
    .defaultNow(),
});

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  progresses: many(usersChaptersProgresses),
}));
