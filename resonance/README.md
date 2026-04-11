# Resonance — Stable Baseline (Sprint 1)

A 10-week guided relational development platform.

## Stack

- **Next.js 14** (App Router, Server Components)
- **Clerk** — authentication
- **Railway PostgreSQL** — database
- **Prisma** — database access
- **tRPC v11** — type-safe API
- **Tailwind CSS** — styling
- **Anthropic Claude API** — AI reflection (Sprint 3+)

---

## What works in this baseline

- Clerk sign-in and sign-up
- Onboarding flow — collects display name and pathway, writes profile row to Railway
- Dashboard — reads real profile data and cohort status from database
- Route protection — middleware, layout guards, redirect loop prevention
- tRPC context — correctly passes Clerk session to all authenticated procedures
- Admin shell — `is_admin` verified from DB on every request

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in all values. Minimum required to boot:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `DATABASE_URL` | Railway → PostgreSQL → Connect tab |
| `DIRECT_URL` | Same as DATABASE_URL for Railway |

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run database migration

```bash
npx prisma migrate dev --name baseline_schema
```

Then apply supplementary SQL in order via Railway's query console:

1. `migrations/003_partial_indexes.sql`
2. `migrations/004_updated_at_triggers.sql`
3. `migrations/005_seed_rooms.sql`
4. `migrations/006_seed_insights.sql`

### 5. Start

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Clerk redirects to sign-in. After signing up, onboarding runs, then dashboard loads with real data.

---

## Route map

```
/                        → redirects to /dashboard or /sign-in
/sign-in                 → Clerk hosted sign-in
/sign-up                 → Clerk hosted sign-up
/onboarding/welcome      → 3-step onboarding form (name + pathway)
/dashboard               → waiting-state dashboard (real profile + cohort data)
/admin                   → admin shell (is_admin guard, returns 404 for others)
/api/trpc/[trpc]         → tRPC handler
```

## Route group structure

```
app/
├── (admin)/             is_admin guard — 404 for non-admins
├── (app)/               auth + onboarding guard — redirects if incomplete
│   └── dashboard/
├── (auth)/              Clerk sign-in / sign-up pages
├── (onboarding)/        auth-only guard — no profile check (prevents redirect loop)
│   └── onboarding/welcome/
└── api/trpc/[trpc]/     tRPC fetch handler
```

---

## Key decisions

- **`auth(opts.req)`** in `createContext` — Clerk requires the request object to read the session inside a tRPC fetch handler. Without it, all authed procedures return UNAUTHORIZED.
- **`(onboarding)` is a separate route group** — if `/onboarding/welcome` lived inside `(app)`, the layout's profile check would redirect to itself and loop. Separate group breaks the loop.
- **`profile.upsert` not `profile.create`** — idempotent, safe on retry or double-submit.
- **`is_admin` read from DB** — never trusted from Clerk JWT.
- **Profile.id = Clerk userId** — string, not UUID. All FK columns pointing at profiles have no `@db.Uuid`.

---

## Useful commands

```bash
npm run dev           # dev server
npm run build         # production build
npm run typecheck     # tsc --noEmit
npx prisma studio     # browse database
npx prisma generate   # regenerate client after schema changes
npx prisma validate   # validate schema
```
