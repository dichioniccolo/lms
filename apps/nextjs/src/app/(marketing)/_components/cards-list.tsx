import { getPublishedCourses } from "~/app/_api/get-published-courses";
import { CourseCard } from "./course-card";

export async function CardsList() {
  const courses = await getPublishedCourses();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(max(var(--min-column-width),var(--max-column-width)),1fr))] content-start gap-x-[--column-gap] gap-y-32 [--column-gap:12px] [--max-column-count:5] [--max-column-width:calc((100%-var(--total-gap-width))/var(--max-column-count))] [--min-column-width:300px] [--total-gap-width:calc((var(--max-column-count)-1)*var(--column-gap))] sm:gap-y-40 sm:[--column-gap:24px] sm:[--min-column-width:324px] md:[--min-column-width:384px]">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
