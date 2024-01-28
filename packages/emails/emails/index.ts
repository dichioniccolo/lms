import type { SendMailOptions } from "nodemailer";
import nodemailer from "nodemailer";

import { env } from "../env.mjs";

const defaultOptions = {
  from: env.SMTP_FROM,
} satisfies Pick<SendMailOptions, "from">;

const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendMail({
  ...options
}: Partial<CreateEmailOptionsWithoutFrom>) {
  const payload = {
    ...defaultOptions,
    ...options,
  } as SendMailOptions;

  const result = await transport.sendMail(payload);

  return result;
}

type CreateEmailOptionsWithoutFrom = Omit<SendMailOptions, "from">;

export type { CreateEmailOptionsWithoutFrom as SendMailOptions };
