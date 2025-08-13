import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url}) => {
            await resend.emails.send({
                to: user.email,
                subject: "Reset your Password",
                html: `Click the link to reset your password: <a href="${url}">${url}</a>`,
                from: "noreply@resend.finanalytics.com",
            })
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    session: {
      modelName: "Session",
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      }
    },
});
