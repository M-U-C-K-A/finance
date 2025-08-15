import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your subscription or credits have been activated 
            and you should see them reflected in your account shortly.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>What happens next?</strong><br />
              • Your credits/subscription will be processed within a few minutes<br />
              • You&apos;ll receive a confirmation email<br />
              • Start generating reports immediately
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reports/generate">
                Generate Report
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button variant="ghost" asChild>
              <Link href="/plan" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Plans
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card className="text-center">
          <CardContent className="py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}