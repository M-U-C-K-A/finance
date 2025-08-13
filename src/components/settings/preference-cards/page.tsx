'use client'

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  Monitor, 
  Sun, 
  Moon, 
  Languages, 
  Accessibility,
  LayoutDashboard,
  Sidebar,
  Database,
  Gauge,
  Paintbrush,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AppearanceCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Paintbrush className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize look and feel</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-2 h-6 w-6" />
                Light
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-2 h-6 w-6" />
                Dark
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-2 h-6 w-6" />
                System
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <Input type="color" name="color" id="" />
        </div>

        <div className="space-y-2">
          <Label>UI Density</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Compact</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <span className="text-sm text-muted-foreground">Spacious</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LanguageCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Languages className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>Localization settings</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select>
              <SelectTrigger id="language">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="UTC+00:00" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC+00:00</SelectItem>
                <SelectItem value="est">EST (UTC-05:00)</SelectItem>
                <SelectItem value="cst">CST (UTC-06:00)</SelectItem>
                <SelectItem value="pst">PST (UTC-08:00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-format">Date Format</Label>
          <Select>
            <SelectTrigger id="date-format">
              <SelectValue placeholder="MM/DD/YYYY" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
              <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

export function AccessibilityCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Accessibility className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>Adapt the interface to your needs</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="high-contrast">High contrast mode</Label>
            <p className="text-sm text-muted-foreground">
              Increases color contrast for better visibility
            </p>
          </div>
          <Switch id="high-contrast" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="reduce-motion">Reduce motion</Label>
            <p className="text-sm text-muted-foreground">
              Disables animations and transitions
            </p>
          </div>
          <Switch id="reduce-motion" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="dyslexic-font">Dyslexic-friendly font</Label>
            <p className="text-sm text-muted-foreground">
              Uses OpenDyslexic font family
            </p>
          </div>
          <Switch id="dyslexic-font" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="text-sm">
          Configure keyboard shortcuts
        </Button>
      </CardFooter>
    </Card>
  )
}

export function DashboardCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Dashboard Layout</CardTitle>
          <CardDescription>Customize your dashboard view</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Default View</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Overview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Card Density</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Minimal</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <span className="text-sm text-muted-foreground">Detailed</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="live-data">Live Data Updates</Label>
            <p className="text-sm text-muted-foreground">
              Enable real-time data streaming
            </p>
          </div>
          <Switch id="live-data" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DataPreferencesCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Database className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Data Preferences</CardTitle>
          <CardDescription>Configure how data is displayed</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Number Formatting</Label>
          <div className="grid grid-cols-3 gap-4">
			<RadioGroup defaultValue="1,000.00">
            <div>
              <RadioGroupItem value="1,000.00" id="format1" className="peer sr-only" />
              <Label
                htmlFor="format1"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                1,000.00
              </Label>
            </div>
            <div>
              <RadioGroupItem value="1 000,00" id="format2" className="peer sr-only" />
              <Label
                htmlFor="format2"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                1 000,00
              </Label>
            </div>
            <div>
              <RadioGroupItem value="1000.00" id="format3" className="peer sr-only" />
              <Label
                htmlFor="format3"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                1000.00
              </Label>
            </div>
		  </RadioGroup>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="data-sampling">Smart Data Sampling</Label>
            <p className="text-sm text-muted-foreground">
              Optimize large datasets for better performance
            </p>
          </div>
          <Switch id="data-sampling" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="anonymize">Anonymize Data</Label>
            <p className="text-sm text-muted-foreground">
              Hide sensitive information in shared views
            </p>
          </div>
          <Switch id="anonymize" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SidebarCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Sidebar className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>Customize your sidebar and menus</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sidebar-collapse">Collapsible Sidebar</Label>
            <p className="text-sm text-muted-foreground">
              Allow sidebar to be minimized
            </p>
          </div>
          <Switch id="sidebar-collapse" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sidebar-position">Right Sidebar</Label>
            <p className="text-sm text-muted-foreground">
              Move sidebar to the right side of screen
            </p>
          </div>
          <Switch id="sidebar-position" />
        </div>

        <div className="space-y-2">
          <Label>Sidebar Width</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Compact</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <span className="text-sm text-muted-foreground">Wide</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="recent-items">Show Recent Items</Label>
            <p className="text-sm text-muted-foreground">
              Display recently accessed items in sidebar
            </p>
          </div>
          <Switch id="recent-items" defaultChecked />
        </div>
      </CardContent>
    </Card>
  )
}
