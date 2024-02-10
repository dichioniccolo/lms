"use server";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id, email, name, image, role } = session.user;

  return {
    id,
    name,
    email,
    image,
    role,
  };
});
