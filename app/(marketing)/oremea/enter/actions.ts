"use server";

import { prisma } from "@/lib/prisma";

type UpsertEntryLeadInput = {
  email: string;
  firstName?: string;
  source?: string;
};

export async function upsertEntryLead(input: UpsertEntryLeadInput) {
  const email = input.email?.trim().toLowerCase();
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
  const email = input.email?.trim().toLowerCase();
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