import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { Providers } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "LMS Andrea Di Chio";
const description = "LMS Andrea Di Chio";

export const metadata: Metadata = {
  // metadataBase: new URL(
  //   env.VERCEL_ENV === "production"
  //     ? env.NEXT_PUBLIC_APP_DOMAIN
  //     : "http://localhost:3000",
  // ),
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
    url: "https://lms.andreadichio.it",
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

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
