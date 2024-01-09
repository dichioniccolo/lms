"use client";

import { usePathname } from "next/navigation";
import { LogOut, Pencil } from "lucide-react";

import type { Session } from "@acme/auth";
import { Link } from "@acme/ui/components/link";
import { buttonVariants } from "@acme/ui/components/ui/button";

import { isTeacher } from "~/lib/utils";
import { SearchInput } from "./search-input";
import { UserDropdown } from "./user-dropdown";

interface Props {
  session: Session;
}

export function NavbarRoutes({ session }: Props) {
  const pathname = usePathname();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isCoursePage = pathname.includes("/courses");
  const isSearchPage = pathname === "/search";

  const isUserATeacher = isTeacher(session.user.email);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex items-center gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link
            href="/"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Student Mode
          </Link>
        ) : isUserATeacher ? (
          <Link
            href="/teacher/courses"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Teacher Mode
          </Link>
        ) : null}
        <UserDropdown session={session} />
      </div>
    </>
  );
}
