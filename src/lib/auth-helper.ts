// src/lib/auth-helper.ts
import { unauthorized } from "next/navigation"
import { auth } from "./auth"  // on importe "auth" et pas "baseAuth"

export const getAuthUser = async () => {
  const session = await auth()
  return session?.user
}

export const requireAuth = async () => {
  const user = await getAuthUser()
  if (!user) {
    unauthorized()
  }
  return user
}
