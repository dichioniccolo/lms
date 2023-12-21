import { customType } from "drizzle-orm/mysql-core";

export const price = customType<{
  data: number;
  notNull: true;
  default: true;
}>({
  dataType() {
    return `decimal(19, 2)`;
  },
});
