"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  onClose: () => void;
}

export default function SignInModal({ onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");

  const handleEmailSignIn = async () => {
    // Exemple : signin par email magic link
    await signIn("email", { email, redirect: false, callbackUrl: "/dashboard" });
    // tu peux ici afficher un message, ou fermer la modale
    onClose();
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input input-bordered"
          />
          <Button onClick={handleEmailSignIn}>Se connecter avec Email</Button>
          <Button variant="outline" onClick={handleGoogleSignIn}>
            Se connecter avec Google
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

