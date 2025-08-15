// app/(app)/api/access/page.tsx
import Unauthorized from "@/components/layout/unauthorized"
import ApiAccessClientPage from "./apiAccessClientPage"
import { getUser } from "@/lib/auth-server"

export const metadata = {
  title: 'API Access - FinAnalytics',
  description: 'Manage your API keys and access credentials for FinAnalytics programmatic access.',
};

export default async function ApiAccessPage() {
  const user = await getUser()
  if (!user) {
    return <Unauthorized />
  }

  return <ApiAccessClientPage />
}
