import { Menu } from "lucide-react";

import type { Session } from "@acme/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@acme/ui/components/ui/sheet";

import { NavbarRoutes } from "~/app/_components/navbar-routes";
import { CourseSidebar } from "./course-sidebar";

interface Props {
  session: Session;
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
  purchased: boolean;
  courseProgress: number;
}

export function CourseNavbar({
  session,
  course,
  purchased,
  courseProgress,
}: Props) {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <Sheet>
        <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-white p-0">
          <CourseSidebar
            course={course}
            purchased={purchased}
            courseProgress={courseProgress}
          />
        </SheetContent>
      </Sheet>
      <NavbarRoutes session={session} />
    </div>
  );
}
