import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  mysqlTable,
  serial,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

import { courses } from "../courses/schema";
import { users } from "../users/schema";

export const usersCourses = mysqlTable(
  "usersCourses",
  {
    id: serial("id").notNull().autoincrement().primaryKey(),
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
    invited: boolean("invited").default(false),
    createdAt: datetime("createdAt", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .default(sql`(now())`),
  },
  (columns) => ({
    userIdCourseIdUk: unique().on(columns.userId, columns.courseId),
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
