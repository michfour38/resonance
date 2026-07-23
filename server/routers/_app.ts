// server/routers/_app.ts
// Root tRPC router.
// No active application routers are currently registered.

import { router } from "../trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
