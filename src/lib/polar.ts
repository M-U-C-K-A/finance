// Polar API integration for subscriptions and credit packs using official SDK
import { Polar } from "@polar-sh/sdk";
import { SubscriptionPlan } from "@prisma/client";

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

if (!POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN environment variable is required");
}

// Initialize Polar SDK
export const polar = new Polar({
  security: {
    bearerAuth: POLAR_ACCESS_TOKEN,
  },
});

// Types from Polar SDK
export type PolarCheckoutResponse = {
  id: string;
  url: string;
  expires_at: string;
};

// Product IDs for different plans and credit packs
// TODO: Replace these placeholder IDs with actual Polar product UUIDs
// You need to create these products in your Polar dashboard first
export const POLAR_PRODUCTS = {
  // Subscription plans - Replace with actual UUIDs from Polar dashboard
  STARTER: "00000000-0000-0000-0000-000000000001", // Replace with actual Polar product UUID
  PROFESSIONAL: "00000000-0000-0000-0000-000000000002", // Replace with actual Polar product UUID
  ENTERPRISE: "00000000-0000-0000-0000-000000000003", // Replace with actual Polar product UUID
  
  // Credit packs - Replace with actual UUIDs from Polar dashboard
  CREDITS_100: "00000000-0000-0000-0000-000000000004", // Replace with actual Polar product UUID
  CREDITS_500: "00000000-0000-0000-0000-000000000005", // Replace with actual Polar product UUID
  CREDITS_2000: "00000000-0000-0000-0000-000000000006", // Replace with actual Polar product UUID
} as const;

/**
 * Create a Polar checkout session for subscription
 */
export async function createSubscriptionCheckout(
  plan: SubscriptionPlan,
  userEmail: string,
  userId: string
): Promise<PolarCheckoutResponse> {
  const productMap = {
    [SubscriptionPlan.STARTER]: POLAR_PRODUCTS.STARTER,
    [SubscriptionPlan.PROFESSIONAL]: POLAR_PRODUCTS.PROFESSIONAL,
    [SubscriptionPlan.ENTERPRISE]: POLAR_PRODUCTS.ENTERPRISE,
    [SubscriptionPlan.FREE]: null,
  };

  const productId = productMap[plan];
  if (!productId) {
    throw new Error(`No product ID found for plan: ${plan}`);
  }

  const successUrl = process.env.POLAR_SUCCESS_URL || `${process.env.BETTER_AUTH_URL}/plan/success`;

  return await createCheckout(
    productId,
    successUrl,
    userEmail,
    {
      user_id: userId,
      plan: plan,
      type: "subscription",
    }
  );
}

/**
 * Create a Polar checkout session for credit pack
 */
export async function createCreditPackCheckout(
  creditAmount: 100 | 500 | 2000,
  userEmail: string,
  userId: string
): Promise<PolarCheckoutResponse> {
  const productMap = {
    100: POLAR_PRODUCTS.CREDITS_100,
    500: POLAR_PRODUCTS.CREDITS_500,
    2000: POLAR_PRODUCTS.CREDITS_2000,
  };

  const productId = productMap[creditAmount];
  if (!productId) {
    throw new Error(`No product ID found for credit amount: ${creditAmount}`);
  }

  const successUrl = process.env.POLAR_SUCCESS_URL || `${process.env.BETTER_AUTH_URL}/plan/success`;

  return await createCheckout(
    productId,
    successUrl,
    userEmail,
    {
      user_id: userId,
      credits: creditAmount.toString(),
      type: "credit_pack",
    }
  );
}

/**
 * Generic function to create a Polar checkout session using SDK
 */
async function createCheckout(productId: string, successUrl: string, customerEmail?: string, metadata?: Record<string, string>): Promise<PolarCheckoutResponse> {
  try {
    // Validate product ID format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      throw new Error(`Invalid product ID format: ${productId}. Must be a valid UUID. Check your POLAR_PRODUCTS configuration and ensure you're using real product IDs from your Polar dashboard.`);
    }

    console.log("Creating Polar checkout with:", {
      productId,
      successUrl,
      customerEmail,
      metadata
    });

    const response = await polar.checkouts.create({
      products: [productId], // API expects array of product IDs
      successUrl,
      customerEmail,
      metadata,
    });

    return {
      id: response.id,
      url: response.url,
      expires_at: response.expiresAt,
    };
  } catch (error) {
    console.error("Polar checkout creation failed:", error);
    
    // Provide more helpful error messages
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 422) {
      throw new Error(`Polar API validation error: The product ID "${productId}" is invalid or doesn't exist. Please check your Polar dashboard and update the POLAR_PRODUCTS configuration with real product UUIDs. You can use GET /api/debug/polar-products to see available products.`);
    }
    
    throw new Error(`Failed to create Polar checkout: ${error}`);
  }
}

/**
 * Get customer information from Polar using SDK
 */
export async function getPolarCustomer(customerId: string) {
  try {
    const response = await polar.customers.get({ id: customerId });
    return response;
  } catch (error) {
    console.error("Failed to get Polar customer:", error);
    throw new Error(`Failed to get Polar customer: ${error}`);
  }
}

/**
 * Get subscription information from Polar using SDK
 */
export async function getPolarSubscription(subscriptionId: string) {
  try {
    const response = await polar.subscriptions.get({ id: subscriptionId });
    return response;
  } catch (error) {
    console.error("Failed to get Polar subscription:", error);
    throw new Error(`Failed to get Polar subscription: ${error}`);
  }
}

/**
 * Cancel a subscription in Polar using SDK
 */
export async function cancelPolarSubscription(subscriptionId: string) {
  try {
    const response = await polar.subscriptions.update({ 
      id: subscriptionId,
      subscriptionUpdate: {
        cancel: true
      }
    });
    return response;
  } catch (error) {
    console.error("Failed to cancel Polar subscription:", error);
    throw new Error(`Failed to cancel Polar subscription: ${error}`);
  }
}

/**
 * Get all products from Polar - useful for debugging and getting real product IDs
 */
export async function listPolarProducts() {
  try {
    const response = await polar.products.list({});
    return response;
  } catch (error) {
    console.error("Failed to list Polar products:", error);
    throw new Error(`Failed to list Polar products: ${error}`);
  }
}

/**
 * Validate that a product ID exists in Polar
 */
export async function validateProductId(productId: string): Promise<boolean> {
  try {
    await polar.products.get({ id: productId });
    return true;
  } catch (error) {
    console.error(`Product ID ${productId} not found in Polar:`, error);
    return false;
  }
}