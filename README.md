# Resonance

A 10-week guided relational development platform.

---

## Stack

- **Next.js 14** (App Router)
- **Clerk** for authentication
- **Prisma** for database access
- **Railway PostgreSQL** for the database
- **tRPC** for type-safe API
- **Tailwind CSS** for styling
- **Anthropic Claude API** for AI reflection (Sprint 3+)

---

## Prerequisites

- Node.js 18 or later
- A Railway PostgreSQL database
- A Clerk account and application

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value. Required to boot:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `DATABASE_URL` | Railway → PostgreSQL service → Connect tab |
| `DIRECT_URL` | Same as DATABASE_URL for Railway |

### 3. Set up Clerk

In your Clerk dashboard:
1. Create a new application.
2. Under **Paths**, confirm or set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/onboarding/welcome`
3. Copy the publishable key and secret key into `.env.local`.

### 4. Generate the Prisma client

```bash
npx prisma generate
```

### 5. Run the database migration

```bash
npx prisma migrate dev --name baseline_schema
```

This creates all tables. Then apply the supplementary SQL files in order via your Railway SQL console or `psql`:

- `migrations/003_partial_indexes.sql`
- `migrations/005_seed_rooms.sql`
- `migrations/006_seed_insights.sql`

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You will be redirected to Clerk's sign-in page.

---

## Project structure

```
resonance/
├── app/
│   ├── (admin)/            Admin panel (is_admin guard)
│   ├── (app)/              Main app (auth + onboarding guard)
│   ├── (auth)/
│   │   ├── sign-in/        Clerk SignIn component
│   │   └── sign-up/        Clerk SignUp component
│   └── api/trpc/[trpc]/    tRPC HTTP handler
├── components/             Shared React components (Sprint 1+)
├── config/rooms.json       Static room content
├── lib/
│   ├── prisma.ts           Prisma client singleton
│   ├── getRoomConfig.ts    Room config loader
│   └── trpc/               tRPC React Query client and provider
├── migrations/             Supplementary SQL (partial indexes, seeds)
├── prisma/schema.prisma    Canonical domain model
├── server/
│   ├── trpc.ts             tRPC init, context (Clerk userId), middleware
│   └── routers/            tRPC procedure routers
├── middleware.ts            Route protection (Clerk)
└── .env.example
```

---

## Auth flow

1. User visits any protected route → Clerk middleware redirects to `/sign-in`.
2. User signs in via Clerk's hosted UI.
3. Clerk sets a session cookie and redirects to `/dashboard`.
4. `(app)/layout.tsx` checks `auth().userId` and `profile.onboardingDone`.
5. If no profile exists yet, user is sent to `/onboarding/welcome` (Sprint 1).
6. tRPC procedures read `auth().userId` from `@clerk/nextjs/server` in `createContext`.

## Profile creation

`Profile.id` is the Clerk `userId` (e.g. `user_xxxxxxxxxxxxxxxxxxxx`). Profiles are created:
- Via a Clerk **user.created** webhook (recommended for production), or
- Lazily on first authenticated API call (acceptable for development).

Sprint 1 implements the profile creation step in the onboarding flow.

---

## Useful commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run typecheck     # TypeScript check
npx prisma studio     # Browse database
npx prisma validate   # Validate schema
npx prisma generate   # Regenerate client after schema changes
```

---

## Key architectural decisions

- **Clerk for auth** — no Supabase dependency. `Profile.id` = Clerk `userId`.
- **`profiles.is_admin`** — read from DB on every admin request, never from JWT.
- **`journey_progress` uniqueness** — `@@unique([userId, cohortId, roomId])`. One-active-cohort-per-user enforced in application logic only.
- **Room unlocks are server-authoritative** — `journey.syncUnlocks` runs on dashboard load and via cron. Client only reads `status` from DB.
- **`journey_progress` rows created at enrollment** — all 10 rows exist immediately, enabling the waiting-state dashboard.
