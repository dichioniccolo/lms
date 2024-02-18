"use client";

import { Search } from "lucide-react";

import { Button } from "@acme/ui/components/ui/button";

import { useSearchModal } from "~/hooks/use-search-modal";

export function SearchButtonNav() {
  const searchModal = useSearchModal();

  return (
    <Button
      size="lg"
      variant="secondary"
      onClick={searchModal.onOpen}
      className="group relative h-10 w-full cursor-pointer justify-between rounded-full md:h-12"
      asChild
    >
      <div>
        <div className="flex items-center gap-x-2 px-4">
          <Search className="size-4 md:size-5" />
          <span className="text-sm text-muted-foreground/80 sm:text-base">
            Cerca corsi...
          </span>
        </div>
        <span className="pointer-events-none invisible absolute right-0 top-0 hidden h-full items-center justify-end gap-x-1 pr-5 group-hover:visible group-focus:visible sm:flex">
          <kbd className="pointer-events-none inline-flex size-6 select-none items-center justify-center gap-1 rounded border bg-background text-center text-lg font-medium text-muted-foreground">
            ⌘
          </kbd>
          <kbd className="pointer-events-none inline-flex size-6 select-none items-center justify-center gap-1 rounded border bg-background text-center text-xs font-medium text-muted-foreground">
            K
          </kbd>
        </span>
      </div>
    </Button>
  );
}
