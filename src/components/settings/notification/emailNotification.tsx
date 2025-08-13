// components/settings/notification/emailNotification.tsx

import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function EmailNotificationsCard(/* email: string */) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Sent to email</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="product-updates">Product updates</Label>
            <p className="text-sm text-muted-foreground">
              News about new features and product improvements
            </p>
          </div>
          <Switch id="product-updates" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="security-alerts">Security alerts</Label>
            <p className="text-sm text-muted-foreground">
              Important notifications about your account security
            </p>
          </div>
          <Switch id="security-alerts" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="newsletter">Newsletter</Label>
            <p className="text-sm text-muted-foreground">
              Weekly digest with curated content
            </p>
          </div>
          <Switch id="newsletter" />
        </div>
      </CardContent>
    </Card>
  )
}
