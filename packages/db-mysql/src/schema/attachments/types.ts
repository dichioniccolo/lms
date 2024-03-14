import type { InferSelectModel } from "drizzle-orm";

import type { attachments } from "./schema";

export type Attachment = InferSelectModel<typeof attachments>;
