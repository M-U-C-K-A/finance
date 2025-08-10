// src/lib/auth-helper.ts
import { auth } from "./auth";

export const getAuthUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

export const requireAuth = async () => {
  const user = await getAuthUser();
  if (!user) {
    // Soit renvoyer null, soit gérer autrement (ex: throw ou redirect côté page)
    return null;
  }
  return user;
};
