// app/settings/page.tsx
import { requireAuth } from "@/lib/auth-helper"
import SettingsPanel from "@/components/settings/settingsPanel"

export default async function SettingsPage() {
  const user = await requireAuth() // ✅ Côté serveur

  return <SettingsPanel user={user} /> // On passe l'utilisateur au client
}
