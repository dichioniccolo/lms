"use server";

import { cache } from "react";
import { notFound } from "next/navigation";

import { auth } from "@acme/auth";

export const getCurrentUser = cache(async () => {
  const session = await auth();

  if (!session?.user) {
    notFound();
  }

  const { id, email, name, image } = session.user;

  return {
    id,
    name,
    email,
    image,
  };
});
