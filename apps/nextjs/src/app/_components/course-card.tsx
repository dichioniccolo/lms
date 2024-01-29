import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Image } from "@acme/ui/components/image";

import { formatPrice } from "~/lib/utils";
import { CourseProgress } from "./course-progress";
import { IconBadge } from "./icon-badge";

interface Props {
  course: {
    description: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    title: string;
    imageUrl: string | null;
    price: string | null;
    published: boolean;
    categories: {
      category: {
        name: string;
      };
    }[];
    chapters: unknown[];
  };
  progress: number | null;
}

export function CourseCard({ course, progress }: Props) {
  return (
    <Link href={`/dashboard/courses/${course.id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            fill
            className="object-cover"
            alt={course.title}
            src={course.imageUrl ?? ""}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
            {course.title}
          </div>
          <p className="text-muted-foreground text-xs">
            {course.categories.map((c) => c.category.name).join(", ")}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {course.chapters.length}{" "}
                {course.chapters.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md font-medium text-slate-700 md:text-sm">
              {course.price ? formatPrice(parseFloat(course.price)) : "Free"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
