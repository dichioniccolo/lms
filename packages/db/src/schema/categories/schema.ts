import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const categories = mysqlTable("categories", {
  id: serial("id").notNull().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});
