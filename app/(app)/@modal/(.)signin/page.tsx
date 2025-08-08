import { redirect } from "next/navigation"
import { signIn, providerMap } from "@/lib/auth"
import { AuthError } from "next-auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth-helper"
import { Github, Mail } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const user = await auth()
  if (user) {
    return redirect(props.searchParams?.callbackUrl ?? "/")
  }

  return (
      <Card className="w-full max-w-md border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connectez-vous</CardTitle>
          <CardDescription>
            Accédez à votre compte en utilisant votre email ou un provider
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form
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
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email" 
                id="email" 
                type="email" 
                placeholder="votre@email.com" 
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Se connecter avec Email
            </Button>
          </form>

          {Object.values(providerMap).length > 0 && (
            <>
              <div className="flex items-center my-4">
                <Separator className="flex-1" />
                <span className="px-3 text-sm text-muted-foreground">OU</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3">
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
                    <Button variant="outline" type="submit" className="w-full">
                      <Github className="w-4 h-4 mr-2" />Se connecter avec {provider.name}
                    </Button>
                  </form>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
  )
}
