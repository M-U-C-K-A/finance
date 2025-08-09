// components/settings/userProfileForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"

export function UserProfileForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log("Profil envoyé :", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Nom complet</Label>
        <Input {...register("fullName")} placeholder="John Doe" />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" {...register("email")} placeholder="john@example.com" />
      </div>
      <div>
        <Label>Photo de profil (URL)</Label>
        <Input type="url" {...register("avatar")} placeholder="https://..." />
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea {...register("bio")} placeholder="Quelques mots sur vous..." />
      </div>
      <Button type="submit">Enregistrer</Button>
    </form>
  )
}
