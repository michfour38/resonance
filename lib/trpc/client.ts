// lib/trpc/client.ts
// tRPC React Query client.
// Import { trpc } from this file in Client Components.

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
