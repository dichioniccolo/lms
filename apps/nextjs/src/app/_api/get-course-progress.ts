import { and, db, eq, inArray, schema, withCount } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getCourseProgress(courseId: string) {
  const user = await getCurrentUser();

  return await getUserCourseProgress(user.id, courseId);
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  const publishedChapters = await db
    .select({
      id: schema.chapters.id,
    })
    .from(schema.chapters)
    .where(
      and(
        eq(schema.chapters.courseId, courseId),
        eq(schema.chapters.published, true),
      ),
    );

  const publishedChapterIds = publishedChapters.map((x) => x.id);

  const completedChapters = await withCount(
    schema.usersChaptersProgresses,
    and(
      eq(schema.usersChaptersProgresses.userId, userId),
      inArray(schema.usersChaptersProgresses.chapterId, publishedChapterIds),
      eq(schema.usersChaptersProgresses.completed, true),
    ),
  );

  const percentage = (completedChapters / publishedChapterIds.length) * 100;

  return percentage;
}
