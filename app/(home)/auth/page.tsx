"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./signin-form";
import { SignUpForm } from "./signup-form";
import { ThemeToggle } from "@/components/theme/theme-mode-toggle";
import { CardHeader, CardFooter, CardContent, CardTitle, CardDescription } from "@/components/ui/card";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen grid grid-cols-1">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      {/* Left side - Auth forms */}
      <div className="flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-8">

          <div className="w-full max-w-md space-y-8 mb-4">
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-md font-medium ${isLogin
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-md font-medium ${!isLogin
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
                  }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <Card>
            {isLogin ? (
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-sm md:text-md">Sign in to your account</CardDescription>
              </CardHeader>
            ) : (
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                <CardDescription className="text-sm md:text-md">Create an account</CardDescription>
              </CardHeader>
            )}
            <CardContent className="min-h-[350px] max-h-[350px]">

              {isLogin ? <SignInForm /> : <SignUpForm />}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
