// src/components/settings/security/twoFactorForm.tsx

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function TwoFactorAuthCard() {
	const has2FA = false
	const isProviderUser = false
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">2FA Status</p>
            <p className="text-sm text-muted-foreground">
              {isProviderUser 
                ? "Managed by your authentication provider" 
                : has2FA 
                  ? "Currently enabled" 
                  : "Currently disabled"}
            </p>
          </div>
          <Switch 
            checked={has2FA} 
            disabled={isProviderUser}
            aria-label="Toggle 2FA"
          />
        </div>

        {isProviderUser && (
          <p className="mt-4 text-sm text-muted-foreground">
            You're using {user.authProvider} for authentication. Two-factor settings are managed by your provider.
          </p>
        )}

        {!isProviderUser && !has2FA && (
          <Button variant="outline" className="mt-4">
            Set up two-factor authentication
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
