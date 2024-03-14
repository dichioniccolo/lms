import type { InferSelectModel } from "drizzle-orm";

import type { categories } from "./schema";

export type Category = InferSelectModel<typeof categories>;
