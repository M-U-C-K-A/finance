// Layout pour toutes les pages admin avec vérification d'accès
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification admin avec ID spécifique depuis .env
  const adminAccess = await isAdmin();
  
  if (!adminAccess) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      {/* Header Admin */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <span className="font-semibold text-destructive">Administration</span>
            <span className="text-sm text-muted-foreground">
              Accès restreint • Environnement sécurisé
            </span>
          </div>
        </div>
      </div>

      {/* Contenu admin */}
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}