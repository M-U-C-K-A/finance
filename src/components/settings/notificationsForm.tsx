'use client'

import { EmailNotificationsCard, PushNotificationsCard, SmsNotificationsCard } from './notification'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function NotificationsForm(/* user: { email: string } */) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Configure how you receive notifications and alerts
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <EmailNotificationsCard /*{ email={user.email} }*/ />
        <PushNotificationsCard />
        <SmsNotificationsCard />
      </div>

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  )
}

