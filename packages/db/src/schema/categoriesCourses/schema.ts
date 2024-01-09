import { relations } from "drizzle-orm";
import { mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

import { categories } from "../categories/schema";
import { courses } from "../courses/schema";

export const categoriesCourses = mysqlTable(
  "categoriesCourses",
  {
    categoryId: varchar("categoryId", { length: 255 }).notNull(),
    courseId: varchar("courseId", { length: 255 }).notNull(),
  },
  (columns) => ({
    categoryIdCourseIdPk: primaryKey({
      columns: [columns.categoryId, columns.courseId],
    }),
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
