import { relations } from "drizzle-orm";
import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { price } from "../../columns";
import { attachments } from "../attachments/schema";
import { categoriesCourses } from "../categoriesCourses/schema";
import { chapters } from "../chapters/schema";
import { users } from "../users/schema";
import { usersCourses } from "../usersCourses/schema";

export const courses = mysqlTable(
  "courses",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    ownerId: varchar("ownerId", { length: 255 }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("imageUrl"),
    price: price("price"),
    published: boolean("published").notNull().default(false),
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
  },
  // (columns) => ({
  //   // publishedIdx: index("published_idx").on(columns.published),
  // }),
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  owner: one(users, {
    fields: [courses.ownerId],
    references: [users.id],
  }),
  users: many(usersCourses),
  categories: many(categoriesCourses),
  chapters: many(chapters),
  attachments: many(attachments),
}));
