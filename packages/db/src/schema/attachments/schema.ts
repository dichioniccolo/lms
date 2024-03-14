import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { courses } from "../courses/schema";

export const attachments = pgTable("attachments", {
  id: serial("id").notNull().primaryKey(),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
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

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}));
