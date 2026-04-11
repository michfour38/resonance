// server/routers/inquiry.ts — Sprint 0 stub. Implemented in Sprint 4.
import { router, activeProc } from '../trpc';
import { z } from 'zod';

export const inquiryRouter = router({
  // Stub
  get: activeProc
    .input(z.object({ inquiryId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.inquirySession.findUnique({ where: { id: input.inquiryId } });
    }),
});
