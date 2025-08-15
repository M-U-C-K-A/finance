import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addCredits, rechargeMonthlyCredits } from "@/lib/credits";
import { TransactionType, SubscriptionPlan } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    console.log("Polar webhook received:", { type, data });

    switch (type) {
      case "subscription.created":
      case "subscription.updated":
        await handleSubscriptionUpdate(data);
        break;
      
      case "subscription.canceled":
        await handleSubscriptionCancellation(data);
        break;
      
      case "order.created":
        await handleOrderCreated(data);
        break;
      
      default:
        console.log("Unhandled webhook type:", type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Polar webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(data: any) {
  const { id: polarSubscriptionId, user_id: polarUserId, product, status } = data;
  
  // Find user by polar customer ID or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { subscription: { polarCustomerId: polarUserId } },
        { email: data.customer?.email }
      ]
    }
  });

  if (!user) {
    console.error("User not found for subscription:", data);
    return;
  }

  // Map Polar product to subscription plan
  const planMapping: Record<string, SubscriptionPlan> = {
    "starter": SubscriptionPlan.STARTER,
    "professional": SubscriptionPlan.PROFESSIONAL,
    "enterprise": SubscriptionPlan.ENTERPRISE,
  };

  const plan = planMapping[product?.name?.toLowerCase()] || SubscriptionPlan.FREE;
  const isActive = status === "active";

  // Update or create subscription
  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan,
      isActive,
      apiAccess: isActive && plan !== SubscriptionPlan.FREE,
      polarSubscriptionId,
      polarCustomerId: polarUserId,
      polarProductId: product?.id,
      renewsAt: data.current_period_end ? new Date(data.current_period_end) : null,
    },
    update: {
      plan,
      isActive,
      apiAccess: isActive && plan !== SubscriptionPlan.FREE,
      polarSubscriptionId,
      polarCustomerId: polarUserId,
      polarProductId: product?.id,
      renewsAt: data.current_period_end ? new Date(data.current_period_end) : null,
    },
  });

  // Recharge monthly credits if subscription is active
  if (isActive) {
    await rechargeMonthlyCredits(user.id);
  }
}

async function handleSubscriptionCancellation(data: any) {
  const { user_id: polarUserId } = data;
  
  const user = await prisma.user.findFirst({
    where: {
      subscription: { polarCustomerId: polarUserId }
    }
  });

  if (!user) {
    console.error("User not found for cancellation:", data);
    return;
  }

  // Update subscription to inactive but keep until period end
  await prisma.subscription.update({
    where: { userId: user.id },
    data: {
      isActive: false,
      apiAccess: false,
      cancelledAt: new Date(),
    },
  });
}

async function handleOrderCreated(data: any) {
  const { user_id: polarUserId, product, amount } = data;
  
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { subscription: { polarCustomerId: polarUserId } },
        { email: data.customer?.email }
      ]
    }
  });

  if (!user) {
    console.error("User not found for order:", data);
    return;
  }

  // Handle credit pack purchases
  const creditPackMapping: Record<string, number> = {
    "100-credits": 100,
    "500-credits": 500,
    "2000-credits": 2000,
  };

  const creditsToAdd = creditPackMapping[product?.name] || 0;
  
  if (creditsToAdd > 0) {
    await addCredits(
      user.id,
      creditsToAdd,
      TransactionType.PACK_PURCHASE,
      `Credit pack purchase: ${creditsToAdd} credits`,
      data.id
    );
  }
}