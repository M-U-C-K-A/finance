"use client";

import { useState } from "react";
import Image from "next/image";
import { SignInForm } from "@/components/auth/signin-form";
import { SignUpForm } from "@/components/auth/signup-form";
import { ThemeToggle } from "@/components/theme/theme-mode-toggle";
import { GalleryVerticalEnd } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="grid min-h-svh xl:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>{isLogin ? "Sign in" : "Sign up"}</CardTitle>
                <CardDescription>
                  {isLogin ? "Log in to your account" : "Create an account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLogin ? <SignInForm /> : <SignUpForm />}
              </CardContent>
              <CardFooter className="flex justify-center">
                {isLogin ? "Don't have an account? " : "Already have an account? " }
                <Button 
                  variant="ghost" 
                  onClick={toggleAuthMode}
                  className="text-muted-foreground p-2 hover:underline ml-1"
                >
                  {isLogin 
                    ? "Sign up" 
                    : "Sign in"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden xl:block">
        <Image
          fill
          priority
          src="/dark-login.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.30] dark:grayscale"
        />
      </div>
    </div>
  );
}
