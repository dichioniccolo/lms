import { relations, sql } from "drizzle-orm";
import {
  datetime,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";
import { users } from "../users/schema";

export const usersCourses = mysqlTable(
  "usersCourses",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    courseId: varchar("courseId", { length: 255 })
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),
    createdAt: datetime("createdAt", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .default(sql`(now())`),
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
  course: one(courses, {
    fields: [usersCourses.courseId],
    references: [courses.id],
  }),
}));
