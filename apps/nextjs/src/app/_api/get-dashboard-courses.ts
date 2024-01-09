import { db, eq, schema } from "@acme/db";

import { getUserCourseProgress } from "./get-course-progress";
import { getCurrentUser } from "./get-user";

export async function getDashboardCourses() {
  const user = await getCurrentUser();

  const purchasedCourses = await db.query.usersCourses.findMany({
    where: eq(schema.usersCourses.userId, user.id),
    with: {
      course: {
        with: {
          categories: {
            with: {
              category: {
                columns: {
                  name: true,
                },
              },
            },
          },
          chapters: {
            where: eq(schema.chapters.published, true),
          },
        },
      },
    },
  });

  const courses = purchasedCourses.map((x) => x.course);

  const courseWithProgress: {
    course: (typeof courses)[number];
    progress: number;
  }[] = [];

  for (const course of courses) {
    const progress = await getUserCourseProgress(user.id, course.id);

    courseWithProgress.push({
      course,
      progress,
    });
  }

  const completedCourses = courseWithProgress.filter((x) => x.progress === 100);

  const coursesInProgress = courseWithProgress.filter(
    (x) => x.progress !== 100,
  );

  return {
    completedCourses,
    coursesInProgress,
  };
}
