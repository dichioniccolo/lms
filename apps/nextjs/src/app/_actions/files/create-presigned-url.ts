"use server";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { createId } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";

import { getCurrentUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { s3 } from "~/lib/s3";
import { isTeacher } from "~/lib/utils";

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

interface Options {
  type: FileTypes;
  contentType: string;
  acl: "public" | "private";
}

export async function createPresignedUrl(
  state:
    | {
        fields: Record<string, string>;
        url: string;
      }
    | undefined,
  { type, contentType, acl = "private" }: Options,
) {
  const user = await getCurrentUser();

  if (!isTeacher(user.role)) {
    throw new ErrorForClient("You are not a teacher");
  }

  const key = createId();

  const contentLengthMaxRange =
    type === FileTypes.Video
      ? 10_000_000_000 // 10 GB
      : 10_000_000; // 10 MB

  const expires =
    type === FileTypes.Video
      ? 60 * 60 * 24 // 24 hours
      : 600; // 5 minutes

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: env.DO_BUCKET_NAME,
    Key: key,
    Conditions: [
      ["content-length-range", 0, contentLengthMaxRange], // up to 10 GB if video
      ["starts-with", "$Content-Type", contentType],
    ],
    Fields: {
      acl: acl === "private" ? "authenticated-read" : "public-read",
      "Content-Type": contentType,
    },
    Expires: expires,
  });

  return {
    fields,
    url,
  };
}
