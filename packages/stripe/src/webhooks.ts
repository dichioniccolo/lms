"use server";

import type Stripe from "stripe";

import { and, db, eq, schema } from "@acme/db";
import { inngest } from "@acme/inngest";

export async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (!session.customer) {
        throw new Error("Customer not found");
      }

      const stripeCustomerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer.id;

      if (!session.metadata) {
        throw new Error("Metadata not found");
      }

      const { userId, courseId } = session.metadata;

      if (!userId) {
        throw new Error("Missing userId");
      }

      if (!courseId) {
        throw new Error("Missing courseId");
      }

      const course = await db.query.courses.findFirst({
        where: and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.published, true),
        ),
        columns: {
          id: true,
          title: true,
        },
      });

      if (!course) {
        throw new Error("Course not found");
      }

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
        columns: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await inngest.send({
        name: "lms/course/purchased",
        data: {
          course,
          user: {
            ...user,
            stripeCustomerId,
          },
        },
      });
      break;
    }
    // case "invoice.payment_succeeded": {
    //   break;
    // }
    // case "customer.subscription.updated": {
    //   const subscription = event.data.object;

    //   const stripeCustomerId =
    //     typeof subscription.customer === "string"
    //       ? subscription.customer
    //       : subscription.customer.id;

    //   const subscriptionPlan = stripePriceToSubscriptionPlan(
    //     subscription.items.data[0]?.price.id,
    //   );

    //   await db
    //     .update(schema.users)
    //     .set({
    //       stripeSubscriptionId: subscription.id,
    //       stripePriceId: subscriptionPlan.priceId,
    //       dayWhenBillingStarts: new Date(),
    //     })
    //     .where(eq(schema.users.stripeCustomerId, stripeCustomerId));
    //   break;
    // }
    // case "customer.subscription.deleted": {
    //   const subscription = event.data.object;

    //   const stripeCustomerId =
    //     typeof subscription.customer === "string"
    //       ? subscription.customer
    //       : subscription.customer.id;

    //   await db
    //     .update(schema.users)
    //     .set({
    //       stripeSubscriptionId: null,
    //       stripePriceId: null,
    //       dayWhenBillingStarts: new Date(),
    //     })
    //     .where(eq(schema.users.stripeCustomerId, stripeCustomerId));
    //   break;
    // }
  }
}
