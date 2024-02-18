import Link from "next/link";

import { Button } from "@acme/ui/components/ui/button";

import { SearchButtonNav } from "~/app/_components/search-button-nav";
import { env } from "~/env.mjs";
import { NavLinks } from "./nav-links";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10">
      <nav className="border-divider-primary border-b bg-primary-foreground md:border-0">
        <div className="grid w-full grid-cols-[min-content_auto_min-content] grid-rows-[1fr_auto] items-center gap-x-8 px-4 pl-16 pr-8 sm:gap-x-12 min-[720px]:px-6 md:grid-cols-[1fr_minmax(auto,520px)_1fr] md:grid-rows-1 min-[1280px]:px-8 min-[1536px]:px-20">
          <div className="flex items-center gap-x-16 md:gap-x-32">
            <Link
              href="/"
              className="focus-visible:ring-4 focus-visible:ring-blue-200/50"
            >
              <span className="text-lg font-semibold text-[#1276bc]">
                {env.NEXT_PUBLIC_APP_NAME}
              </span>
            </Link>
            {/* <div className="hidden items-center gap-5 md:flex">
            <NavLinks />
          </div> */}
          </div>

          <div className="overflow-hidden px-4 py-8">
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

          <div className="col-span-full row-start-2 md:hidden">
            <div className="flex h-[44px] items-center gap-x-16 py-4 md:h-[unset] md:gap-x-24 md:py-0">
              <NavLinks />
              {/* <Button variant="ghost" size="lg" asChild>
              <Link href="/login">Login</Link>
            </Button> */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
