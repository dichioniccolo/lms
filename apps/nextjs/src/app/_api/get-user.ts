"use server";

import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export const getCurrentUser = async () => {
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
};
