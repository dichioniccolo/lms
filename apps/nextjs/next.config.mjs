// Importing env files here to validate on build
import "@acme/auth/env";
import "@acme/db/env";
import "@acme/inngest/env";
import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/api",
    "@acme/auth",
    "@acme/db",
    "@acme/emails",
    "@acme/inngest",
    "@acme/server-actions",
    "@acme/ui",
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;