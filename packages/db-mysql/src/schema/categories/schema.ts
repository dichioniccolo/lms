import { relations } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

import { categoriesCourses } from "../categoriesCourses/schema";

export const categories = mysqlTable("categories", {
  id: serial("id").notNull().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(categoriesCourses),
}));
