import { relations } from "drizzle-orm";
import {
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";

export const attachments = mysqlTable("attachments", {
  id: serial("id").notNull().autoincrement().primaryKey(),
  courseId: varchar("courseId", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
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

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}));
