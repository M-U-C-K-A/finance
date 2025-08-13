'use client'

import { 
  AppearanceCard, 
  LanguageCard, 
  AccessibilityCard,
  DashboardCard,
  DataPreferencesCard,
  SidebarCard
} from './preference-cards/page'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PreferencesForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Preferences</h2>
        <p className="text-muted-foreground">
          Tailor your experience to match your workflow
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="interface" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="interface" className="space-y-4">
          <AppearanceCard />
          <LanguageCard />
          <AccessibilityCard />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataPreferencesCard />
          <DashboardCard />
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <SidebarCard />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline">Reset Defaults</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
