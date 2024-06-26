import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "../users/schema";

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: varchar("type", { length: 255 })
      .$type<"oauth" | "oidc" | "email">()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
