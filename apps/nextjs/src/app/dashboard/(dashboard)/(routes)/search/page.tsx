import { redirect } from "next/navigation";

import { getCourses } from "~/app/_api/get-courses";
import { getCurrentUser } from "~/app/_api/get-user";
import { CoursesList } from "~/app/_components/courses-list";
import { SearchInput } from "~/app/_components/search-input";

interface Props {
  searchParams: {
    title?: string | null;
  };
}

export default async function Page({ searchParams: { title } }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const courses = await getCourses({ user, title });

  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput title={title} />
      </div>
      <div className="space-y-4 p-6">
        {/* <Categories
          items={categories}
        /> */}
        <CoursesList items={courses} />
      </div>
    </>
  );
}
