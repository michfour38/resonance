// server/routers/journey.ts
// Journey progression router.
//
// KEY DESIGN: room unlock status is authoritative server-side.
// syncUnlocks() is the single function responsible for transitioning
// journey_progress rows from locked → active based on scheduled_unlock_at.
//
// It is called:
//   1. In journeyRouter.myProgress (server action on dashboard load)
//   2. By a Supabase cron job every hour (configured separately)
//
// The client NEVER derives unlock state from timestamps.
// It reads the status field that syncUnlocks has already written.

import { authedProc, adminProc, router } from '../trpc';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

// ---------------------------------------------------------------------------
// syncUnlocks — authoritative server-side room unlock
// ---------------------------------------------------------------------------
// Finds all journey_progress rows for a user where:
//   - status = 'locked'
//   - scheduled_unlock_at <= now()
// and transitions them to status = 'active', setting unlocked_at = now().
//
// Returns the count of rows newly unlocked.
// Safe to call repeatedly — only transitions rows in 'locked' state.

export async function syncUnlocksForUser(userId: string): Promise<number> {
  const now = new Date();

  const result = await prisma.journeyProgress.updateMany({
    where: {
      userId,
      status: 'locked',
      scheduledUnlockAt: { lte: now },
    },
    data: {
      status: 'active',
      unlockedAt: now,
    },
  });

  // TODO Sprint 8: if result.count > 0, dispatch room_unlock notifications
  // for each newly unlocked room.

  return result.count;
}

// ---------------------------------------------------------------------------
// syncUnlocksForCohort — called by cron job
// ---------------------------------------------------------------------------
// Runs the same unlock logic for ALL users in a cohort at once.
// More efficient than per-user calls for the cron case.

export async function syncUnlocksForCohort(cohortId: string): Promise<number> {
  const now = new Date();

  const result = await prisma.journeyProgress.updateMany({
    where: {
      cohortId,
      status: 'locked',
      scheduledUnlockAt: { lte: now },
    },
    data: {
      status: 'active',
      unlockedAt: now,
    },
  });

  return result.count;
}

// ---------------------------------------------------------------------------
// syncUnlocksGlobal — called by cron job across all active cohorts
// ---------------------------------------------------------------------------

export async function syncUnlocksGlobal(): Promise<number> {
  const now = new Date();

  const result = await prisma.journeyProgress.updateMany({
    where: {
      status: 'locked',
      scheduledUnlockAt: { lte: now },
      cohort: { status: 'active' },
    },
    data: {
      status: 'active',
      unlockedAt: now,
    },
  });

  return result.count;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const journeyRouter = router({

  /**
   * Returns all 10 journey_progress rows for the current user, ordered by
   * week number. Safe to call in waiting state — all rows exist from enrollment.
   *
   * Runs syncUnlocksForUser first to ensure status is current before returning.
   * This is the server action equivalent of "check and update on page load."
   * The cron job is the primary unlock mechanism; this is the fallback.
   */
  myProgress: authedProc.query(async ({ ctx }) => {
    // 1. Find the user's current active cohort membership
    const membership = await ctx.prisma.cohortMember.findFirst({
      where: {
        userId: ctx.userId,
        status: { in: ['enrolled', 'active'] },
      },
      include: {
        cohort: {
          select: { id: true, name: true, startAt: true, status: true },
        },
      },
    });

    if (!membership) {
      return { cohort: null, progress: [] };
    }

    // 2. Run server-side unlock sync before returning (fallback to cron)
    await syncUnlocksForUser(ctx.userId);

    // 3. Fetch updated progress rows
    const progress = await ctx.prisma.journeyProgress.findMany({
      where: {
        userId: ctx.userId,
        cohortId: membership.cohortId,
      },
      include: {
        room: {
          select: {
            id: true,
            slug: true,
            name: true,
            weekNumber: true,
            theme: true,
            isIntegration: true,
          },
        },
      },
      orderBy: { room: { weekNumber: 'asc' } },
    });

    return {
      cohort: membership.cohort,
      progress,
    };
  }),

  /**
   * Mark a room as completed. Only callable when room status = active.
   * Completion is user-driven — does NOT unlock the next room.
   * Unlock is time-driven via syncUnlocks.
   */
  completeRoom: authedProc
    .input(z.object({ roomSlug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { slug: input.roomSlug },
      });

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      }

      const jp = await ctx.prisma.journeyProgress.findFirst({
        where: { userId: ctx.userId, roomId: room.id },
      });

      if (!jp) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey progress not found' });
      }

      if (jp.status !== 'active') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: jp.status === 'locked'
            ? 'This room is not yet unlocked.'
            : 'This room is already completed.',
        });
      }

      return ctx.prisma.journeyProgress.update({
        where: { id: jp.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });
    }),

  // ── Admin procedures ───────────────────────────────────────────────────────

  /**
   * Admin: manually override a room's lock status for a specific user.
   * Sets adminOverride = true so the override is auditable.
   */
  adminUnlockRoom: adminProc
    .input(
      z.object({
        userId:   z.string().uuid(),
        roomSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.findUnique({
        where: { slug: input.roomSlug },
      });

      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      }

      const jp = await ctx.prisma.journeyProgress.findFirst({
        where: { userId: input.userId, roomId: room.id },
      });

      if (!jp) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey progress row not found' });
      }

      return ctx.prisma.journeyProgress.update({
        where: { id: jp.id },
        data: {
          status: 'active',
          unlockedAt: new Date(),
          adminOverride: true,
        },
      });
    }),

  /**
   * Admin: manually trigger syncUnlocks for a specific cohort.
   * Used to force-unlock rooms without waiting for the cron job.
   */
  adminSyncCohort: adminProc
    .input(z.object({ cohortId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const count = await syncUnlocksForCohort(input.cohortId);
      return { unlocked: count };
    }),
});
