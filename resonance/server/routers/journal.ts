// server/routers/journal.ts — Sprint 0 stub. Implemented in Sprint 5.
import { router, authedProc } from '../trpc';
import { z } from 'zod';

export const journalRouter = router({
  list: authedProc
    .input(z.object({ phase: z.enum(['pre_journey', 'in_journey', 'all']).default('all') }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.journalEntry.findMany({
        where: {
          userId: ctx.userId,
          ...(input.phase !== 'all' ? { entryPhase: input.phase } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
