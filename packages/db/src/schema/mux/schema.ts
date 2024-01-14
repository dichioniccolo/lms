import { relations } from "drizzle-orm";
import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

import { chapters } from "../chapters/schema";

export const mux = mysqlTable("mux", {
  id: serial("id").notNull().primaryKey(),
  chapterId: varchar("chapterId", { length: 255 })
    .notNull()
    .references(() => chapters.id, {
      onDelete: "cascade",
    }),
  assetId: varchar("assetId", { length: 255 }).notNull(),
  playbackId: varchar("playbackId", { length: 255 }),
});

export const muxRelations = relations(mux, ({ one }) => ({
  chapter: one(chapters, {
    fields: [mux.chapterId],
    references: [chapters.id],
  }),
}));
