// app/(home)/signin/actions.ts
"use server";

import { signIn } from "@/lib/auth"; // ta fonction d'authentification côté serveur

export async function handleSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ici tu appelles ta fonction d'auth (adaptée à ton backend)
  await signIn(email, password);

  // éventuellement rediriger ou revalider la page
}
