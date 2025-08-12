import { ThemeToggle } from "@/components/theme/theme-mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AuthPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-accent/30 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          FinAnalytics
        </h1>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-accent/20">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Verify your email {email ? `(${email})` : ""}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We've sent a verification link to your email address.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center text-sm">
              <p>Please check your inbox and click the verification link.</p>
              <p className="mt-2">
                This helps us ensure the security of your account.
              </p>
            </div>

            {email && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                <p className="font-medium">Email sent to:</p>
                <p className="text-primary mt-1 truncate">{email}</p>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-6">
              <Button asChild variant="outline">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="link" size="sm" className="text-muted-foreground">
                Didn't receive an email? <span className="text-primary ml-1">Resend</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground max-w-md">
          <p>Having trouble? Check your spam folder or contact our support team.</p>
        </div>
      </div>
    </main>
  );
}
