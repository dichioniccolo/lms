import { GetObjectCommand } from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { getKey } from ".";

export async function rangeOfFile(url: string, range: string) {
  const key = getKey(url);

  const rangeResponse = await s3.send(
    new GetObjectCommand({
      Bucket: env.DO_BUCKET_NAME,
      Key: key,
      Range: range,
    }),
  );

  return rangeResponse;
}
