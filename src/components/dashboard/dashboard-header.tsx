// components/dashboard/dashboard-header.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.image ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.email}`}
            alt="Avatar utilisateur"
          />
          <AvatarFallback>
            {user.email?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {user.name ?? 'Utilisateur'}!</h1>
          <p className="text-muted-foreground">Voici un aperçu de votre activité HedgeFound</p>
        </div>
      </div>
      <Button variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Paramètres
      </Button>
    </div>
  );
}
