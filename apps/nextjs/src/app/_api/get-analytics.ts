import { and, db, eq, exists, schema } from "@acme/db";

export async function getAnalytics(userId: string) {
  const purchases = await db.query.usersCourses.findMany({
    where: and(
      eq(schema.usersCourses.invited, false),
      exists(
        db
          .select()
          .from(schema.courses)
          .where(and(eq(schema.courses.ownerId, userId))),
      ),
    ),
    with: {
      course: {
        columns: {
          id: true,
          title: true,
          price: true,
        },
      },
    },
  });

  const groupedEarnings = purchases.reduce(
    (acc, { course }) => {
      if (!course?.price) {
        return acc;
      }

      if (!acc[course.id]) {
        acc[course.id] = {
          title: course.title,
          earnings: 0,
        };
      }

      acc[course.id]!.earnings += parseFloat(course.price);

      return acc;
    },
    {} as Record<
      string,
      {
        title: string;
        earnings: number;
      }
    >,
  );

  const data = Object.entries(groupedEarnings).map(
    ([id, { title, earnings }]) => ({
      id,
      title,
      earnings,
    }),
  );

  const totalRevenue = data.reduce((acc, { earnings }) => acc + earnings, 0);

  const totalSales = purchases.length;

  return {
    data,
    totalRevenue,
    totalSales,
  };
}
