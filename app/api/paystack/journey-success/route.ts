import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.oremea.com";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

async function getSignedInEmail() {
  const user = await currentUser();

  const primaryEmail =
    user?.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? "";

  return normalizeEmail(primaryEmail);
}

export async function GET() {
  const email = await getSignedInEmail();

  if (email) {
    try {
      await prisma.entry_leads.upsert({
        where: { email },
        update: {
          journey_paid_at: new Date(),
          journey_access_granted: true,
        },
        create: {
          email,
          journey_paid_at: new Date(),
          journey_access_granted: true,
        },
      });
    } catch (error) {
      console.error("Journey access grant failed:", error);
    }
  }

  return NextResponse.redirect(`${APP_URL}/journey?payment=success`);
}