'use client'

import { ActiveSessionsCard, LoginHistoryCard, TwoFactorAuthCard } from './security'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ShieldCheck } from 'lucide-react'

export function SecurityForm() {
  return (
    <div className="space-y-6">
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Security is our top priority</AlertTitle>
        <AlertDescription>
          We use industry-standard encryption and security practices to protect your account.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <TwoFactorAuthCard 
          //has2FA={user.has2FA} 
          //isProviderUser={!!user.authProvider} 
        />
        <ActiveSessionsCard />
        <LoginHistoryCard />
      </div>
    </div>
  )
}

