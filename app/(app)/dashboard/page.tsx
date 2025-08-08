import { requiredAuth } from "@/lib/auth-helper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, Settings } from "lucide-react";

export default async function Dashboard() {
  const user = await requiredAuth();
  
  return (
	<>
	<h1>PUTA</h1>
	</>
  )
  }
