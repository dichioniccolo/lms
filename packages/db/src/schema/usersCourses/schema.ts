import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { courses } from "../courses/schema";
import { users } from "../users/schema";

export const usersCourses = pgTable(
  "usersCourses",
  {
    id: serial("id").notNull().primaryKey(),
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
    createdAt: timestamp("createdAt", {
      mode: "date",
      precision: 3,
    })
      .notNull()
      .defaultNow(),
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
