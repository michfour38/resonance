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
      },
    });

    const expiresAt = lead?.entry_access_expires_at ?? null;
    const hasAccess = Boolean(
      expiresAt && expiresAt.getTime() > Date.now()
    );

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