'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/lib/auth-client'
import { updateUserProfile } from '@/actions/user'
import { InfoIcon, Loader2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const publicProfileSchema = z.object({
  bio: z.string()
    .min(10)
    .max(160)
    .optional(),
  interests: z.string().max(100).optional(),
  website: z.string().url('URL invalide').optional()
})

export function PublicProfileForm() {
  const { data: session } = useSession()
  const user = session?.user

  const form = useForm<z.infer<typeof publicProfileSchema>>({
    resolver: zodResolver(publicProfileSchema),
    defaultValues: {
      bio: user?.bio || '',
      interests: user?.interests?.join(', ') || '',
      website: user?.website || ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof publicProfileSchema>) {
    try {
      setIsLoading(true)
      await updateUserProfile({
        bio: values.bio,
        interests: values.interests?.split(',').map(i => i.trim()),
        website: values.website
      })
      toast.success('Profil public mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Profil public</h2>
        <Badge variant="outline" className="gap-1">
          <Zap className="h-3 w-3" />
          Beta
        </Badge>
      </div>
      
      <Alert variant="info" className="mb-4">
        <AlertTitle className='flex items-center gap-2'>
          <InfoIcon className="h-5 w-5 text-blue-500" />
          &nbsp;Information
        </AlertTitle>
        <AlertDescription>
          Cette fonctionnalité est en version beta. Votre profil public sera visible par tous les utilisateurs.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Parlez un peu de vous..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 160 caractères
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Centres d'intérêt</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Séparés par des virgules (ex: musique, sport, technologie)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site web</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </form>
      </Form>
    </div>
  )
}
