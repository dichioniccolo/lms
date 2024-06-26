"use server";

import type { Attachment } from "@acme/db/types";
import { and, asc, db, eq, gt, schema } from "@acme/db";

import { getVideoUrl } from "../_actions/courses/get-video-url";
import { getSignedUrl } from "../_actions/files/get-signed-url";
import { getCurrentUser } from "./get-user";

export async function getChapter(courseId: string, chapterId: string) {
  const user = await getCurrentUser();

  const course = await db.query.courses.findFirst({
    where: and(
      eq(schema.courses.published, true),
      eq(schema.courses.id, courseId),
    ),
    with: {
      chapters: {
        where: and(
          eq(schema.chapters.published, true),
          eq(schema.chapters.id, chapterId),
        ),
        with: {
          progresses: {
            where: eq(schema.usersChaptersProgresses.userId, user.id),
            limit: 1,
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const chapter = course.chapters[0];

  if (!chapter) {
    return null;
  }

  const userCourse = await db.query.usersCourses.findFirst({
    where: and(
      eq(schema.usersCourses.userId, user.id),
      eq(schema.usersCourses.courseId, courseId),
    ),
    columns: {
      id: true,
    },
  });

  let attachments: Attachment[] = [];
  let nextChapter: { id: string } | undefined = undefined;

  if (userCourse) {
    attachments = await db.query.attachments.findMany({
      where: eq(schema.attachments.courseId, course.id),
    });

    const attachmentsWithNewUrls = await Promise.all(
      attachments.map(async (attachment) => {
        const url = await getSignedUrl(attachment.url);

        return {
          ...attachment,
          url,
        };
      }),
    );

    attachments = attachmentsWithNewUrls;
  }

  const isUnlocked = chapter.free || !!userCourse;

  if (isUnlocked) {
    nextChapter = await db.query.chapters.findFirst({
      where: and(
        eq(schema.chapters.published, true),
        eq(schema.chapters.courseId, courseId),
        gt(schema.chapters.position, chapter.position ?? 0),
      ),
      orderBy: asc(schema.chapters.position),
    });
  }

  const { data: videoUrl } = await getVideoUrl({
    courseId,
    chapterId,
  });

  return {
    course: {
      price: course.price!,
    },
    chapter,
    attachments,
    nextChapter,
    isUnlocked,
    videoUrl,
  };
}
