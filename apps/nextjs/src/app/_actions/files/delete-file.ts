import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { getKey } from ".";

export async function deleteFile(url: string) {
  await deleteFiles([url]);
}

export async function deleteFiles(urls: string[]) {
  const keys = urls.map((url) => getKey(url));

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: env.DO_BUCKET_NAME,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    }),
  );
}
