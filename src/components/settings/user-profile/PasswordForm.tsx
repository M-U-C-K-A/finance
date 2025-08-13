'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSession } from '@/lib/auth-client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Minimum 8 caractères'),
  newPassword: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string().min(8, 'Minimum 8 caractères')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export function PasswordForm() {
  const { data: session } = useSession()
  const user = session?.user
  const isOAuthUser = user?.provider !== 'credentials'

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    try {
      setIsLoading(true)
      // await changePassword(values.currentPassword, values.newPassword)
      toast.success('Mot de passe mis à jour')
      form.reset()
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  if (isOAuthUser) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Compte connecté</AlertTitle>
        <AlertDescription>
          Votre mot de passe est géré par {user?.provider}. Vous ne pouvez pas le modifier ici.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mot de passe</h2>
      
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Sécurité importante</AlertTitle>
        <AlertDescription>
          Changer votre mot de passe déconnectera toutes vos autres sessions.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe actuel</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Votre mot de passe actuel" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Votre nouveau mot de passe" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Confirmez le mot de passe" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading} variant="destructive">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Changer le mot de passe
          </Button>
        </form>
      </Form>
    </div>
  )
}
