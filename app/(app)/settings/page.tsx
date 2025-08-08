// app/settings/page.tsx
import { requiredAuth } from "@/lib/auth-helper"
import SettingsPanel from "@/components/settings/settingsPanel"

export default async function SettingsPage() {
  const user = await requiredAuth() // ✅ Côté serveur

  return <SettingsPanel user={user} /> // On passe l'utilisateur au client
}
