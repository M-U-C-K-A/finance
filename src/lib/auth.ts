// src/lib/auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

// Configuration de NextAuth v5
export const {
  auth,       // Middleware / vérification côté serveur
  handlers,   // API route handlers GET/POST
  signIn,     // Fonction pour déclencher login
  signOut,    // Fonction pour logout
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,      // Doit correspondre à ta .env.local
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Tu peux ajouter d'autres providers ici si besoin
  ],
  pages: {
    signIn: "/signin", // Page de connexion personnalisée
  },
  session: {
    strategy: "database", // Sessions stockées en base avec Prisma
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id  // Ajoute l'id Prisma à la session
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET, // Nécessaire pour sécuriser les tokens
})

// Map des providers utilisés côté UI
export const providerMap = {
  github: { id: "github", name: "GitHub" },
  google: { id: "google", name: "Google" },
  resend: { id: "resend", name: "Email" },  // Email via Resend par exemple
}
