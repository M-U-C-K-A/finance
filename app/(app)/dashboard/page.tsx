import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, Settings } from "lucide-react";
import Unauthorized from "./unauthorized";
import { getUser } from "@/lib/auth-server";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <div className="mx-auto max-w-3xl w-full flex items-center justify-center h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center gap-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={user?.image ?? "/default-avatar.png"} alt={"avatar de l'utilisateur"} />
                <AvatarFallback>
                  {user?.email
                    ? user.email
                        .split("@")[0]
                        .slice(0, 2)
                        .toUpperCase()
                    : "  "}
                </AvatarFallback>
              </Avatar>
              <div>
                {user ? (
                  <>
                    <CardTitle className="text-2xl">
                      Bienvenue, {user.name ?? user.email}!
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Vous êtes connecté avec {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-2xl">
                      Bienvenue invité 👋
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Connectez-vous pour accéder à toutes les fonctionnalités.
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6">
            {user ? (
              <>
                <div className="rounded-lg border p-4">
                  <h2 className="text-xl font-semibold mb-2">Accès sécurisé</h2>
                  <p className="text-muted-foreground">
                    Cette page est réservée aux utilisateurs authentifiés.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Paramètres du compte
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Centre d&apos;aide
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-muted-foreground">
                  Veuillez vous connecter pour voir le contenu.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
