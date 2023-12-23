import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { and, asc, db, eq, exists, schema, sql } from "@acme/db";

import { getCourseProgress } from "~/app/_api/get-course-progress";

export async function Layout({
  children,
  params: { courseId },
}: PropsWithChildren<{ params: { courseId: string } }>) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const course = await db.query.courses.findFirst({
    where: and(
      eq(schema.courses.id, courseId),
      eq(schema.courses.published, true),
      exists(
        db
          .select({ count: sql`count(1)` })
          .from(schema.usersCourses)
          .where(
            and(
              eq(schema.courses.id, schema.usersCourses.courseId),
              eq(schema.usersCourses, session.user.id),
            ),
          ),
      ),
    ),
    with: {
      chapters: {
        where: eq(schema.chapters.published, true),
        with: {
          progresses: {
            where: eq(schema.usersChaptersProgresses.userId, session.user.id),
          },
        },
        orderBy: asc(schema.chapters.position),
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const courseProgress = await getCourseProgress(course.id);

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-80">
        course navbar
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        course sidebar
      </div>
      <main className="h-full pt-20 md:pl-80">{children}</main>
    </div>
  );
}
