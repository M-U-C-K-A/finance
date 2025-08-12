// app/(app)/api/access/page.tsx
import Unauthorized from "@/components/layout/unauthorized"
import ApiAccessClientPage from "./apiAccessClientPage"
import { getUser } from "@/lib/auth-server"

export default async function ApiAccessPage() {
  const user = await getUser()
  if (!user) {
    return <Unauthorized />
  }

  return <ApiAccessClientPage />
}
