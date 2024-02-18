import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "@acme/ui/components/ui/aspect-ratio";

interface Props {
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
}

export function CourseCard({ course }: Props) {
  return (
    <div className="group relative flex flex-col gap-y-3 md:gap-y-4">
      <Link
        href={`/dashboard/courses/${course.id}`}
        className="peer absolute inset-0 focus-visible:ring-4 focus-visible:ring-blue-200/50"
      />
      <div className="relative overflow-hidden p-[1px] sm:rounded-md sm:bg-secondary sm:px-7 sm:pb-7 sm:pt-6">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={course.imageUrl!}
            alt={course.title}
            priority
            fill
            className="h-full w-full object-cover object-top"
          />
        </AspectRatio>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="flex grow flex-col">
          <span className="line-clamp-1 text-base font-medium text-primary underline decoration-transparent transition-colors ease-out group-hover:decoration-current">
            {course.title}
          </span>
          <span className="line-clamp-1 text-sm text-muted-foreground">
            {course.description}
          </span>
        </div>
      </div>
    </div>
  );
}
