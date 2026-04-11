import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { upgradePoolToEthericTier1 } from "@/src/lib/billing/upgrade-pool-to-etheric";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const paymentMethodId =
      typeof body.paymentMethodId === "string" ? body.paymentMethodId : undefined;

    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        id: true,
        stripe_customer_id: true,
      },
    });

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripe customer not found" },
        { status: 400 }
      );
    }

    const result = await upgradePoolToEthericTier1({
      customerId: profile.stripe_customer_id,
      paymentMethodId,
    });

    // Your app-side access model:
    await prisma.billing_access.upsert({
      where: { user_id: userId },
      update: {
        pool_active: true, // included through Etheric layer
        mirror_active: true,
        mirror_source: "etheric_loop",
        etheric_loop_tier: "tier_1",
        etheric_loop_active: true,
      },
      create: {
        user_id: userId,
        pool_active: true,
        mirror_active: true,
        mirror_source: "etheric_loop",
        etheric_loop_tier: "tier_1",
        etheric_loop_active: true,
      },
    });

    return NextResponse.json({
      ok: true,
      ethericSubscriptionId: result.ethericSubscriptionId,
      creditedAmountCents: result.creditedAmountCents,
      message:
        "Upgraded to Etheric Loop Tier 1. Pool history and Mirror history remain intact.",
    });
  } catch (error) {
    console.error("Pool -> Etheric upgrade failed:", error);
    return NextResponse.json(
      { error: "Upgrade failed" },
      { status: 500 }
    );
  }
}