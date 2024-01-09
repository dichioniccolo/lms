import type { Session } from "@acme/auth";

import { NavbarRoutes } from "~/app/_components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

interface Props {
  session: Session;
}

export function Navbar({ session }: Props) {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes session={session} />
    </div>
  );
}
