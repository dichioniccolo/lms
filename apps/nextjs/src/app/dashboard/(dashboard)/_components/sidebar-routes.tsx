"use client";

import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { BarChart, Compass, Layout, List } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

export interface SidebarRoute {
  icon: LucideIcon;
  label: string;
  href: Route;
}

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Cerca",
    href: "/dashboard/search",
  },
] satisfies SidebarRoute[];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/dashboard/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/dashboard/teacher/analytics",
  },
] satisfies SidebarRoute[];

export function SidebarRoutes() {
  const pathname = usePathname();

  const isTeacherPage = pathname.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex w-full flex-col">
      {routes.map((route, index) => (
        <SidebarItem key={index} route={route} />
      ))}
    </div>
  );
}
