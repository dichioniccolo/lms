import type { PropsWithChildren } from "react";

import { SearchCommandDialog } from "../_components/dialogs/search-command-dialog";
import { Navbar } from "./_components/navbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="isolate mx-auto flex max-w-[3840px] flex-col bg-primary-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>

        {/* <Footer /> */}
      </div>
      <SearchCommandDialog />
    </>
  );
}
