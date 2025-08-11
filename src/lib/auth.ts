// lib/auth.ts
import { betterAuth } from 'better-auth';
import { resend } from './resend';
import { magicLink } from 'better-auth/plugins'; // Updated import path
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';

export const auth = betterAuth({
    database: PrismaAdapter(prisma),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
    plugins: [
        magicLink({
            async sendMagicLink(data) {
                try {
                    await resend.emails.send({
                        from: "Nouvelle connexion <onboarding@yourdomain.com>",
                        to: data.email,
                        subject: "Connexion",
                        text: `Hello, ${data.email}! Click this link to sign in: ${data.magicLink}`,
                        html: `<p>Hello, ${data.email}! <a href="${data.magicLink}">Click here to sign in</a></p>`
                    });
                } catch (error) {
                    console.error('Failed to send magic link:', error);
                    throw new Error('Failed to send magic link email');
                }
            },
        })
    ],
    // Consider adding error handling for the auth initialization
    onError: (error) => {
        console.error('Authentication error:', error);
    }
});
