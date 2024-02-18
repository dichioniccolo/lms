"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandItem,
} from "@acme/ui/components/ui/command";
import { Input } from "@acme/ui/components/ui/input";
import { ScrollArea } from "@acme/ui/components/ui/scroll-area";
import { useDebounce } from "@acme/ui/hooks/use-debounce";

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

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setCourses(await getPublishedCourses(debouncedSearch));
      setLoading(false);
    };

    void load();
  }, [debouncedSearch]);

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
        {/* eslint-disable-next-line react/no-unknown-property */}
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <Search className="mr-2 size-4 shrink-0 opacity-50" />
          <Input
            placeholder="Cerca..."
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={search}
            onChange={(x) => setSearch(x.target.value)}
            className="flex !h-10 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:!h-12"
          />
        </div>

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
              <div className="relative size-full !max-h-none pb-10 pr-2 md:px-3">
                <div>
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
                          <div className="md:group-data-selected:-translate-y-5 flex max-w-[200px] cursor-pointer flex-col items-center gap-y-1 transition-transform duration-300 ease-out md:group-hover:-translate-y-5">
                            <Image
                              src={course.imageUrl!}
                              alt={course.title}
                              width={200}
                              height={200}
                              className="size-40 shrink-0 overflow-hidden rounded-2xl object-cover"
                              priority
                            />
                            <p className="shrink-0 truncate text-xs font-normal text-muted-foreground">
                              {course.title}
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </div>
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
              </div>
            </ScrollArea>
          </>
        ) : !loading && courses.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : null}
      </section>
    </CommandDialog>
  );
}
