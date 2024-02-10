"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, LogOut, Pencil } from "lucide-react";

import type { Session } from "@acme/auth";
import { buttonVariants } from "@acme/ui/components/ui/button";

import { isTeacher } from "~/lib/utils";
import { SearchInput } from "./search-input";
import { UserDropdown } from "./user-dropdown";

interface Props {
  session: Session;
}

export function NavbarRoutes({ session }: Props) {
  const pathname = usePathname();

  const isTeacherPage = pathname.includes("/teacher");
  const isSearchPage = pathname === "/dashboard/search";
  const isCoursePage =
    !isTeacherPage &&
    pathname.includes("/courses") &&
    pathname.includes("/courses");

  const isUserATeacher = isTeacher(session.user.role);

  return (
    <div className="flex flex-1 items-center justify-between">
      <div>
        {isCoursePage && (
          <Link
            href="/dashboard"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Layout className="mr-2 size-4" />
            Dashboard
          </Link>
        )}
        {isSearchPage && (
          <div className="hidden md:block">
            <SearchInput />
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        {isTeacherPage ? (
          <Link
            href="/dashboard"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <LogOut className="mr-2 size-4" />
            Student Mode
          </Link>
        ) : isUserATeacher ? (
          <Link
            href="/dashboard/teacher/courses"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Pencil className="mr-2 size-4" />
            Teacher Mode
          </Link>
        ) : null}
        <UserDropdown session={session} />
      </div>
    </div>
  );
}
