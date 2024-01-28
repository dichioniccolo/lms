import { renderAsync } from "@react-email/render";

import type { SendMailOptions } from "@acme/emails";
import { sendMail as baseSendMail } from "@acme/emails";

type MailOptions = SendMailOptions & {
  react: React.ReactElement;
};

export async function sendMail({ react, ...options }: MailOptions) {
  try {
    const html = await renderAsync(react);

    await baseSendMail({
      ...options,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
