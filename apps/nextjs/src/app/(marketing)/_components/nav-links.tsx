"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@acme/ui/components/ui/button";

const links = [
  { name: "Login", path: "/login" },
  // { name: "Android", path: "/browse/android" },
  // { name: "Web", path: "/browse/web" },
];

export const NavLinks = () => {
  const params = useParams<{ platform: string; feature: string }>();

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
            href={link.path + "/" + params.feature}
            className={
              link.path === `/browse/${params.platform}`
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }
          >
            {link.name}
          </Link>
        </Button>
      ))}
    </>
  );
};
