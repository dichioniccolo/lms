import { relations } from "drizzle-orm";
import {
  bigint,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { categories } from "../categories/schema";
import { courses } from "../courses/schema";

export const categoriesCourses = pgTable(
  "categoriesCourses",
  {
    id: serial("id").notNull().primaryKey(),
    categoryId: bigint("categoryId", {
      mode: "number",
    })
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),
    courseId: varchar("courseId", { length: 255 })
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),
  },
  (columns) => ({
    categoryIdCourseIdPk: uniqueIndex("categoryIdCourseIdPk").on(
      columns.categoryId,
      columns.courseId,
    ),
  }),
);

export const categoriesCoursesRelations = relations(
  categoriesCourses,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoriesCourses.categoryId],
      references: [categories.id],
    }),
    course: one(courses, {
      fields: [categoriesCourses.courseId],
      references: [courses.id],
    }),
  }),
);
