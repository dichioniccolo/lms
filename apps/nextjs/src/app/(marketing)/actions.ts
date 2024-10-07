"use server";

import { cookies } from "next/headers";
import { addMonths } from "date-fns";

export const handleCookieAction = async (action: string) => {
  "use server";

  const c = cookies();

  const nowPlusOneMonth = addMonths(new Date(), 1);

  c.set("cookie_consent", action, { expires: nowPlusOneMonth });
};
