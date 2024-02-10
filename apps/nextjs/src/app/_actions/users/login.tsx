"use server";

import { z } from "zod";

import { signIn } from "@acme/auth";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredEmail } from "~/lib/validation";

export const login = createServerAction({
  actionName: "login",
  schema: z.object({
    email: RequiredEmail,
    callbackUrl: z.string().nullable(),
  }),
  action: async ({ input: { email, callbackUrl } }) => {
    await signIn("email", {
      email,
      redirect: false,
      callbackUrl: callbackUrl ?? "/dashboard",
    });
  },
});
