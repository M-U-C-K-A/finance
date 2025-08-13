// components/settings/notification/pushNotification.tsx

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PushNotificationsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Delivered to your devices</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="direct-messages">Direct messages</Label>
            <p className="text-sm text-muted-foreground">
              When someone sends you a private message
            </p>
          </div>
          <Switch id="direct-messages" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="mentions">Mentions</Label>
            <p className="text-sm text-muted-foreground">
              When someone mentions you
            </p>
          </div>
          <Switch id="mentions" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="reminders">Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Scheduled notifications for important events
            </p>
          </div>
          <Switch id="reminders" />
        </div>
      </CardContent>
    </Card>
  )
}
