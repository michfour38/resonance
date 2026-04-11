// server/routers/profile.ts

import { router, authedProc } from '../trpc';
import { z } from 'zod';

export const profileRouter = router({

  // Returns null if no profile exists yet (new user pre-onboarding).
  get: authedProc.query(async ({ ctx }) => {
    return ctx.prisma.profile.findUnique({ where: { id: ctx.userId } });
  }),

  // Upsert — idempotent, safe to call if the row already exists.
  // Called at the end of the onboarding flow with onboardingDone: true.
  // Also safe to call mid-flow to save partial progress (Sprint 2+).
  upsert: authedProc
    .input(z.object({
      displayName: z.string().min(2).max(60),
      pathway:     z.enum(['discover', 'relate', 'harmonize']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.profile.upsert({
        where:  { id: ctx.userId },
        create: {
          id:            ctx.userId,
          displayName:   input.displayName,
          pathway:       input.pathway,
          onboardingDone: true,
        },
        update: {
          displayName:   input.displayName,
          pathway:       input.pathway,
          onboardingDone: true,
        },
      });
    }),

});
