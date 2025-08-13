// app/settings/page.tsx
"use server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileForm } from "@/components/settings/userProfileForm"
import { NotificationsForm } from "@/components/settings/notificationsForm"
import { SecurityForm } from "@/components/settings/securityForm"
import { BillingForm } from "@/components/settings/billingForm"
import { PreferencesForm } from "@/components/settings/preferencesForm"

export default async function SettingsPage() {
  
  return (

    <div className="mx-auto max-w-3xl w-full flex h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-12">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile"><UserProfileForm /></TabsContent>
        <TabsContent value="security"><SecurityForm /></TabsContent>
        <TabsContent value="notifications"><NotificationsForm /></TabsContent>
        <TabsContent value="billing"><BillingForm /></TabsContent>
        <TabsContent value="preferences"><PreferencesForm /></TabsContent>
      </Tabs>
    </div>
  )
}
