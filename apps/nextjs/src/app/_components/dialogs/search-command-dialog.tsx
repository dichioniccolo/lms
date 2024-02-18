"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@acme/ui/components/ui/command";
import { ScrollArea } from "@acme/ui/components/ui/scroll-area";

import { getPublishedCourses } from "~/app/_api/get-published-courses";
import { useSearchModal } from "~/hooks/use-search-modal";

export function SearchCommandDialog() {
  const searchModal = useSearchModal();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<
    Awaited<ReturnType<typeof getPublishedCourses>>
  >([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchModal.onOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchModal]);

  // const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setCourses(await getPublishedCourses());
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <CommandDialog
      open={searchModal.isOpen}
      onOpenChange={searchModal.onClose}
      className={cn(
        "h-full max-w-full !rounded-none sm:max-w-[816px] md:top-0 md:h-[720px] md:max-h-[calc(100vh-8px)] md:!translate-y-0 md:!rounded-3xl",
        "data-[state=closed]:max-md:!slide-out-to-bottom-5 data-[state=open]:max-md:!slide-in-from-bottom-5",
        "data-[state=closed]:max-md:!zoom-out-100 data-[state=open]:max-md:!zoom-in-100",
        "search-command pt-1.5 md:pt-3",
      )}
    >
      <div className="flex w-full items-center gap-x-0 [&_[cmdk-input-wrapper]]:flex [&_[cmdk-input-wrapper]]:grow">
        <CommandInput
          placeholder="Search..."
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={search}
          onValueChange={setSearch}
          className="!h-10 md:!h-12"
        />

        <Button
          variant="ghost"
          className="block pl-0 hover:!bg-transparent md:hidden"
          onClick={searchModal.onClose}
        >
          Cancel
        </Button>
      </div>

      <section className="flex size-full overflow-hidden pl-3 pt-2">
        {loading && <CommandEmpty>Loading...</CommandEmpty>}
        {!loading && courses.length > 0 ? (
          <>
            {/* <CommandCategoriesList
              category={category}
              setCategory={setCategory}
            /> */}

            <ScrollArea className="w-full">
              <CommandList className="relative size-full !max-h-none pb-10 pr-2 md:px-3">
                <CommandGroup>
                  <div className="flex flex-nowrap gap-x-2 [&_[cmdk-item]]:shrink-0">
                    {courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        className="group relative rounded-t-2xl !p-0 md:!bg-transparent"
                      >
                        <span className="sr-only">{course.title}</span>

                        <Link
                          href={`/dashboard/courses/${course.id}`}
                          className="peer absolute inset-0 z-20"
                        />
                        <div className="z-10 shrink-0 overflow-hidden rounded-t-2xl md:h-40">
                          <div className="md:group-data-selected:-translate-y-5 flex cursor-pointer flex-col items-center gap-y-1 transition-transform duration-300 ease-out md:group-hover:-translate-y-5">
                            <Image
                              src={course.imageUrl!}
                              alt={course.title}
                              width={200}
                              height={200}
                              className="size-40 shrink-0 overflow-hidden rounded-2xl object-cover"
                              priority
                            />
                            <span className="shrink-0 truncate text-center text-xs font-normal text-muted-foreground">
                              {course.title}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
                {/* {category === "trending" && (
                  <>
                    <CommandItem className="absolute inset-0 z-0 !bg-transparent !text-transparent">
                      hidden item
                    </CommandItem>
                    <Trending />
                  </>
                )}

                {category === "screens" && (
                  <ItemsLinesHoverCard title="Screens -- Hover Card" />
                )}

                {category === "ui-elements" && (
                  <ItemsLinesHoverCard title="UI Elements -- Hover Card" />
                )}

                {category === "flows" && (
                  <ItemsLines title="Flows -- NOT Hover Card" />
                )} */}
              </CommandList>
            </ScrollArea>
          </>
        ) : !loading && courses.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}
      </section>
    </CommandDialog>
  );
}
