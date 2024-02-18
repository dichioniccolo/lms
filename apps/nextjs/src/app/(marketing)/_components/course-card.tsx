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
        className="peer absolute inset-0 z-10"
      />

      <Image
        src={course.imageUrl!}
        alt={course.title}
        width={300}
        height={800}
        className="overflow-hidden rounded-3xl md:hidden"
        priority
      />
      <div className="relative hidden w-full overflow-hidden rounded-[28px] transition duration-300 md:block md:bg-foreground/[0.04] md:group-hover:bg-foreground/[0.06]">
        <AspectRatio ratio={16 / 9}>
          {/* <div className="relative hidden w-full overflow-hidden rounded-[28px] transition duration-300 md:block md:bg-foreground/[0.04] md:pb-7 md:pt-6 md:group-hover:bg-foreground/[0.06]"> */}
          <Image
            src={course.imageUrl!}
            alt={course.title}
            width={300}
            height={800}
            className="max-h-[583px] overflow-hidden rounded-3xl"
          />
        </AspectRatio>{" "}
      </div>

      <div className="flex w-full items-center gap-x-3">
        {/* <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#eaeaea]" /> */}

        <div className="flex grow flex-col">
          <span className="text-body-medium-bold line-clamp-1 underline decoration-transparent transition-colors ease-out group-hover:decoration-current">
            {course.title}
          </span>
          <span className="line-clamp-1 text-sm font-normal text-muted-foreground">
            {course.description}
          </span>
        </div>
      </div>
    </div>
  );
}
