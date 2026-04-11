import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function upgradeEthericTier(params: {
  subscriptionItemId: string;
  newPriceId: string;
}) {
  const { subscriptionItemId, newPriceId } = params;

  return stripe.subscriptionItems.update(subscriptionItemId, {
    price: newPriceId,
    proration_behavior: "always_invoice",
  });
}