import type { CreateEmailOptions } from "@acme/emails";
import { sendMail as baseSendMail } from "@acme/emails";

type MailOptions = CreateEmailOptions;

export async function sendMail(options: MailOptions) {
  try {
    await baseSendMail(options);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
