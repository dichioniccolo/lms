import type { ServerRuntime } from "next";
import { redirect } from "next/navigation";

import { and, asc, db, eq, schema } from "@acme/db";

interface Props {
  params: {
    courseId: string;
  };
}

export const runtime: ServerRuntime = "edge";

export default async function Page({ params: { courseId } }: Props) {
  const course = await db.query.courses.findFirst({
    where: and(
      eq(schema.courses.id, courseId),
      eq(schema.courses.published, true),
    ),
    with: {
      chapters: {
        where: eq(schema.chapters.published, true),
        orderBy: asc(schema.chapters.position),
        limit: 1,
        columns: {
          id: true,
        },
      },
    },
    columns: {
      id: true,
    },
  });

  if (!course) {
    return redirect("/dashboard");
  }

  const chapter = course.chapters[0];

  if (!chapter) {
    return redirect("/dashboard");
  }

  return redirect(`/dashboard/courses/${course.id}/chapters/${chapter.id}`);
}
