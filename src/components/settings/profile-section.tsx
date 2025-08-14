"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Upload, User, Mail, Calendar, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUserProfile } from "@/actions/user";
import { toast } from "sonner";

interface ProfileSectionProps {
  user: any;
  isOAuthUser: boolean;
  oauthProvider: string | null;
}

export function ProfileSection({ user, isOAuthUser, oauthProvider }: ProfileSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      if (!isOAuthUser) {
        form.append("email", formData.email);
      }

      await updateUserProfile(form);
      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isOAuthUser) {
      toast.error("Modification d'avatar non disponible pour les comptes OAuth");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("avatar", file);

      await updateUserProfile(form);
      toast.success("Photo de profil mise à jour");
      // Rafraîchir la page pour voir la nouvelle image
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du téléchargement");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Gérez vos informations de profil et préférences d'affichage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Indicateur du type de compte */}
          <div className="flex items-center gap-4">
            <Badge variant={isOAuthUser ? "default" : "secondary"}>
              {isOAuthUser ? `Connecté via ${oauthProvider}` : "Compte local"}
            </Badge>
            {user.role === "ADMIN" && (
              <Badge variant="destructive">
                <Shield className="h-3 w-3 mr-1" />
                Administrateur
              </Badge>
            )}
          </div>

          {/* Photo de profil */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <Label htmlFor="avatar-upload" className="text-sm font-medium">
                  Photo de profil
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isOAuthUser 
                    ? "Gérée par votre fournisseur OAuth" 
                    : "JPG, PNG, max 2MB"
                  }
                </p>
              </div>
              {!isOAuthUser && (
                <div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom d'affichage</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  disabled={isLoading || isOAuthUser}
                />
                {isOAuthUser && (
                  <p className="text-sm text-muted-foreground">
                    Email géré par votre fournisseur OAuth
                  </p>
                )}
              </div>
            </div>

            {isOAuthUser && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre compte est géré par <strong>{oauthProvider}</strong>. 
                  Certaines modifications doivent être effectuées directement 
                  sur votre compte {oauthProvider}.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Date de création</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long", 
                year: "numeric"
              })}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Dernière modification</dt>
              <dd>{new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Email vérifié</dt>
              <dd>
                <Badge variant={user.emailVerified ? "default" : "destructive"}>
                  {user.emailVerified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">ID utilisateur</dt>
              <dd className="font-mono text-xs">{user.id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}