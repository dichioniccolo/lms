import type { SQL } from "@acme/db";
import { and, db, eq, ilike, schema } from "@acme/db";

import { getUserCourseProgress } from "./get-course-progress";

export async function getCourses({
  user,
  title,
}: {
  user: { id: string };
  title?: string | null;
}) {
  const where: SQL[] = [eq(schema.courses.published, true)];

  if (title) {
    where.push(ilike(schema.courses.title, `%${title}%`));
  }

  const courses = await db.query.courses.findMany({
    where: and(...where),
    with: {
      categories: {
        with: {
          category: true,
        },
      },
      chapters: {
        where: eq(schema.chapters.published, true),
        columns: {
          id: true,
        },
      },
      users: {
        where: eq(schema.usersCourses.userId, user.id),
      },
    },
  });

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

  return courseWithProgress;
}
