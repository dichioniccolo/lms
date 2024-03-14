import type { InferSelectModel } from "drizzle-orm";

import type { chapters } from "./schema";

export type Chapter = InferSelectModel<typeof chapters>;
