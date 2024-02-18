import { cn } from "@acme/ui";

import { getPublishedCourses } from "~/app/_api/get-published-courses";
import { CourseCard } from "./course-card";

export async function CardsList() {
  const courses = await getPublishedCourses();

  return (
    <GridCard>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </GridCard>
  );
}

const GridCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className={cn(
      "grid grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))] content-start gap-x-[--column-gap] gap-y-8 [--column-gap:12px] [--max-column-count:7] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] [--min-column-width:169px] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] md:gap-y-10 md:[--column-gap:24px] md:[--min-column-width:208px] lg:[--min-column-width:243px]",
      // "max-sm:[&>*:nth-child(n+5)]:hidden max-md:[&>*:nth-child(n+7)]:hidden max-xl:[&>*:nth-child(n+9)]:hidden"
    )}
  >
    {children}
  </div>
);
