// User utility functions for handling user creation and setup
import { prisma } from "./prisma";

/**
 * Ensures a user has a credits entry in the database
 * Called when a user first accesses credit-related features
 */
export async function ensureUserHasCredits(userId: string) {
  try {
    const existingCredits = await prisma.credits.findUnique({
      where: { userId }
    });

    if (!existingCredits) {
      await prisma.credits.create({
        data: {
          userId,
          balance: 0, // New users start with 0 credits
          monthlyCredits: 0, // Will be set when they subscribe
        }
      });
      console.log(`✅ Credits entry created for user: ${userId}`);
    }

    return existingCredits || { userId, balance: 0, monthlyCredits: 0 };
  } catch (error) {
    console.error(`Error ensuring credits for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get user credits, creating the entry if it doesn't exist
 */
export async function getUserCreditsWithFallback(userId: string) {
  let credits = await prisma.credits.findUnique({
    where: { userId }
  });

  if (!credits) {
    await ensureUserHasCredits(userId);
    credits = await prisma.credits.findUnique({
      where: { userId }
    });
  }

  return credits;
}