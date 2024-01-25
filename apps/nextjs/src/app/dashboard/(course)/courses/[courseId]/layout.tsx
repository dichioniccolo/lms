import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";
import { and, asc, db, eq, schema } from "@acme/db";

import { getCourseProgress } from "~/app/_api/get-course-progress";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";

export default async function Layout({
  children,
  params: { courseId },
}: PropsWithChildren<{ params: { courseId: string } }>) {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  const course = await db.query.courses.findFirst({
    where: and(
      eq(schema.courses.id, courseId),
      eq(schema.courses.published, true),
      // exists(
      //   db
      //     .select()
      //     .from(schema.usersCourses)
      //     .where(
      //       and(
      //         eq(schema.courses.id, schema.usersCourses.courseId),
      //         eq(schema.usersCourses, session.user.id),
      //       ),
      //     ),
      // ),
    ),
    with: {
      users: {
        where: eq(schema.usersCourses.userId, session.user.id),
        limit: 1,
      },
      chapters: {
        where: eq(schema.chapters.published, true),
        with: {
          progresses: {
            where: eq(schema.usersChaptersProgresses.userId, session.user.id),
            columns: {
              completed: true,
            },
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

  const purchased = course.users.length > 0;

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-80">
        <CourseNavbar
          session={session}
          purchased={purchased}
          course={course}
          courseProgress={courseProgress}
        />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <CourseSidebar
          purchased={purchased}
          course={course}
          courseProgress={courseProgress}
        />
      </div>
      <main className="h-full pt-20 md:pl-80">{children}</main>
    </div>
  );
}
