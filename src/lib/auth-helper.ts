import { auth } from "./auth";

export const getAuthUser = async () => {
  const session = await auth(); // Utilisation de la nouvelle API v5
  return session?.user ?? null;
};

export const requireAuth = async () => {
  return await getAuthUser();
};
