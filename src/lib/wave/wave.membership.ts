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

  // First preference:
  // if the user already has an enrolled future wave, use that.
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
      cohorts: {
        start_at: "asc",
      },
    },
  });

  if (enrolledFutureMembership) {
    return enrolledFutureMembership;
  }

  // Second preference:
  // otherwise fall back to any currently open membership.
return prisma.cohort_members.findFirst({
  where: {
    user_id: userId,
    status: {
      in: ["enrolled", "active"],
    },
  },
  include: {
    cohorts: true,
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
    status: "waiting",
    updated_at: new Date(),
  },
});
  }

  return prisma.cohort_members.create({
    data: {
      user_id: userId,
      cohort_id: cohort.id,
      status: "enrolled",
      enrolled_at: new Date(),
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
      activated_at: membership.activated_at ?? membership.cohorts.start_at,
    },
    include: {
      cohorts: true,
    },
  });
}