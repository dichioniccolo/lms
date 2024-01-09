"use server";

import { z } from "zod";

import { and, db, eq, schema } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";
import { stripe } from "@acme/stripe";

import { RequiredString } from "~/lib/validation";
import { authenticatedMiddlewares } from "../middlewares/user";

export const purchaseCourse = createServerAction({
  actionName: "purchaseCourse",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    courseId: RequiredString,
  }),
  initialState: null as string | null,
  action: async ({ input: { courseId }, ctx: { user } }) => {
    const course = await db
      .select({
        id: schema.courses.id,
        title: schema.courses.title,
        description: schema.courses.description,
        price: schema.courses.price,
        user: {
          id: schema.usersCourses.userId,
        },
      })
      .from(schema.courses)
      .leftJoin(
        schema.usersCourses,
        and(
          eq(schema.usersCourses.courseId, schema.courses.id),
          eq(schema.usersCourses.userId, user.id),
        ),
      )
      .leftJoin(schema.users, eq(schema.users.id, schema.usersCourses.userId))
      .where(
        and(
          eq(schema.courses.id, courseId),
          eq(schema.courses.published, true),
        ),
      )
      .then((x) => x[0]);

    if (!course) {
      throw new ErrorForClient("Course not found or not published");
    }

    if (course.user?.id) {
      throw new ErrorForClient("Course already purchased");
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(schema.users.id, user.id),
      columns: {
        email: true,
        stripeCustomerId: true,
      },
    });

    if (!dbUser) {
      throw new ErrorForClient("User not found"); // impossible
    }

    let stripeCustomerId = dbUser.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
      });

      stripeCustomerId = customer.id;

      await db
        .update(schema.users)
        .set({
          stripeCustomerId,
        })
        .where(eq(schema.users.stripeCustomerId, user.id));
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "EUR",
            product_data: {
              name: course.title,
              description: course.description ?? "",
            },
            unit_amount: Math.round(course.price * 100),
          },
        },
      ],
      success_url: "", // TODO:
      cancel_url: "", // TODO:
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return session.url;
  },
});
