import { createId, db, eq, schema } from "@acme/db";
import { CoursePurchased } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const courseInvitation = inngest.createFunction(
  {
    id: "course/purchased",
    name: "Course Purchased",
  },
  {
    event: "course/purchased",
  },
  async ({ event, step }) => {
    const { course, user } = event.data;

    const promises = [
      step.run("Send purchase email", async () => {
        await sendMail({
          to: user.email,
          subject: "You have been invited to a course",
          react: CoursePurchased({
            siteName: env.NEXT_PUBLIC_APP_NAME,
            course,
            user,
          }),
          headers: {
            "X-Entity-Ref-ID": createId(),
          },
        });
      }),
      step.run("Set user as student", async () => {
        await db.transaction(async (tx) => {
          await tx.insert(schema.usersCourses).values({
            courseId: course.id,
            userId: user.id,
          });

          await tx
            .update(schema.users)
            .set({
              stripeCustomerId: user.stripeCustomerId,
            })
            .where(eq(schema.users.id, user.id));
        });
      }),
    ];

    await Promise.all(promises);
  },
);
