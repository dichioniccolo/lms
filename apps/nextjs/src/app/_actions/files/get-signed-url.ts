"use server";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrlBase } from "@aws-sdk/s3-request-presigner";

import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { getKey } from ".";

export const getSignedUrl = async (url: string) => {
  const key = getKey(url);

  const command = new GetObjectCommand({
    Bucket: env.DO_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrlBase(s3, command, { expiresIn: 60 * 60 * 24 });
};
