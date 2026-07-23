// server/routers/_app.ts
// Root tRPC router. Assembles active application routers.
// Import AppRouter type in the client for end-to-end type safety.

import { router } from "../trpc";
import { adminRouter } from "./admin";
import { journeyRouter } from "./journey";
import { profileRouter } from "./profile";
import { cohortRouter } from "./cohort";
import { reflectionRouter } from "./reflection";
import { inquiryRouter } from "./inquiry";

export const appRouter = router({
  admin: adminRouter,
  journey: journeyRouter,
  profile: profileRouter,
  cohort: cohortRouter,
  reflection: reflectionRouter,
  inquiry: inquiryRouter,
});

export type AppRouter = typeof appRouter;
