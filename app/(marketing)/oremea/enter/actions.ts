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
      },
      create: {
        email,
        first_name: firstName,
        source,
      },
    });
  } catch (error) {
    console.error("Entry lead upsert failed:", error);
  }
}

export async function updateEntryLeadPathway(input: {
  email: string;
  pathway: "discover" | "relate";
  firstName?: string;
  source?: string;
}) {
  const email = normalizeEmail(input.email);
  const pathway = input.pathway;
  const firstName = input.firstName?.trim() || undefined;
  const source = input.source?.trim() || undefined;

  if (!email) return;

  try {
    await prisma.entry_leads.upsert({
      where: { email },
      update: { pathway },
      create: {
        email,
        first_name: firstName,
        source,
        pathway,
      },
    });
  } catch (error) {
    console.error("Entry lead pathway update failed:", error);
  }
}

export async function syncEntryAccessWindow(input?: {
  email?: string;
  paymentSuccess?: boolean;
}) {
  const signedInEmail = await getSignedInEmail();
  const fallbackEmail = normalizeEmail(input?.email);
  const email = signedInEmail || fallbackEmail;

  if (!email) {
    return {
      hasAccess: false,
      expiresAt: null as string | null,
    };
  }

  try {
    if (input?.paymentSuccess) {
      const paidAt = new Date();
      const expiresAt = new Date(
        paidAt.getTime() + 14 * 24 * 60 * 60 * 1000
      );

      await prisma.entry_leads.upsert({
        where: { email },
        update: {
          entry_paid_at: paidAt,
          entry_access_expires_at: expiresAt,
        },
        create: {
          email,
          entry_paid_at: paidAt,
          entry_access_expires_at: expiresAt,
        },
      });
    }

    const lead = await prisma.entry_leads.findUnique({
  where: { email },
  select: {
    entry_access_expires_at: true,
    journey_access_granted: true,
  },
});

    const expiresAt = lead?.entry_access_expires_at ?? null;
    const hasAccess =
  (expiresAt && expiresAt.getTime() > Date.now()) ||
  Boolean(lead?.journey_access_granted);

    return {
      hasAccess,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    };
  } catch (error) {
    console.error("Entry access window sync failed:", error);

    return {
      hasAccess: false,
      expiresAt: null as string | null,
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
      destination: "pay" as const,
    };
  }

  try {
    const lead = await prisma.entry_leads.findUnique({
  where: { email },
  select: {
    entry_access_expires_at: true,
    intro_completed_at: true,
    journey_access_granted: true,
  },
});

    const hasAccess =
  (lead?.entry_access_expires_at &&
    lead.entry_access_expires_at.getTime() > Date.now()) ||
  Boolean(lead?.journey_access_granted);

    if (!hasAccess) {
      return {
        email,
        hasAccess: false,
        destination: "pay" as const,
      };
    }

if (lead?.journey_access_granted) {
  return {
    email,
    hasAccess: true,
    destination: "journey" as const,
  };
}

if (lead?.intro_completed_at) {
  return {
    email,
    hasAccess: true,
    destination: "journey" as const,
  };
}

return {
  email,
  hasAccess: true,
  destination: "begin" as const,
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

export async function markIntroCompleted(input: { email: string }) {
  const email = input.email?.trim().toLowerCase();
  if (!email) return;

  try {
    await prisma.entry_leads.update({
      where: { email },
      data: {
        intro_completed_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Mark intro completed failed:", error);
  }
}