// Configuration Better Auth avec template email stylé
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { resend } from "./resend";

// Template email stylé
function createResetPasswordEmailTemplate(url: string, userEmail: string) {
    const userFirstName = userEmail.split('@')[0]; // Récupère la partie avant @
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser votre mot de passe</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="background-color: #f6f9fc; padding: 20px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header avec gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    🔐 Finanalytics
                </h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 8px 0 0 0;">
                    Réinitialisation de mot de passe
                </p>
            </div>
            
            <!-- Contenu principal -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                        🔑
                    </div>
                </div>
                
                <h2 style="color: #2d3748; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
                    Salut ${userFirstName} !
                </h2>
                
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px; text-align: center;">
                    Quelqu'un a demandé une réinitialisation de mot de passe pour votre compte Finanalytics. 
                    Si c'était vous, cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
                </p>
                
                <!-- Bouton CTA -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${url}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              padding: 16px 32px; 
                              border-radius: 50px; 
                              font-weight: 600; 
                              font-size: 16px; 
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                              transition: transform 0.2s ease;">
                        🚀 Réinitialiser mon mot de passe
                    </a>
                </div>
                
                <!-- Lien alternatif -->
                <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #718096; font-size: 14px; margin: 0 0 10px; text-align: center;">
                        Le bouton ne fonctionne pas ? Copiez-collez ce lien dans votre navigateur :
                    </p>
                    <p style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 14px; word-break: break-all; margin: 0; text-align: center;">
                        ${url}
                    </p>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px;">
                    <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0 0 15px;">
                        <strong>🛡️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, 
                        ignorez simplement cet email. Votre mot de passe restera inchangé.
                    </p>
                    
                    <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
                        <strong>⏰ Expiration :</strong> Ce lien expirera dans 1 heure pour votre sécurité.
                    </p>
                    
                    <p style="color: #2d3748; font-size: 16px; font-weight: 500; margin: 0; text-align: center;">
                        Happy analyzing! 📊<br>
                        L'équipe Finanalytics
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2d3748; padding: 25px; text-align: center;">
                <p style="color: #a0aec0; font-size: 12px; margin: 0 0 10px;">
                    © ${new Date().getFullYear()} Finanalytics. Tous droits réservés.
                </p>
                <p style="color: #718096; font-size: 12px; margin: 0;">
                    Cet email a été envoyé automatiquement, merci de ne pas répondre.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }): Promise<void> => {
            try {
                console.log("🔄 Tentative d'envoi d'email à:", user.email);
                console.log("🔗 URL de reset:", url);
                
                const result = await resend.emails.send({
                    to: user.email,
                    subject: "🔐 Réinitialisation de votre mot de passe - Finanalytics",
                    html: createResetPasswordEmailTemplate(url, user.email),
                    from: "onboarding@finanalytics.site", // Changez quand votre domaine sera vérifié
                });
                
                console.log("✅ Email envoyé avec succès:", result);
                
                if (result.error) {
                    console.error("❌ Erreur Resend:", result.error);
                    throw new Error(`Erreur d'envoi d'email: ${result.error}`);
                }
            } catch (error) {
                console.error("❌ Erreur lors de l'envoi de l'email:", error);
                throw error;
            }
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
