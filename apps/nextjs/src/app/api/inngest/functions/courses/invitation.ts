import { createId } from "@acme/db";
import { CourseInvitation } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const courseInvitation = inngest.createFunction(
  {
    id: "lms/course/invitation",
    name: "Course Invitation",
  },
  {
    event: "lms/course/invitation",
  },
  async ({ event }) => {
    const { course, user } = event.data;

    await sendMail({
      to: user.email,
      subject: `Sei stata/o invitata/o a visualizzare il corso ${course.title}`,
      react: CourseInvitation({
        siteName: env.NEXT_PUBLIC_APP_NAME,
        course,
        user,
      }),
      headers: {
        "X-Entity-Ref-ID": createId(),
      },
    });
  },
);
