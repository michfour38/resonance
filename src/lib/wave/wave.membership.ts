import { prisma } from "@/lib/prisma";
import { getNextThursdayStartDate } from "./wave.progression";

const DEFAULT_WAVE_TIMEZONE = "Africa/Johannesburg";

function formatWaveDateLabel(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function findOpenMembershipForUser(userId: string) {
  const now = new Date();

  const enrolledFutureMembership = await prisma.cohort_members.findFirst({
    where: {
      user_id: userId,
      status: "enrolled",
      cohorts: {
        start_at: {
          gt: now,
        },
      },
    },
    include: {
      cohorts: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (enrolledFutureMembership) {
    return enrolledFutureMembership;
  }

  return prisma.cohort_members.findFirst({
    where: {
      user_id: userId,
      status: {
        in: ["enrolled", "active", "completed"],
      },
    },
    include: {
      cohorts: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function findOrCreateAssignedWaveForUser(
  userId: string,
  timezone: string = DEFAULT_WAVE_TIMEZONE
) {
  const existing = await findOpenMembershipForUser(userId);

  if (existing) {
    return existing;
  }

  const nextStart = getNextThursdayStartDate(new Date(), timezone);

  let cohort = await prisma.cohorts.findFirst({
    where: {
      start_at: nextStart,
      timezone,
    },
  });

  if (!cohort) {
    const label = `Wave ${formatWaveDateLabel(nextStart, timezone)}`;

    cohort = await prisma.cohorts.create({
      data: {
        name: label,
        start_at: nextStart,
        timezone,
        updated_at: new Date(),
      },
    });
  }

  return prisma.cohort_members.create({
    data: {
      user_id: userId,
      cohort_id: cohort.id,
      status: "enrolled",
    },
    include: {
      cohorts: true,
    },
  });
}

export async function activateMembershipIfWaveStarted(
  membershipId: string,
  now: Date = new Date()
) {
  const membership = await prisma.cohort_members.findUnique({
    where: { id: membershipId },
    include: { cohorts: true },
  });

  if (!membership) {
    throw new Error("Wave membership not found.");
  }

  if (membership.status !== "enrolled") {
    return membership;
  }

  if (membership.cohorts.start_at > now) {
    return membership;
  }

  return prisma.cohort_members.update({
    where: { id: membership.id },
    data: {
      status: "active",
    },
    include: {
      cohorts: true,
    },
  });
}