import { createId, db, eq, schema } from "@acme/db";
import { LoginLink } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const userLoginLink = inngest.createFunction(
  {
    id: "lms/user/login-link",
    name: "User Login Link",
  },
  {
    event: "lms/user/login-link",
  },
  async ({ event }) => {
    const { email, url } = event.data;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      columns: {
        name: true,
      },
    });

    await sendMail({
      to: email,
      subject: "Your login link",
      react: LoginLink({
        siteName: env.NEXT_PUBLIC_APP_NAME,
        url,
        userName: user?.name,
        userEmail: email,
      }),
      headers: {
        "X-Entity-Ref-ID": createId(),
      },
    });
  },
);
