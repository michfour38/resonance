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
    activeMembership.pathway === "discover" || activeMembership.pathway === "relate"
      ? activeMembership.pathway
      : null;

  if (activeMembership.state === "ACTIVE" && progression.phase === "COMPLETED") {
    await prisma.cohort_members.update({
      where: { id: activeMembership.id },
      data: {
        state: "COMPLETED",
        status: "completed",
        completed_at: activeMembership.completed_at ?? new Date(),
      },
    });

    return {
      membership: {
        id: activeMembership.id,
        state: "COMPLETED",
        joinedAt: activeMembership.joined_at,
        activatedAt: activeMembership.activated_at,
        completedAt: activeMembership.completed_at ?? new Date(),
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
      state: activeMembership.state,
      joinedAt: activeMembership.joined_at,
      activatedAt: activeMembership.activated_at,
      completedAt: activeMembership.completed_at,
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