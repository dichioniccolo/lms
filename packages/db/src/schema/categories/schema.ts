import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { categoriesCourses } from "../categoriesCourses/schema";

export const categories = pgTable("categories", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(categoriesCourses),
}));
