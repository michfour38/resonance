// server/routers/reflection.ts — Sprint 0 stub. Implemented in Sprint 3.
import { router, activeProc } from '../trpc';
import { z } from 'zod';

export const reflectionRouter = router({
  // Stub: returns empty array. Prevents import errors in _app.ts
  history: activeProc
    .input(z.object({ roomSlug: z.string() }))
    .query(async () => []),
});
