"use server";

import { z } from "zod";

import { signIn } from "@acme/auth";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation";

export const googleLogin = createServerAction({
  actionName: "googleLogin",
  schema: z.object({
    callbackUrl: RequiredString,
  }),
  action: async ({ input: { callbackUrl } }) => {
    await signIn("google", {
      callbackUrl,
    });
  },
});
