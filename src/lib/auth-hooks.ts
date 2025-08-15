// Auth hooks for handling user lifecycle events
import { prisma } from "./prisma";

/**
 * Creates a credits entry for a new user
 */
export async function createCreditsForNewUser(userId: string) {
  try {
    await prisma.credits.create({
      data: {
        userId,
        balance: 0, // New users start with 0 credits
        monthlyCredits: 0, // Will be set when they subscribe
      }
    });
    console.log(`✅ Credits entry created for user: ${userId}`);
  } catch (error) {
    // Ignore if already exists (race condition)
    if (error.code !== 'P2002') {
      console.error(`Error creating credits for user ${userId}:`, error);
    }
  }
}

/**
 * Handles new user registration
 */
export async function handleNewUserRegistration(userId: string, email: string, name: string) {
  try {
    // Create credits entry for new user
    await createCreditsForNewUser(userId);
    
    console.log(`🎉 New user registered: ${email} (${userId})`);
  } catch (error) {
    console.error(`Error handling new user registration for ${email}:`, error);
  }
}