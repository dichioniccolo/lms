import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  decimal,
  index,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

import { attachments } from "../attachments/schema";
import { categoriesCourses } from "../categoriesCourses/schema";
import { chapters } from "../chapters/schema";
import { users } from "../users/schema";
import { usersCourses } from "../usersCourses/schema";

export const courses = mysqlTable(
  "courses",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    ownerId: varchar("ownerId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("imageUrl"),
    price: decimal("price", {
      precision: 19,
      scale: 2,
    }),
    published: boolean("published").notNull().default(false),
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
  },
  (columns) => ({
    publishedIdx: index("published_idx").on(columns.published),
  }),
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
