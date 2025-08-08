import { requiredAuth } from "@/lib/auth-helper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, Settings } from "lucide-react";

export default async function Private() {
  const user = await requiredAuth();
  
  return (
    <div className="mx-auto max-w-3xl w-full flex items-center justify-center h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Bienvenue, {user.name ?? user.email}!</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Vous êtes connecté avec {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-6">
            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold mb-2">Accès sécurisé</h2>
              <p className="text-muted-foreground">
                Cette page est réservée aux utilisateurs authentifiés. Vous avez accès à du contenu exclusif.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Paramètres du compte
              </Button>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Centre d'aide
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Session active - Dernière connexion: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
