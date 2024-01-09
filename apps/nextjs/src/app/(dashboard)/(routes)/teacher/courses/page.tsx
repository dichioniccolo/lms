import { redirect } from "next/navigation";

import { and, db, desc, eq, schema } from "@acme/db";

import { getCurrentUser } from "~/app/_api/get-user";
import { CoursesTable } from "./_components/courses-table";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const courses = await db.query.courses.findMany({
    where: and(eq(schema.courses.ownerId, user.id)),
    orderBy: desc(schema.courses.createdAt),
  });

  return (
    <div className="p-6">
      <CoursesTable courses={courses} />
    </div>
  );
}
