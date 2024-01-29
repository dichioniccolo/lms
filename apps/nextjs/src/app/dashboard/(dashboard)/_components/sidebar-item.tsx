"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@acme/ui";

interface Props {
  route: {
    icon: LucideIcon;
    label: string;
    href: string;
  };
}

export function SidebarItem({ route }: Props) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(route.href);

  return (
    <Link
      href={route.href}
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        {
          "bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700":
            isActive,
        },
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <route.icon
          size={22}
          className={cn("text-slate-500", {
            "text-sky-700": isActive,
          })}
        />
        {route.label}
      </div>
      <div
        className={cn(
          "ml-auto h-full border-2 border-sky-700 opacity-0 transition-all",
          {
            "opacity-100": isActive,
          },
        )}
      />
    </Link>
  );
}
