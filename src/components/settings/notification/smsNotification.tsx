// src/components/settings/notification/smsNotification.tsx

import { Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
export function SmsNotificationsCard() {
	return (
		<Card>
			<Alert variant="info" className="mx-8 w-auto">
					<AlertTitle>This section is not currently supported</AlertTitle>
					<AlertDescription>
						We are currently working on adding SMS notifications to our
						platform, but it is not yet available. We will notify you when
						it is ready.
					</AlertDescription>
				</Alert>
			<CardHeader className="flex flex-row items-center space-x-4 space-y-0">
				<Smartphone className="h-5 w-5 text-muted-foreground" />
				<div>
					<CardTitle>SMS Notifications</CardTitle>
					<CardDescription>Text messages to your phone</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label htmlFor="sms-2fa">Two-factor authentication</Label>
						<p className="text-sm text-muted-foreground">
							Security codes for account verification
						</p>
					</div>
					<Switch id="sms-2fa" defaultChecked />
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label htmlFor="sms-promo">Promotional offers</Label>
						<p className="text-sm text-muted-foreground">
							Special deals and discounts
						</p>
					</div>
					<Switch id="sms-promo" />
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<Label htmlFor="sms-urgent">Urgent alerts</Label>
						<p className="text-sm text-muted-foreground">
							Critical account notifications
						</p>
					</div>
					<Switch id="sms-urgent" defaultChecked />
				</div>
			</CardContent>
		</Card>
	)
}
