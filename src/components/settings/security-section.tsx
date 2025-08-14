"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Smartphone, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Lock
} from "lucide-react";
import { updateUserPassword } from "@/actions/user";
import { toast } from "sonner";

interface SecuritySectionProps {
  user: any;
  isOAuthUser: boolean;
  oauthProvider: string | null;
}

export function SecuritySection({ user, isOAuthUser, oauthProvider }: SecuritySectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("currentPassword", passwordForm.currentPassword);
      form.append("newPassword", passwordForm.newPassword);
      form.append("confirmPassword", passwordForm.confirmPassword);

      await updateUserPassword(form);
      toast.success("Mot de passe mis à jour avec succès");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statut de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Statut de sécurité
          </CardTitle>
          <CardDescription>
            Aperçu de la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Authentification</p>
                  <p className="text-sm text-muted-foreground">
                    {isOAuthUser ? `Connecté via ${oauthProvider}` : "Authentification locale"}
                  </p>
                </div>
              </div>
              <Badge variant="default">Actif</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {user.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="font-medium">Email vérifié</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <Badge variant={user.emailVerified ? "default" : "destructive"}>
                {user.emailVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">
                    Sécurité supplémentaire recommandée
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                {isOAuthUser ? "Géré par OAuth" : "Désactivé"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changement de mot de passe */}
      {!isOAuthUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Assurez-vous que votre compte utilise un mot de passe fort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ 
                    ...passwordForm, 
                    currentPassword: e.target.value 
                  })}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ 
                      ...passwordForm, 
                      newPassword: e.target.value 
                    })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ 
                      ...passwordForm, 
                      confirmPassword: e.target.value 
                    })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* OAuth Info */}
      {isOAuthUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sécurité OAuth
            </CardTitle>
            <CardDescription>
              Votre compte est sécurisé par {oauthProvider}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Votre mot de passe et votre authentification à deux facteurs sont gérés 
                directement par <strong>{oauthProvider}</strong>. Pour modifier ces paramètres, 
                rendez-vous sur votre compte {oauthProvider}.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <Button variant="outline" asChild>
                <a 
                  href={oauthProvider === "google" 
                    ? "https://myaccount.google.com/security" 
                    : "https://github.com/settings/security"
                  }
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Gérer sur {oauthProvider}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions actives - pour plus tard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Sessions actives
          </CardTitle>
          <CardDescription>
            Gérez vos connexions actives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Session actuelle</p>
                <p className="text-sm text-muted-foreground">
                  Navigateur web • Maintenant
                </p>
              </div>
              <Badge variant="default">Actuel</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}