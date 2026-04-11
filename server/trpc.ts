import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@clerk/nextjs/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { prisma } from '@/lib/prisma';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const { userId } = auth(opts.req);

  return {
    prisma,
    userId,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProc = t.procedure;

export const authedProc = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const adminProc = authedProc.use(async ({ ctx, next }) => {
  const profile = await ctx.prisma.profile.findUnique({
    where: { id: ctx.userId },
    select: { isAdmin: true },
  });

  if (!profile?.isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next();
});

export const activeProc = authedProc.use(async ({ ctx, next }) => {
  const profile = await ctx.prisma.profile.findUnique({
    where: { id: ctx.userId },
    select: { journeyStatus: true },
  });

  if (!profile) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
  }

  if (profile.journeyStatus !== 'active') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Journey is not active',
    });
  }

  return next();
});