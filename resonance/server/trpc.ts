// server/trpc.ts
// tRPC initialisation, context, and reusable middleware — Clerk edition.
//
// Middleware chain:
//   publicProc  — no auth required
//   authedProc  — requires valid Clerk session (userId present)
//   activeProc  — requires journey_status = active
//   adminProc   — requires profiles.is_admin = true (read from DB, not JWT)
//
// is_admin is read from the database on every admin request — never trusted
// from the Clerk JWT, which would require a custom claim and would lag on revocation.

import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import superjson from 'superjson';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export async function createContext(opts: FetchCreateContextFnOptions) {
  // auth() must receive the request so Clerk can read the session cookie/header.
  // Without this, auth() returns userId: null for every tRPC call and all
  // authedProc procedures throw UNAUTHORIZED silently.
  const { userId } = auth(opts.req);

  return {
    userId,
    prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// ---------------------------------------------------------------------------
// tRPC initialisation
// ---------------------------------------------------------------------------

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router    = t.router;
export const middleware = t.middleware;

// ---------------------------------------------------------------------------
// Reusable procedures
// ---------------------------------------------------------------------------

export const publicProc = t.procedure;

// ── authedProc ──────────────────────────────────────────────────────────────

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, userId: ctx.userId },
  });
});

export const authedProc = t.procedure.use(enforceAuth);

// ── activeProc ──────────────────────────────────────────────────────────────

const enforceActive = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const profile = await ctx.prisma.profile.findUnique({
    where: { id: ctx.userId },
    select: { journeyStatus: true },
  });

  if (!profile) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Profile not found' });
  }

  if (profile.journeyStatus !== 'active') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Your journey has not started yet. Room access opens when your cohort begins.',
    });
  }

  return next({
    ctx: { ...ctx, userId: ctx.userId },
  });
});

export const activeProc = t.procedure.use(enforceActive);

// ── adminProc ───────────────────────────────────────────────────────────────

const enforceAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  // Read is_admin from DB on every request — never trust the JWT.
  const profile = await ctx.prisma.profile.findUnique({
    where: { id: ctx.userId },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }

  return next({
    ctx: { ...ctx, userId: ctx.userId },
  });
});

export const adminProc = t.procedure.use(enforceAdmin);
