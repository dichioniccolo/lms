import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";

import { getCurrentUser } from "~/app/_api/get-user";
import { isTeacher } from "~/lib/utils";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!isTeacher(user.email)) {
    throw new Error("Unauthorized");
  }

  return user;
};

export const ourFileRouter = {
  courseImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(handleAuth)
    .onUploadComplete(() => {
      //
    }),
  courseAttachment: f(["text", "image", "audio", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(() => {
      //
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
