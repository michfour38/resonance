// middleware.ts
// Route protection middleware — Clerk edition.
//
// Responsibilities:
//   1. Protect all non-public routes using Clerk's auth state.
//   2. Redirect unauthenticated requests to Clerk's sign-in page.
//
// What middleware does NOT do:
//   - Check onboarding_done (done in the (app) layout Server Component)
//   - Check is_admin (done in the (admin) layout Server Component)
//   - Check journey_status (done in tRPC middleware: activeProc)

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/test-route',
  '/moderation(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
