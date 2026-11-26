# Sacrament Meeting Planner

Next.js (App Router) + TypeScript + Tailwind CSS app to plan, view and print weekly sacrament meeting programs. Meeting data is stored in a **PostgreSQL database (Neon on Vercel)**.

## Routes
| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/meetings` | Paginated list (5 per page) with URL-based search: `?query=smith&page=2` |
| `/meetings/[id]` | Full agenda + print view |
| `/meetings/current` | Redirects to the most recent Sunday's meeting (ward time zone, resolved on the server) |
| `GET /api/meetings[?date=YYYY-MM-DD]` | List / filter meetings (400 if the date is invalid) |
| `GET /api/meetings/[id]` | 200 meeting, 400 invalid id, 404 not found |
| `/login` | Bishopric sign in (Auth.js credentials) |
| `/meetings/new`, `/meetings/[id]/edit` | **Protected** admin forms (create / edit) with server-side Zod validation; visitors who are not signed in are redirected to `/login`; a non-existent id shows a not-found page |

Mutations (create, update, delete) are Server Actions in `lib/actions.ts`. Unexpected errors in the meetings routes are caught by `error.tsx`.

Route groups: `app/(public)` holds the member-facing pages (with their own layout and loading skeleton) and `app/(admin)` holds the leader-facing pages. Group folders do not appear in URLs.

## Authentication (Week 05)
Auth.js (`next-auth@beta`) with the Credentials provider. Accounts live in the `users` table (bcrypt hashes).
- `auth.config.ts`: shared config and the `authorized` callback that decides which routes are protected.
- `proxy.ts`: Next.js 16 proxy (formerly middleware) that redirects unauthenticated visitors from `/meetings/new` and `/meetings/[id]/edit` to `/login`.
- `auth.ts`: Credentials provider (checks the password with bcrypt).
- Server Actions in `lib/actions.ts` also require a session, because the Delete button is on the public list.
- Required environment variables: `DATABASE_URL` and `AUTH_SECRET` (never commit them).
- Create the first account: `node --env-file=.env scripts/create-user.mjs <email> <password> "<name>"`.

## Metadata (Week 05)
Site defaults and a title template in `app/layout.tsx`; route metadata in `/meetings` and `/login`; `generateMetadata` for `/meetings/[id]`; the Open Graph image (`app/opengraph-image.tsx`) and the favicon (`app/icon.tsx`) are generated in code.

## Database setup
1. In Vercel, create a **Neon** database (Storage) and connect it to this project.
2. `vercel link` then `vercel env pull .env.local` (this creates `DATABASE_URL`; `.env.local` is git-ignored).
3. Run `db/schema.sql` and then `db/seed.sql` in Vercel -> Storage -> your database -> **Query**.
4. `npm install` and `npm run dev`.

## Scripts
`npm run dev` · `npm run build` · `npm run lint`

VERCEL: https://sacrament-meetings-ep6s8rm9d.vercel.app/
