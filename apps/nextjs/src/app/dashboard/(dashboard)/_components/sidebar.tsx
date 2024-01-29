import { Logo } from "@acme/ui/icons/logo";

import { env } from "~/env.mjs";
import { SidebarRoutes } from "./sidebar-routes";

export function Sidebar() {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm">
      <div className="p-6">
        <Logo src="/logo-full.png" alt={env.NEXT_PUBLIC_APP_NAME} size={200} />
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  );
}
