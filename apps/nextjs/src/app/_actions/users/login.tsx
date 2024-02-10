"use server";

import { z } from "zod";

import { signIn } from "@acme/auth";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredEmail, RequiredString } from "~/lib/validation";

export const login = createServerAction({
  actionName: "login",
  schema: z.object({
    email: RequiredEmail,
    callbackUrl: RequiredString,
  }),
  action: async ({ input: { email, callbackUrl } }) => {
    await signIn("email", {
      email,
      redirect: false,
      callbackUrl,
    });
  },
});
