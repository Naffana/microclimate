"use server";

import { signIn } from "@/auth";

export async function login(role: string, password: string) {
  try {
    await signIn("credentials", {
      redirect: false,
      Role: role,
      password,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
