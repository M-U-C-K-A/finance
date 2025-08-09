// components/settings/securityForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function SecurityForm() {
  const [twoFA, setTwoFA] = useState(false)

  const handleSave = () => {
    console.log("2FA:", twoFA)
  }

  return (
    <div className="space-y-6">
      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Label>Activer la 2FA</Label>
          <Switch checked={twoFA} onCheckedChange={setTwoFA} />
        </CardContent>
      </Card>

      {/* Sessions actives */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions actives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Liste des appareils actuellement connectés à votre compte.
          </p>
          <ul className="space-y-1">
            <li>MacBook Pro — Paris, FR — 08/08/2025 <Button variant="ghost" size="sm">Déconnecter</Button></li>
            <li>iPhone 14 — Paris, FR — 05/08/2025 <Button variant="ghost" size="sm">Déconnecter</Button></li>
          </ul>
        </CardContent>
      </Card>

      {/* Historique des connexions */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des connexions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Dernières connexions détectées :
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>08/08/2025 — 14:32 — Paris, FR</li>
            <li>07/08/2025 — 19:12 — Paris, FR</li>
          </ul>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Enregistrer les paramètres</Button>
    </div>
  )
}
