// server/routers/cohort.ts — Sprint 0 stub
import { router, authedProc } from '../trpc';

export const cohortRouter = router({
  mine: authedProc.query(async ({ ctx }) => {
    return ctx.prisma.cohortMember.findFirst({
      where: { userId: ctx.userId, status: { in: ['enrolled', 'active'] } },
      include: { cohort: true },
    });
  }),
});
