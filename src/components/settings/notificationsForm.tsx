// components/settings/notificationsForm.tsx
"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

export function NotificationsForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log("Notifications :", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Emails marketing</Label>
        <Switch {...register("marketingEmails")} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Alertes importantes</Label>
        <Switch {...register("importantAlerts")} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Notifications push</Label>
        <Switch {...register("pushNotifications")} />
      </div>
      <Button type="submit">Sauvegarder</Button>
    </form>
  )
}
