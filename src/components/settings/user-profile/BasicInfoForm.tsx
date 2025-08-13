'use client'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/lib/auth-client'
import { updateUserProfile } from '@/actions/user'
import { Loader2, MailWarning, CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

const basicInfoSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  avatarFile: z.instanceof(File).optional()
})

export function BasicInfoForm() {
  const { data: session } = useSession()
  const user = session?.user
  const account = session?.account // Accès au compte via better-auth
  const isOAuthUser = account?.provider !== 'credentials'
  const isEmailVerified = user?.emailVerified

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: user?.name || '',
      email: isOAuthUser ? undefined : user?.email || '',
    }
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(user?.image || null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('avatarFile', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof basicInfoSchema>) {
    try {
      setIsLoading(true)
      
      const formData = new FormData()
      formData.append('name', values.name)
      if (values.email) formData.append('email', values.email)
      if (values.avatarFile) formData.append('avatar', values.avatarFile)

      await updateUserProfile(formData)
      toast.success('Profil mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Informations de base</h2>
        
        {/* Bloc 1: Avatar Upload */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Photo de profil</h3>
          <div className="flex items-start gap-4">
            <div 
              className="relative cursor-pointer"
              onClick={handleImageClick}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={previewImage || undefined} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <Upload className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleImageClick}
              >
                Changer la photo
              </Button>
              <p className="text-xs text-muted-foreground">
                Formats supportés: JPG, PNG. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Bloc 2: Nom */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Identité</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bloc 3: Email (conditionnel) */}
        {!isOAuthUser && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Email</h3>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Votre email" 
                        {...field} 
                      />
                    </FormControl>
                    {isEmailVerified ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Vérifié
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Non vérifié
                      </Badge>
                    )}
                  </div>
                  <FormMessage />
                  {!isEmailVerified && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Un email de vérification vous a été envoyé
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Bloc 4: Message pour OAuth */}
        {isOAuthUser && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Compte connecté</h3>
            <Alert className="bg-muted">
              <MailWarning className="h-4 w-4" />
              <AlertTitle>Compte {account?.provider}</AlertTitle>
              <AlertDescription>
                Votre email est géré par {account?.provider}. Vous ne pouvez pas le modifier ici.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Bloc 5: Bouton de soumission */}
        <div className="pt-4">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </Form>
  )
}
