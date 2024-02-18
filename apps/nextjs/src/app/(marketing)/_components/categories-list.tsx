"use client";

import { Settings2 } from "lucide-react";

import { Button } from "@acme/ui/components/ui/button";
import { Separator } from "@acme/ui/components/ui/separator";

import { useSearchModal } from "~/hooks/use-search-modal";

export function CategoriesList() {
  const searchModal = useSearchModal();

  return (
    <div className="-margin-x -my-3 flex items-center gap-4">
      <Button
        size="lg"
        variant="secondary"
        onClick={searchModal.onOpen}
        className="hidden rounded-full md:block"
      >
        <div className="flex items-center gap-x-2">
          <Settings2 className="size-4" />
          <span>Filtri</span>
        </div>
      </Button>

      <Separator orientation="vertical" className="hidden h-8 md:block" />
      <div className="flex-grow overflow-hidden">
        {/* <CarouselButtonsTags /> */}
      </div>
    </div>
  );
}
