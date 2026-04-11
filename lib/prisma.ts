// lib/prisma.ts
// Prisma client singleton.
//
// In development, Next.js hot reload creates new module instances on each
// file change, which would exhaust the database connection pool if we
// instantiated PrismaClient in the module body directly.
//
// Solution: store the client on the global object in development.
// In production, module instances are stable — a single import is fine.
//
// Reference: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
