"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type UpsertEntryLeadInput = {
  email: string;
  firstName?: string;
  source?: string;
};

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

export async function upsertEntryLead(input: UpsertEntryLeadInput) {
  const email = normalizeEmail(input.email);
  const firstName = input.firstName?.trim() || undefined;
  const source = input.source?.trim() || undefined;

  if (!email) return;

  try {
    await prisma.entry_leads.upsert({
      where: { email },
      update: {
        first_name: firstName,
        source,
        pathway: "discover",
      },
      create: {
        email,
        first_name: firstName,
        source,
        pathway: "discover",
      },
    });
  } catch (error) {
    console.error("Entry lead upsert failed:", error);
  }
}

export async function grantJourneyAccess(input?: {
  email?: string;
}) {
  const signedInEmail = await getSignedInEmail();
  const fallbackEmail = normalizeEmail(input?.email);
  const email = signedInEmail || fallbackEmail;

  if (!email) {
    return {
      hasAccess: false,
      email: null as string | null,
    };
  }

  try {
    await prisma.entry_leads.upsert({
      where: { email },
      update: {
        journey_access_granted: true,
        journey_paid_at: new Date(),
        pathway: "discover",
      },
      create: {
        email,
        journey_access_granted: true,
        journey_paid_at: new Date(),
        pathway: "discover",
      },
    });

    return {
      hasAccess: true,
      email,
    };
  } catch (error) {
    console.error("Grant journey access failed:", error);

    return {
      hasAccess: false,
      email,
    };
  }
}

export async function getEntryResumeState(input?: {
  email?: string;
}) {
  const signedInEmail = await getSignedInEmail();
  const fallbackEmail = normalizeEmail(input?.email);
  const email = signedInEmail || fallbackEmail;

  if (!email) {
    return {
      email: null as string | null,
      hasAccess: false,
      destination: "sign-in" as const,
    };
  }

  try {
    const lead = await prisma.entry_leads.findUnique({
      where: { email },
      select: {
        journey_access_granted: true,
      },
    });

    if (lead?.journey_access_granted) {
      return {
        email,
        hasAccess: true,
        destination: "journey" as const,
      };
    }

    return {
      email,
      hasAccess: false,
      destination: "pay" as const,
    };
  } catch (error) {
    console.error("Entry resume state failed:", error);

    return {
      email,
      hasAccess: false,
      destination: "pay" as const,
    };
  }
}