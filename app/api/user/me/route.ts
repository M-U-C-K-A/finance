// API pour récupérer les informations de l'utilisateur actuel
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    });

  } catch (error) {
    console.error("User API error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}