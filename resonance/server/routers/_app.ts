// server/routers/_app.ts
// Root tRPC router. Assembles all sub-routers.
// Import AppRouter type in the client for end-to-end type safety.

import { router } from '../trpc';
import { adminRouter }   from './admin';
import { journeyRouter } from './journey';

// Sprint 0: admin and journey routers are implemented.
// Remaining routers are stubbed and will be filled in Sprint 1.
// Stubs are imported as empty routers so the AppRouter type is stable
// and client code can reference procedure paths without runtime errors.

import { profileRouter }    from './profile';
import { cohortRouter }     from './cohort';
import { reflectionRouter } from './reflection';
import { inquiryRouter }    from './inquiry';
import { circleRouter }     from './circle';
import { journalRouter }    from './journal';

export const appRouter = router({
  admin:      adminRouter,
  journey:    journeyRouter,
  profile:    profileRouter,
  cohort:     cohortRouter,
  reflection: reflectionRouter,
  inquiry:    inquiryRouter,
  circle:     circleRouter,
  journal:    journalRouter,
});

export type AppRouter = typeof appRouter;
