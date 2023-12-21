"use server";

import type Stripe from "stripe";

import { db, eq, schema } from "@acme/db";

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

      await db.transaction(async (tx) => {
        await tx.insert(schema.usersCourses).values({
          courseId,
          userId,
        });

        await tx
          .update(schema.users)
          .set({
            stripeCustomerId,
          })
          .where(eq(schema.users.id, userId));
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
