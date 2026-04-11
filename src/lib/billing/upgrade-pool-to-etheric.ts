import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const ETHERIC_TIER_1_PRICE_ID = process.env.STRIPE_PRICE_ETHERIC_TIER_1!;
const POOL_PRICE_ID = process.env.STRIPE_PRICE_POOL_MONTHLY!;
const POOL_PRICE_MONTHLY_CENTS = 4700;

export type UpgradePoolToEthericResult = {
  ethericSubscriptionId: string;
  creditedAmountCents: number;
  poolSubscriptionCanceled: boolean;
};

type ActivePoolSubscription = {
  id: string;
};

async function getActivePoolSubscription(
  customerId: string
): Promise<ActivePoolSubscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    expand: ["data.items.data.price"],
    limit: 20,
  });

  for (const subscription of subscriptions.data) {
    const hasPoolPrice = subscription.items.data.some(
      (item) => item.price.id === POOL_PRICE_ID
    );

    if (!hasPoolPrice) continue;

    return {
      id: subscription.id,
    };
  }

  return null;
}

/**
 * Cross-product upgrade:
 * Pool ($47/month) -> Etheric Loop Tier 1 ($150/month)
 *
 * Billing rule:
 * - If user has active Pool, always credit FULL Pool value ($47)
 * - Do NOT use time-based proration
 * - Create Etheric subscription
 * - Cancel Pool subscription without extra proration
 * - Preserve all app-side data/history
 */
export async function upgradePoolToEthericTier1(params: {
  customerId: string;
  paymentMethodId?: string;
}): Promise<UpgradePoolToEthericResult> {
  const { customerId, paymentMethodId } = params;

  const poolSub = await getActivePoolSubscription(customerId);

  let creditedAmountCents = 0;

  if (poolSub) {
    // IMPORTANT:
    // We intentionally give FULL credit ($47),
    // not time-based proration.
    // This keeps the upgrade experience clean and simple.
    creditedAmountCents = POOL_PRICE_MONTHLY_CENTS;

    await stripe.customers.update(customerId, {
      balance: -creditedAmountCents,
    });
  }

  if (paymentMethodId) {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  const ethericSub = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: ETHERIC_TIER_1_PRICE_ID,
      },
    ],
    payment_behavior: "default_incomplete",
    collection_method: "charge_automatically",
    expand: ["latest_invoice.payment_intent"],
  });

  let poolSubscriptionCanceled = false;

  if (poolSub) {
    await stripe.subscriptions.cancel(poolSub.id, {
      prorate: false,
      invoice_now: false,
    });
    poolSubscriptionCanceled = true;
  }

  return {
    ethericSubscriptionId: ethericSub.id,
    creditedAmountCents,
    poolSubscriptionCanceled,
  };
}