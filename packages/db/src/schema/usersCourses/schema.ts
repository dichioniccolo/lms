import { relations } from "drizzle-orm";
import {
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";
import { users } from "../users/schema";

export const usersCourses = mysqlTable(
  "usersCourses",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    courseId: varchar("courseId", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .defaultNow()
      .onUpdateNow(),
  },
  (columns) => ({
    userIdCourseIdPk: primaryKey({
      columns: [columns.userId, columns.courseId],
    }),
  }),
);

export const usersCoursesRelations = relations(usersCourses, ({ one }) => ({
  user: one(users, {
    fields: [usersCourses.userId],
    references: [users.id],
  }),
  courseId: one(courses, {
    fields: [usersCourses.courseId],
    references: [courses.id],
  }),
}));
