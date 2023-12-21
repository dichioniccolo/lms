import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { env } from "~/env.mjs";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "LMS Andrea Di Chio";
const description = "LMS Andrea Di Chio";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://lms.andreadichio.it"
      : "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://lms.andreadichio.it",
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    site: "@dichioniccolo",
    creator: "@dichioniccolo",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        {props.children}
      </body>
    </html>
  );
}
