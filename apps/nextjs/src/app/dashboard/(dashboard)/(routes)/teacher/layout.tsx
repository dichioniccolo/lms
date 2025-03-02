import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "~/app/_api/get-user";
import { isTeacher } from "~/lib/utils";

export default async function Layout({ children }: PropsWithChildren) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isTeacher(user.role)) {
    redirect("/");
  }

  return <>{children}</>;
}
