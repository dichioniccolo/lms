import { CourseProgress } from "~/app/_components/course-progress";
import { CourseSidebarItem } from "./course-sidebar-item";

interface Props {
  purchased: boolean;
  course: {
    id: string;
    title: string;
    chapters: {
      id: string;
      courseId: string;
      title: string;
      free: boolean;
      progresses:
        | {
            completed: boolean;
          }[]
        | undefined;
    }[];
  };
  courseProgress: number;
}

export function CourseSidebar({ course, purchased, courseProgress }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course.title}</h1>
        {purchased && (
          <div className="mt-10">
            <CourseProgress variant="success" value={courseProgress} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            courseId={course.id}
            chapter={chapter}
            purchased={purchased}
          />
        ))}
      </div>
    </div>
  );
}
