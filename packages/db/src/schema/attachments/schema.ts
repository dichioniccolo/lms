import { relations, sql } from "drizzle-orm";
import {
  datetime,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";

export const attachments = mysqlTable("attachments", {
  id: serial("id").notNull().autoincrement().primaryKey(),
  courseId: varchar("courseId", { length: 255 })
    .notNull()
    .references(() => courses.id),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
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

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}));
