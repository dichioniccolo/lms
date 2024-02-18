import Link from "next/link";

import { Button } from "@acme/ui/components/ui/button";

import { SearchButtonNav } from "~/app/_components/search-button-nav";
import { env } from "~/env.mjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex h-[100px] border-b bg-background md:h-[72px] md:border-transparent">
      <div className="marge-x marge-x grid w-full grid-cols-[min-content_auto_min-content] grid-rows-[1fr_auto] items-center gap-x-2 md:grid-cols-[1fr_minmax(auto,500px)_1fr] lg:grid-rows-1">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-x-2">
            <span className="text-lg font-semibold">
              {env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
          <div className="hidden items-center gap-5 md:flex">
            {/* <NavLinks /> */}
          </div>
        </div>

        <div className="overflow-hidden px-1 py-2">
          <SearchButtonNav />
        </div>

        <div className="shrink-0 items-end">
          <div className="flex flex-row items-center justify-end gap-3">
            <div className="hidden flex-row items-center gap-3 lg:flex">
              <Button variant="ghost" size="lg" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
            {/* <NavMenu /> */}
          </div>
        </div>

        <div className="col-span-full row-start-2 flex md:hidden">
          <div className="flex h-11 items-center gap-x-4 py-1 md:h-[unset] md:gap-x-6 md:py-0">
            {/* <NavLinks /> */}
            <Button variant="ghost" size="lg" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
