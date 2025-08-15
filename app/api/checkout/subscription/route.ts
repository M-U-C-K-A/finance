import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { createSubscriptionCheckout } from "@/lib/polar";
import { SubscriptionPlan } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !Object.values(SubscriptionPlan).includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (plan === SubscriptionPlan.FREE) {
      return NextResponse.json({ error: "Cannot checkout FREE plan" }, { status: 400 });
    }

    const checkout = await createSubscriptionCheckout(plan, user.email, user.id);

    return NextResponse.json({
      checkout_url: checkout.url,
      checkout_id: checkout.id,
      expires_at: checkout.expires_at,
    });
  } catch (error) {
    console.error("Subscription checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}