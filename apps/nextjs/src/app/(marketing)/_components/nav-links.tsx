"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";

import { Button } from "@acme/ui/components/ui/button";

const links = [{ name: "Login", path: "/login" }] satisfies {
  name: string;
  path: LinkProps<unknown>["href"];
}[];

export const NavLinks = () => {
  return (
    <>
      {links.map((link) => (
        <Button
          key={link.path}
          variant="link"
          size="lg"
          className="px-0"
          asChild
        >
          <Link
            href={link.path}
            className="text-muted-foreground hover:text-primary"
          >
            {link.name}
          </Link>
        </Button>
      ))}
    </>
  );
};
