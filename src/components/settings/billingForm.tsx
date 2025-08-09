// components/settings/billingForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"

export function BillingForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    console.log("Facturation :", data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Nom sur la carte</Label>
        <Input {...register("cardName")} />
      </div>
      <div>
        <Label>Numéro de carte</Label>
        <Input type="text" {...register("cardNumber")} />
      </div>
      <div className="flex gap-4">
        <div>
          <Label>Expiration</Label>
          <Input {...register("expiry")} placeholder="MM/AA" />
        </div>
        <div>
          <Label>CVC</Label>
          <Input {...register("cvc")} />
        </div>
      </div>
      <Button type="submit">Mettre à jour</Button>
    </form>
  )
}
