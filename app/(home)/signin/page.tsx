"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-mode-toggle";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("email", { email, redirect: false, callbackUrl: "/dashboard" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="fixed top-5 left-5">
        <ThemeToggle />
      </div>
      {/* Partie gauche - Formulaire */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Connectez-vous</h1>
            <p className="text-muted-foreground">
              Utilisez votre email pour continuer
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Continuer"}
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Continuer avec Google 
            </Button>
          </div>
        </div>

        <footer className="text-sm text-muted-foreground mt-8 text-center">
          En continuant, vous acceptez nos conditions d'utilisation
        </footer>
      </div>

      {/* Partie droite - Image */}
      <div className="w-full md:block md:w-1/2 p-8">
        <div className="relative h-full w-full rounded-xl overflow-hidden">
          <Image
            src={theme === "dark" ? "/dark-login.jpeg" : "/light-login.jpeg"}
            alt="Illustration de connexion"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
