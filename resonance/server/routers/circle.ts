// server/routers/circle.ts — Sprint 0 stub. Implemented in Sprint 6.
import { router, authedProc } from '../trpc';

export const circleRouter = router({
  myCircle: authedProc.query(async ({ ctx }) => {
    return ctx.prisma.circleMember.findFirst({
      where: { userId: ctx.userId },
      include: { circle: true },
    });
  }),
});
