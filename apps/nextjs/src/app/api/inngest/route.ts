import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { courseInvitation } from "./functions/courses/invitation";
import { coursePurchased } from "./functions/courses/purchased";
import { userLoginLink } from "./functions/user/login-link";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [userLoginLink, courseInvitation, coursePurchased],
});
