import type { InferSelectModel } from "drizzle-orm";

import type { courses } from "./schema";

export type Course = InferSelectModel<typeof courses>;
