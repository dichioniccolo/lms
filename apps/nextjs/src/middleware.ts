import { NextResponse } from "next/server";

import { auth } from "@acme/auth";

import { parseRequest } from "./lib/utils";

export default auth((req) => {
  const { path } = parseRequest(req);

  if (path === "/") {
    return NextResponse.next();
  }

  if (!req.auth?.user && path !== "/login") {
    const url = new URL("/login", req.url);
    if (path !== "/dashboard") url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  if (!!req.auth?.user && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    {
      source:
        "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};