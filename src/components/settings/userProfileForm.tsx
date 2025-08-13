'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BasicInfoForm, PasswordForm, PublicProfileForm } from './user-profile'

export function UserProfileForm() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil Utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <BasicInfoForm />
          <PasswordForm />
          <PublicProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
