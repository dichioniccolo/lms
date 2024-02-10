"use server";

import { signOut } from "@acme/auth";

export const logout = async () => {
  await signOut();
};
