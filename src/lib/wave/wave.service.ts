import { prisma } from "@/lib/prisma";
import { MemberWaveContext } from "./wave.types";
import { getWaveProgression } from "./wave.progression";
import {
  activateMembershipIfWaveStarted,
  findOrCreateAssignedWaveForUser,
} from "./wave.membership";

export async function getMemberWaveContext(
  userId: string
): Promise<MemberWaveContext> {
  const assignedMembership = await findOrCreateAssignedWaveForUser(userId);

  const activeMembership = await activateMembershipIfWaveStarted(
    assignedMembership.id,
    new Date()
  );

  const progression = getWaveProgression(
    activeMembership.cohorts.start_at,
    new Date()
  );

const membershipPathway =
  activeMembership.cohorts.pathway === "discover" ||
  activeMembership.cohorts.pathway === "relate"
    ? activeMembership.cohorts.pathway
    : null;

  if (activeMembership.status === "active" && progression.phase === "COMPLETED") {
    await prisma.cohort_members.update({
      where: { id: activeMembership.id },
      data: {
        status: "completed",
      },
    });

    return {
      membership: {
        id: activeMembership.id,
        state: "COMPLETED",
        joinedAt: activeMembership.activated_at ?? activeMembership.cohorts.start_at,
        activatedAt: activeMembership.activated_at,
        completedAt: new Date(),
        pathway: membershipPathway,
      },
      wave: {
        id: activeMembership.cohorts.id,
        name: activeMembership.cohorts.name,
        startsAt: activeMembership.cohorts.start_at,
      },
      progression,
    };
  }

  return {
    membership: {
      id: activeMembership.id,
      state:
        activeMembership.status === "active"
          ? "ACTIVE"
          : activeMembership.status === "completed"
            ? "COMPLETED"
            : "PRE_WAVE",
      joinedAt: activeMembership.activated_at ?? activeMembership.cohorts.start_at,
      activatedAt: activeMembership.activated_at,
      completedAt: activeMembership.status === "completed" ? new Date() : null,
      pathway: membershipPathway,
    },
    wave: {
      id: activeMembership.cohorts.id,
      name: activeMembership.cohorts.name,
      startsAt: activeMembership.cohorts.start_at,
    },
    progression,
  };
}