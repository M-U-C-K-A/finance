import { redirect } from "next/navigation"
import { signIn, providerMap } from "@/lib/auth"
import { AuthError } from "next-auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth-helper"
import { GithubIcon } from "lucide-react"

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const user = await auth()
  if (user) {
    return redirect(props.searchParams?.callbackUrl ?? "/")
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <form
            className="space-y-4"
            action={async (formData) => {
              "use server"
              try {
                await signIn("resend", formData)
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                }
                throw error
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email" 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                required 
              />
            </div>
            <Button className="w-full" type="submit">
              Sign In with Email
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            {Object.values(providerMap).map((provider) => (
              <form
                key={provider.id}
                action={async () => {
                  "use server"
                  try {
                    await signIn(provider.id, {
                      redirectTo: props.searchParams?.callbackUrl ?? "",
                    })
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                    }
                    throw error
                  }
                }}
              >
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  type="submit"
                >
                  <GithubIcon size={20}/>
                  Sign in with {provider.name}
                </Button>
              </form>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
          <p>
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
