import { S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";

export const s3 = new S3Client({
  forcePathStyle: false,
  endpoint: env.DO_ENDPOINT,
  region: env.DO_REGION,
  credentials: {
    accessKeyId: env.DO_ACCESS_KEY_ID,
    secretAccessKey: env.DO_SECRET_ACCESS_KEY,
  },
});
