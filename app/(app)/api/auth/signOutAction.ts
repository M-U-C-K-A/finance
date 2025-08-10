// app/(app)/api/auth/signOutAction.ts
"use server";

import { signOut } from "next-auth/react";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  await signOut();
  revalidatePath("/");
}
