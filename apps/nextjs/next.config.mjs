// Importing env files here to validate on build
import "@acme/auth/env.mjs";
import "@acme/db/env";
import "@acme/emails/env";
import "@acme/stripe/env";
import "./src/env.mjs";

// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src https://vercel.live/ https://vercel.com unsafe-inline unsafe-eval;
//   style-src 'self' 'unsafe-inline';
//   img-src * blob: data:;
//   base-uri 'self';
//   media-src https://cdn.bloghub.it;
//   connect-src *;
//   font-src 'self';
//   frame-src youtube.com www.youtube.com https://vercel.live/ https://vercel.com;
//   worker-src 'self' blob:;
//   child-src 'self' blob:;
// `;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  // {
  //   key: "Content-Security-Policy",
  //   value: ContentSecurityPolicy.replace(/\n/g, ""),
  // },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "same-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
  {
    key: "Permissions-Policy",
    value: "fullscreen=(self)",
  },
];

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "accademiadellarmonia.fra1.digitaloceanspaces.com",
        pathname: "**",
      },
    ],
  },
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/auth",
    "@acme/db",
    "@acme/emails",
    "@acme/inngest",
    "@acme/server-actions",
    "@acme/stripe",
    "@acme/ui",
  ],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    typedRoutes: true,
  },

  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  compiler: {
    removeConsole: {
      exclude: ["error", "warn"],
    },
  },
  productionBrowserSourceMaps: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};

export default config;
