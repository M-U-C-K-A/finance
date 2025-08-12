// app/auth/reset-password/page.tsx
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
import { ThemeToggle } from "@/components/theme/theme-mode-toggle"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { KeyRound, Lock } from "lucide-react"
import { RequiredIndicator } from "@/components/ui/required-indicator"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  async function onSubmit(formData: FormData) {
    const password = formData.get("password") as string
    const passwordConfirm = formData.get("passwordConfirm") as string

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match")
      return
    }

	if (!token) {
		toast.error("Invalid token")
		return
	}

    try {
      await authClient.resetPassword({
        newPassword: password,
		token: token,
      }, {
        onSuccess: () => {
			router.push("/auth")
          toast.success("Password updated successfullym you can now sign in")
        },
        onError: (error) => {
          toast.error(error.error?.message || "Failed to reset password")
        },
      })
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
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
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              {token ? "Enter your new password" : "Invalid or missing reset token"}
            </CardDescription>
          </CardHeader>

          {token ? (
            <CardContent className="space-y-4">
              <form action={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    New Password <RequiredIndicator />
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="flex items-center gap-1">
                    Confirm Password <RequiredIndicator />
                  </Label>
                  <Input
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Password must be at least 8 characters long</p>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Update Password
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent className="text-center">
              <p className="text-destructive mb-4">Invalid reset link</p>
              <Button variant="outline" onClick={() => router.push("/auth/forgot-password")}>
                Request new reset link
              </Button>
            </CardContent>
          )}
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
          <p>
            Remember your password?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
