// Polar API integration for subscriptions and credit packs
import { SubscriptionPlan } from "@prisma/client";

const POLAR_BASE_URL = "https://api.polar.sh";
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;

if (!POLAR_ACCESS_TOKEN) {
  throw new Error("POLAR_ACCESS_TOKEN environment variable is required");
}

interface PolarCheckoutRequest {
  product_id: string;
  success_url: string;
  customer_email?: string;
  metadata?: Record<string, string>;
}

interface PolarCheckoutResponse {
  id: string;
  url: string;
  expires_at: string;
}

// Product IDs for different plans and credit packs
export const POLAR_PRODUCTS = {
  // Subscription plans
  STARTER: "starter-plan-id", // Replace with actual Polar product ID
  PROFESSIONAL: "professional-plan-id", // Replace with actual Polar product ID
  ENTERPRISE: "enterprise-plan-id", // Replace with actual Polar product ID
  
  // Credit packs
  CREDITS_100: "100-credits-id", // Replace with actual Polar product ID
  CREDITS_500: "500-credits-id", // Replace with actual Polar product ID
  CREDITS_2000: "2000-credits-id", // Replace with actual Polar product ID
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

  const checkoutData: PolarCheckoutRequest = {
    product_id: productId,
    success_url: successUrl,
    customer_email: userEmail,
    metadata: {
      user_id: userId,
      plan: plan,
      type: "subscription",
    },
  };

  return await createCheckout(checkoutData);
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

  const checkoutData: PolarCheckoutRequest = {
    product_id: productId,
    success_url: successUrl,
    customer_email: userEmail,
    metadata: {
      user_id: userId,
      credits: creditAmount.toString(),
      type: "credit_pack",
    },
  };

  return await createCheckout(checkoutData);
}

/**
 * Generic function to create a Polar checkout session
 */
async function createCheckout(data: PolarCheckoutRequest): Promise<PolarCheckoutResponse> {
  const response = await fetch(`${POLAR_BASE_URL}/v1/checkouts/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Polar checkout creation failed:", errorText);
    throw new Error(`Failed to create Polar checkout: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Get customer information from Polar
 */
export async function getPolarCustomer(customerId: string) {
  const response = await fetch(`${POLAR_BASE_URL}/v1/customers/${customerId}`, {
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Polar customer: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get subscription information from Polar
 */
export async function getPolarSubscription(subscriptionId: string) {
  const response = await fetch(`${POLAR_BASE_URL}/v1/subscriptions/${subscriptionId}`, {
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Polar subscription: ${response.status}`);
  }

  return await response.json();
}

/**
 * Cancel a subscription in Polar
 */
export async function cancelPolarSubscription(subscriptionId: string) {
  const response = await fetch(`${POLAR_BASE_URL}/v1/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${POLAR_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel Polar subscription: ${response.status}`);
  }

  return await response.json();
}