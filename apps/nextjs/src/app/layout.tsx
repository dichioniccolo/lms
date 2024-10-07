import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { cookies } from "next/headers";

import { cn } from "@acme/ui";

import { env } from "~/env.mjs";
import { CookieBanner } from "./(marketing)/_components/cookie-banner";
import { Providers } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "Accademia Dell'Armonia";
const description = "Accademia Dell'Armonia";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? env.NEXT_PUBLIC_APP_DOMAIN
      : "http://localhost:3000",
  ),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  authors: [
    {
      name: "Niccolò Di Chio",
      url: "https://github.com/dichioniccolo",
    },
  ],
  creator: "Niccolò Di Chio",
  openGraph: {
    title,
    description,
    url: `https://${env.NEXT_PUBLIC_APP_DOMAIN}`,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    site: "@dichioniccolo",
    creator: "@dichioniccolo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const consent = cookies().get("cookie_consent")?.value ?? "undecided";

  return (
    <html lang="en">
      <body className={cn(["font-sans", fontSans.variable])}>
        <Providers>{children}</Providers>
        <CookieBanner consent={consent} />
      </body>
    </html>
  );
}
