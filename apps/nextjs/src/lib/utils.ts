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

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

export function absoluteUrl(path?: string, withProtocol = true) {
  if (!path) {
    return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}`;
  }

  return `${withProtocol ? getProtocol() : ""}${getBaseUrlPath()}${path}`;
}

export function subdomainUrl(
  domain: string,
  path?: string,
  options: { withProtocol?: boolean } = { withProtocol: true },
) {
  if (!path) {
    return `${
      options?.withProtocol ? getProtocol() : ""
    }${domain}.${getBaseUrlPath()}`;
  }

  return `${
    options?.withProtocol ? getProtocol() : ""
  }${domain}.${getBaseUrlPath()}${path}`;
}

export function getProtocol() {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//`;
  }

  return env.NODE_ENV === "production" ? "https://" : "http://";
}

export function getBaseUrlPath() {
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/^https?:\/\//, "");
  }

  if (env.NODE_ENV === "production") {
    return env.NEXT_PUBLIC_APP_DOMAIN;
  }

  return "localhost:3000";
}

export function constructPostUrl(
  domain: string,
  slug: string,
  options: { withProtocol?: boolean; noDomain?: boolean } = {
    withProtocol: true,
    noDomain: false,
  },
) {
  if (options?.noDomain) {
    return `/${slug}`;
  }

  const link = `https://${domain}/${slug}`;

  return options?.withProtocol ? link : link.replace(/^https?:\/\//, "");
}
