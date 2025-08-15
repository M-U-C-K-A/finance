import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";
import { createCreditPackCheckout } from "@/lib/polar";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { credits } = await request.json();

    const validCredits = [100, 500, 2000];
    if (!validCredits.includes(credits)) {
      return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 });
    }

    const checkout = await createCreditPackCheckout(credits, user.email, user.id);

    return NextResponse.json({
      checkout_url: checkout.url,
      checkout_id: checkout.id,
      expires_at: checkout.expires_at,
    });
  } catch (error) {
    console.error("Credit pack checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}