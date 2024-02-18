import Image from "next/image";
import Link from "next/link";

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
        className="h-auto w-full overflow-hidden rounded-3xl md:hidden"
        priority
      />

      <div className="relative hidden w-full overflow-hidden rounded-[28px] transition duration-300 md:block md:bg-foreground/[0.04] md:pb-7 md:pt-6 md:group-hover:bg-foreground/[0.06]">
        <Image
          src={course.imageUrl!}
          alt={course.title}
          width={300}
          height={800}
          className="max-h-[583px] overflow-hidden rounded-3xl"
        />
        {/* <Carousel
      setApi={setApi}
      className="m-0"
      opts={{
        align: "end",
        duration: 20,
      }}
    >
      <CarouselContent className="m-0">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index} className="px-7">
            <Image
              src={PhoneScreen}
              alt="phone screen"
              width={300}
              height={800}
              className="rounded-3xl overflow-hidden max-h-[583px]"
              priority={index === 0 ? true : false}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant="ghost"
        className={cn(
          "invisible group-hover:visible ml-14 rounded-xl size-10 bg-background z-50",
          scrollPrev ? "" : "hidden"
        )}
      />
      <CarouselNext
        variant="ghost"
        className={cn(
          "invisible group-hover:visible mr-14 rounded-xl size-10 bg-background z-50",
          scrollNext ? "" : "hidden"
        )}
      />
    </Carousel> */}

        {/* <div className="invisible absolute bottom-3 left-1/2 z-10 -translate-x-1/2 transform group-hover:visible">
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                className="relative size-1.5 overflow-hidden rounded-full"
              >
                <div className="absolute h-full w-full bg-muted-foreground/30 dark:bg-muted-foreground/70"></div>
                <div
                  className={cn(
                    "relative z-10 h-full w-0 bg-primary",
                    // current === index + 1 ? "w-full" : "",
                  )}
                />
              </button>
            ))}
          </div>
        </div> */}
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
