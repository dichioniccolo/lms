import type { NextRequest } from "next/server";

import { env } from "~/env.mjs";

export function parseRequest(req: NextRequest) {
  let domain = req.headers.get("host")!;
  domain = domain.replace("www.", ""); // remove www. from domain

  const path = req.nextUrl.pathname;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const key = decodeURIComponent(path.split("/")[1]);
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, key, fullKey };
}

export function isTeacher(email: string) {
  const teacherEmails = env.NEXT_PUBLIC_TEACHER_EMAILS.split(",");

  return teacherEmails.includes(email);
}

export function formatPrice(price: number) {
  return price.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
}
