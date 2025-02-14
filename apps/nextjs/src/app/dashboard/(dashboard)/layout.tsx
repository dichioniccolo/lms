import type { ServerRuntime } from "next";
import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { DashboardProviders } from "./providers";

// export const runtime: ServerRuntime = "edge";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <DashboardProviders>
      <div className="h-full">
        <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-56">
          <Navbar session={session} />
        </div>
        <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
          <Sidebar />
        </div>
        <main className="h-full pt-20 md:pl-56">{children}</main>
      </div>
    </DashboardProviders>
  );
}
