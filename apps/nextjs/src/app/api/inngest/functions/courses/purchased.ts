import { createId, db, eq, schema } from "@acme/db";
import { CoursePurchased } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const coursePurchased = inngest.createFunction(
  {
    id: "lms/course/purchased",
    name: "Course Purchased",
  },
  {
    event: "lms/course/purchased",
  },
  async ({ event, step }) => {
    const { course, user } = event.data;

    const promises = [
      step.run("Send purchase email", async () => {
        await sendMail({
          to: user.email,
          subject: "Congratulazioni! Da ora puoi iniziare il tuo percorso",
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
        // await db.transaction(async (tx) => {
        await db.insert(schema.usersCourses).values({
          courseId: course.id,
          userId: user.id,
        });

        await db
          .update(schema.users)
          .set({
            stripeCustomerId: user.stripeCustomerId,
          })
          .where(eq(schema.users.id, user.id));
        // });
      }),
    ];

    await Promise.all(promises);
  },
);
