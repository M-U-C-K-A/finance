"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { notificationSchema } from "@/lib/schemas"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function NotificationsForm() {
  const form = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailReports: true,
      emailAlerts: true,
      pushNotifications: false,
    },
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="emailReports"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div>
                <FormLabel>Email Reports</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Receive weekly report summaries
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailAlerts"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div>
                <FormLabel>Email Alerts</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Get important market alerts
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pushNotifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div>
                <FormLabel>Push Notifications</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Receive mobile notifications
                </p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
  )
}
