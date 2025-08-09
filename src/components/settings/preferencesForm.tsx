// components/settings/preferencesForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

export function PreferencesForm() {
  const { handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log("Préférences :", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Langue</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Choisir une langue" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Thème</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Choisir un thème" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Clair</SelectItem>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="system">Système</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Sauvegarder</Button>
    </form>
  )
}
