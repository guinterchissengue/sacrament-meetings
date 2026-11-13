# Sacrament Meeting Planner

Next.js (App Router) + TypeScript + Tailwind CSS app to plan, view and print weekly sacrament meeting programs.



## Routes
| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/meetings` | All meetings (fetches `/api/meetings`) |
| `/meetings/[id]` | Full agenda + print (fetches `/api/meetings/[id]`) |
| `/meetings/current` | Redirects to the most recent Sunday's meeting |
| `GET /api/meetings[?date=YYYY-MM-DD]` | List / filter meetings |
| `GET /api/meetings/[id]` | 200 meeting, 400 invalid id, 404 not found |

Data lives in `lib/meetings-db.ts` (in-memory, temporary).

VERCEL: https://sacrament-meetings-ep6s8rm9d.vercel.app/