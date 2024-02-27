import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getCourseUsers } from "~/app/_api/teacher/get-course-users";
import { UsersTable } from "./users-table";

interface Props {
  params: {
    courseId: string;
  };
}

export default async function Page({ params: { courseId } }: Props) {
  const { data } = await getCourseUsers({ courseId });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/dashboard/teacher/courses/${courseId}`}
            className="mb-6 flex items-center text-sm transition hover:opacity-75"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to course setup
          </Link>
        </div>
      </div>
      <UsersTable users={data ?? []} />
    </div>
  );
}
