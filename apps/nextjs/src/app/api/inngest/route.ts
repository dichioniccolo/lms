import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { userLoginLink } from "./functions/user/login-link";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userLoginLink],
});
