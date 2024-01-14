import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3000),
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    MUX_TOKEN_ID: z.string().min(1),
    MUX_TOKEN_SECRET: z.string().min(1),
    DO_ENDPOINT: z.string().url(),
    DO_REGION: z.string().min(1),
    DO_BUCKET_NAME: z.string().min(1),
    DO_ACCESS_KEY_ID: z.string().min(1),
    DO_SECRET_ACCESS_KEY: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_TEACHER_EMAILS: z.string().min(1),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
    DO_ENDPOINT: process.env.DO_ENDPOINT,
    DO_REGION: process.env.DO_REGION,
    DO_BUCKET_NAME: process.env.DO_BUCKET_NAME,
    DO_ACCESS_KEY_ID: process.env.DO_ACCESS_KEY_ID,
    DO_SECRET_ACCESS_KEY: process.env.DO_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_TEACHER_EMAILS: process.env.NEXT_PUBLIC_TEACHER_EMAILS,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
