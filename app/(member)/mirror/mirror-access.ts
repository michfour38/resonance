import { prisma } from "@/lib/prisma";

export async function getMirrorAccess(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const entryLead = await prisma.entry_leads.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      pathway: true,
    },
  });

  const pathway = entryLead?.pathway ?? "discover";

  return {
    pathway,
    hasFullMirror: pathway === "relate",
    has2QOnly: pathway === "discover",
  };
}