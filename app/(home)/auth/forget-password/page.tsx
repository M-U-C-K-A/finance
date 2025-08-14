// app/auth/forgot-password/page.tsx
"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme/theme-mode-toggle"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { RequiredIndicator } from "@/components/ui/required-indicator"

export default function ForgotPasswordPage() {
  const router = useRouter()

  async function onSubmit(formData: FormData) {
    const email = formData.get("email")
    await authClient.forgetPassword({
      email: String(email),
      redirectTo: "/auth/reset-password",
    },
    {
      onSuccess: () => {
        router.push(`/auth/verify?email=${email}`)
        router.refresh()
        toast.info("Check your email to reset your password")
      },
      onError: (error) => {
        toast.error(error.error.message)
      },
    })
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-accent/30 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          FinAnalytics
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-accent/20">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form action={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center gap-1">Email address<RequiredIndicator /></Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-4 h-4 text-muted-foreground hover:bg-transparent">
                        <span className="text-xs">?</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto p-2 text-xs max-w-[200px]">
                      We'll send a reset link to this email
                      <Link
                        href="/help"
                        className="block underline text-primary mt-1"
                      >
                        Need help?
                      </Link>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="your@email.com" 
                  required
                  className="focus-visible:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
          <p>If you don't see the email, check your spam folder or contact support.</p>
        </div>
      </div>
    </main>
  )
}
