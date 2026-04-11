// server/routers/admin.ts
// Admin procedures — all protected by adminProc middleware.
//
// All database access goes through Prisma using the DATABASE_URL connection,
// which connects directly to Railway PostgreSQL with full write access.
// No Supabase client or RLS bypass is needed — Railway does not use RLS.

import { adminProc, router } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { syncUnlocksForCohort } from './journey';

// ── Thursday scheduling helpers ──────────────────────────────────────────────

// Hour (UTC) at which cohorts start on their Thursday.
// Change this constant to adjust the default start time globally.
const COHORT_START_HOUR_UTC = 9; // 09:00 UTC

/**
 * Returns the next Thursday at COHORT_START_HOUR_UTC.
 * If today is Thursday and the start hour has not yet passed, returns today.
 * Otherwise returns the coming Thursday (1–7 days ahead).
 *
 * "Next" is computed in UTC to keep cohort scheduling timezone-independent.
 */
function nextThursday(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sun … 4 = Thu … 6 = Sat
  const THURSDAY = 4;

  // Days until the next Thursday (0 if today is Thursday)
  let daysUntil = (THURSDAY - day + 7) % 7;

  // If today is Thursday but the start hour has already passed, use next week
  if (daysUntil === 0 && now.getUTCHours() >= COHORT_START_HOUR_UTC) {
    daysUntil = 7;
  }

  const thursday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntil,
    COHORT_START_HOUR_UTC,
    0, 0, 0,
  ));

  return thursday;
}

/**
 * Generates a deterministic cohort name from a Thursday date and slot label.
 * Examples:
 *   formatCohortName(date, 'A') → "Cohort · Thu 12 Jun 2025"
 *   formatCohortName(date, 'B') → "Cohort · Thu 12 Jun 2025 · B"
 *
 * The primary slot ('A') omits the label to keep names clean for MVP.
 * Secondary slots include the label so admins can distinguish them.
 * This naming scheme is the Phase 2 extensibility contract — do not change
 * the format without migrating existing cohort names.
 */
function formatCohortName(date: Date, slotLabel: string): string {
  const day   = date.getUTCDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year  = date.getUTCFullYear();
  const base  = `Cohort · Thu ${day} ${month} ${year}`;
  return slotLabel === 'A' ? base : `${base} · ${slotLabel}`;
}


export const adminRouter = router({

  // ── Cohort management ──────────────────────────────────────────────────────

  // ── Thursday scheduling ────────────────────────────────────────────────────
  //
  // Cohort start dates are always the next available Thursday at COHORT_START_HOUR
  // UTC. Admins never pick a date — the system computes it.
  //
  // Phase 2 extensibility: slotLabel ('A', 'B', 'C'…) allows multiple cohorts
  // to share the same Thursday start date when volume exceeds one cohort's
  // capacity. MVP always uses 'A'. A second slot is opened by calling
  // createCohort again with slotLabel: 'B' — no schema change required.

  createCohort: adminProc
    .input(
      z.object({
        // slotLabel: 'A' for the primary weekly cohort.
        // Pass 'B', 'C', etc. for additional same-week slots (Phase 2).
        slotLabel: z.string().min(1).max(4).default('A'),
        pathway:   z.enum(['discover', 'relate', 'harmonize']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startAt = nextThursday();
      const name    = formatCohortName(startAt, input.slotLabel);

      // Idempotent: if a non-completed cohort already exists for this
      // Thursday + slotLabel, return it rather than creating a duplicate.
      const existing = await ctx.prisma.cohort.findFirst({
        where: {
          name,
          status: { not: 'completed' },
        },
      });
      if (existing) return existing;

      return ctx.prisma.cohort.create({
        data: {
          name,
          startAt,
          pathway: input.pathway,
          status:  'open_enrollment',
        },
      });
    }),

  updateCohortStatus: adminProc
    .input(
      z.object({
        cohortId: z.string().uuid(),
        status:   z.enum(['draft', 'open_enrollment', 'waiting']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.cohort.update({
        where: { id: input.cohortId },
        data:  { status: input.status },
      });
    }),

  listCohorts: adminProc.query(async ({ ctx }) => {
    return ctx.prisma.cohort.findMany({
      orderBy: { startAt: 'desc' },
      include: {
        _count: { select: { members: true, circles: true } },
      },
    });
  }),

  getCohort: adminProc
    .input(z.object({ cohortId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.cohort.findUniqueOrThrow({
        where: { id: input.cohortId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  journeyStatus: true,
                  pathway: true,
                },
              },
            },
          },
          circles: {
            include: {
              _count: { select: { members: true } },
            },
          },
        },
      });
    }),

  // ── User assignment ────────────────────────────────────────────────────────

  /**
   * Assigns a user to a cohort. This is the critical enrollment operation:
   *
   * 1. Validates cohort is not already active (no mid-cohort entry).
   * 2. Validates user is not already in an active cohort (one journey at a time).
   * 3. Creates cohort_member row.
   * 4. Creates all 10 journey_progress rows (locked, with pre-computed unlock times).
   * 5. Creates locked user_insight rows for all insight definitions (if not already seeded).
   *
   * All writes in a single Prisma transaction.
   */
  assignUserToCohort: adminProc
    .input(
      z.object({
        userId:   z.string(),
        cohortId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cohort = await ctx.prisma.cohort.findUniqueOrThrow({
        where: { id: input.cohortId },
      });

      // Rule: no mid-cohort entry
      if (cohort.status === 'active' || cohort.status === 'completed') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot assign a user to a cohort that is already active or completed.',
        });
      }

      // Rule: one active journey at a time (application-level enforcement)
      const existingActive = await ctx.prisma.cohortMember.findFirst({
        where: {
          userId: input.userId,
          status: { in: ['enrolled', 'active'] },
        },
      });

      if (existingActive) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User is already enrolled in an active or upcoming cohort.',
        });
      }

      // Fetch rooms and insight definitions for seeding
      const [rooms, insightDefs] = await Promise.all([
        ctx.prisma.room.findMany({ orderBy: { weekNumber: 'asc' } }),
        ctx.prisma.insightDefinition.findMany(),
      ]);

      // Check which insights are already seeded for this user
      const existingInsights = await ctx.prisma.userInsight.findMany({
        where: { userId: input.userId },
        select: { insightId: true },
      });
      const existingInsightIds = new Set(existingInsights.map((i) => i.insightId));

      // Build journey_progress creates
      const journeyProgressCreates = rooms.map((room) => ({
        userId:            input.userId,
        cohortId:          input.cohortId,
        roomId:            room.id,
        status:            'locked' as const,
        scheduledUnlockAt: new Date(
          cohort.startAt.getTime() + (room.weekNumber - 1) * 7 * 24 * 60 * 60 * 1000
        ),
      }));

      // Build user_insight creates (skip already-seeded)
      const insightCreates = insightDefs
        .filter((def) => !existingInsightIds.has(def.id))
        .map((def) => ({
          userId:    input.userId,
          insightId: def.id,
          status:    'locked' as const,
        }));

      // Atomic transaction
      await ctx.prisma.$transaction([
        ctx.prisma.cohortMember.create({
          data: {
            cohortId: input.cohortId,
            userId:   input.userId,
            status:   'enrolled',
          },
        }),
        ctx.prisma.journeyProgress.createMany({
          data: journeyProgressCreates,
          skipDuplicates: true,
        }),
        ...(insightCreates.length > 0
          ? [ctx.prisma.userInsight.createMany({
              data: insightCreates,
              skipDuplicates: true,
            })]
          : []),
      ]);

      return { enrolled: true, roomsSeeded: rooms.length };
    }),

  assignUserToCircle: adminProc
    .input(
      z.object({
        userId:   z.string(),
        circleId: z.string().uuid(),
        role:     z.enum(['member', 'facilitator']).default('member'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.circleMember.create({
        data: input,
      });
    }),

  // ── Cohort activation ──────────────────────────────────────────────────────

  /**
   * Activates a cohort. This is the critical lifecycle event.
   *
   * Idempotent — safe to call multiple times. Only transitions members
   * with status = 'enrolled'. Already-active members are skipped.
   *
   * For each enrolled member:
   *   1. Sets cohort_member.status = active
   *   2. Sets profile.journey_status = active
   *   3. Sets journey_progress Room 1 row to active + unlockedAt = now()
   *
   * Sets cohort.status = active.
   *
   * Also runs syncUnlocksForCohort in case start_at has already passed
   * and other rooms need to be unlocked too.
   *
   * Notifications are dispatched after the transaction (deferred to Sprint 8).
   */
  activateCohort: adminProc
    .input(z.object({ cohortId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const cohort = await ctx.prisma.cohort.findUniqueOrThrow({
        where: { id: input.cohortId },
      });

      if (cohort.status === 'completed') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cohort is already completed.',
        });
      }

      // Fetch enrolled (not yet activated) members only — idempotency
      const enrolledMembers = await ctx.prisma.cohortMember.findMany({
        where: { cohortId: input.cohortId, status: 'enrolled' },
        select: { id: true, userId: true },
      });

      if (enrolledMembers.length === 0 && cohort.status === 'active') {
        return { activated: 0, message: 'Cohort already active, no enrolled members to transition.' };
      }

      // Find Room 1
      const room1 = await ctx.prisma.room.findFirstOrThrow({
        where: { weekNumber: 1 },
      });

      const now = new Date();

      // Perform all transitions in a single transaction
      await ctx.prisma.$transaction([
        // 1. Activate the cohort
        ctx.prisma.cohort.update({
          where: { id: input.cohortId },
          data:  { status: 'active' },
        }),

        // 2. Transition each enrolled member
        ...enrolledMembers.map((m) =>
          ctx.prisma.cohortMember.update({
            where: { id: m.id },
            data:  { status: 'active', activatedAt: now },
          })
        ),

        // 3. Set journey_status = active on each member's profile
        ...enrolledMembers.map((m) =>
          ctx.prisma.profile.update({
            where: { id: m.userId },
            data:  { journeyStatus: 'active' },
          })
        ),

        // 4. Unlock Room 1 for each member
        ...enrolledMembers.map((m) =>
          ctx.prisma.journeyProgress.updateMany({
            where: {
              userId:   m.userId,
              cohortId: input.cohortId,
              roomId:   room1.id,
              status:   'locked', // idempotency guard
            },
            data: { status: 'active', unlockedAt: now },
          })
        ),
      ]);

      // Run full sync in case start_at is in the past and other rooms are also due
      await syncUnlocksForCohort(input.cohortId);

      // TODO Sprint 8: dispatch welcome notifications and emails for enrolledMembers

      return { activated: enrolledMembers.length };
    }),

  // ── Users ──────────────────────────────────────────────────────────────────

  listUsers: adminProc
    .input(
      z.object({
        journeyStatus: z
          .enum(['waiting', 'active', 'completed', 'withdrawn'])
          .optional(),
        unassigned: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.unassigned) {
        // Users with no active cohort_member row
        return ctx.prisma.profile.findMany({
          where: {
            cohortMemberships: {
              none: {
                status: { in: ['enrolled', 'active'] },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      return ctx.prisma.profile.findMany({
        where: input.journeyStatus
          ? { journeyStatus: input.journeyStatus }
          : {},
        orderBy: { createdAt: 'desc' },
        include: {
          cohortMemberships: {
            where: { status: { in: ['enrolled', 'active'] } },
            include: { cohort: { select: { name: true, status: true } } },
            take: 1,
          },
        },
      });
    }),

  getUser: adminProc
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.profile.findUniqueOrThrow({
        where: { id: input.userId },
        include: {
          cohortMemberships: {
            include: {
              cohort: { select: { id: true, name: true, status: true, startAt: true } },
            },
          },
          circleMembers: {
            include: {
              circle: { select: { id: true, name: true } },
            },
          },
          journeyProgress: {
            include: { room: { select: { name: true, weekNumber: true } } },
            orderBy: { room: { weekNumber: 'asc' } },
          },
          _count: {
            select: {
              reflectionSessions: true,
              journalEntries: true,
            },
          },
        },
      });
    }),

  // ── Reports ────────────────────────────────────────────────────────────────

  listReports: adminProc
    .input(
      z.object({
        status: z
          .enum(['pending', 'reviewed', 'actioned', 'dismissed'])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.report.findMany({
        where:   input.status ? { status: input.status } : {},
        orderBy: { createdAt: 'desc' },
        include: {
          reporter:     { select: { displayName: true } },
          reportedUser: { select: { displayName: true } },
        },
      });
    }),

  resolveReport: adminProc
    .input(
      z.object({
        reportId:   z.string().uuid(),
        status:     z.enum(['reviewed', 'actioned', 'dismissed']),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.report.update({
        where: { id: input.reportId },
        data: {
          status:     input.status,
          adminNotes: input.adminNotes,
          reviewedAt: new Date(),
          reviewedBy: ctx.userId,
        },
      });
    }),

  // ── Circles ────────────────────────────────────────────────────────────────

  createCircle: adminProc
    .input(
      z.object({
        cohortId:     z.string().uuid(),
        name:         z.string().min(1).max(60),
        facilitatorId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.circle.create({ data: input });
    }),

  createCirclePrompt: adminProc
    .input(
      z.object({
        circleId: z.string().uuid(),
        content:  z.string().min(1),
        roomId:   z.string().uuid().optional(),
        isIntro:  z.boolean().default(false),
        isPinned: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.circlePrompt.create({
        data: { ...input, authorId: ctx.userId },
      });
    }),
});
