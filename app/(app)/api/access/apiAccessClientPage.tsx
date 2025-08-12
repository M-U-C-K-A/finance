"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Key } from "lucide-react"

export default function ApiAccessClientPage() {

  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [apiKey, setApiKey] = useState<string | null>(null)

  const handleRequestKey = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler génération d'une clé
    setApiKey("sk_live_" + Math.random().toString(36).substring(2, 15))
  }

  return (
    <main className="h-full p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Access</h1>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Beta API</AlertTitle>
        <AlertDescription>
          Our API is currently in <strong>beta</strong>. Expect possible changes and service interruptions. 
          Use in production at your own risk.
        </AlertDescription>
      </Alert>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Request API Key</CardTitle>
          <CardDescription>
            Fill out the form to request your API credentials. You will receive an email once approved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestKey} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company / Project name</Label>
              <Input 
                id="company"
                placeholder="My App Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Request API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      {apiKey && (
        <Card>
          <CardHeader>
            <CardTitle>Your API Key</CardTitle>
            <CardDescription>Keep this key secret. It grants full access to your account.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <code className="bg-muted px-3 py-1 rounded text-sm">{apiKey}</code>
            <Key className="text-primary" />
          </CardContent>
        </Card>
      )}
    </main>
  )
}
