import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { attachments } from "../attachments/schema";
import { categoriesCourses } from "../categoriesCourses/schema";
import { chapters } from "../chapters/schema";
import { users } from "../users/schema";
import { usersCourses } from "../usersCourses/schema";

export const courses = pgTable(
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
    createdAt: timestamp("createdAt", {
      mode: "date",
      precision: 3,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      precision: 3,
    })
      .notNull()
      .defaultNow(),
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
