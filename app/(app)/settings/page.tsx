// Page settings professionnelle
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/settings/profile-section";
import { SecuritySection } from "@/components/settings/security-section";
import { BillingSection } from "@/components/settings/billing-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/auth");
  }

  // Récupérer les informations complètes de l'utilisateur
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      accounts: {
        select: {
          providerId: true,
        }
      },
      subscription: true,
      credits: true,
    }
  });

  if (!fullUser) {
    redirect("/auth");
  }

  // Déterminer si l'utilisateur utilise un provider OAuth
  const isOAuthUser = fullUser.accounts.length > 0;
  const oauthProvider = isOAuthUser ? fullUser.accounts[0]?.providerId : null;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection 
              user={fullUser} 
              isOAuthUser={isOAuthUser} 
              oauthProvider={oauthProvider} 
            />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySection 
              user={fullUser} 
              isOAuthUser={isOAuthUser} 
              oauthProvider={oauthProvider} 
            />
          </TabsContent>

          <TabsContent value="billing">
            <BillingSection user={fullUser} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsSection user={fullUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}