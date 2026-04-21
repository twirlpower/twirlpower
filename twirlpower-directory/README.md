# TwirlPower Directory — Next.js Setup & Deployment

## Project structure
```
twirlpower-directory/
├── app/
│   ├── globals.css          # Brand tokens + utility classes
│   ├── layout.tsx           # Root layout (Nav + Footer)
│   ├── page.tsx             # Homepage with live stats
│   ├── page.module.css
│   ├── coaches/
│   │   ├── page.tsx         # Coach finder (ISR, filters, Schema.org)
│   │   └── page.module.css
│   ├── clubs/
│   │   ├── page.tsx         # Club directory (claimed + unclaimed)
│   │   ├── page.module.css
│   │   └── [id]/
│   │       ├── page.tsx     # Individual club profile (ISR, Schema.org)
│   │       └── page.module.css
│   └── competitions/
│       ├── page.tsx         # Competitions (upcoming + past, ISR, Schema.org)
│       └── page.module.css
├── components/
│   ├── Nav.tsx / .module.css
│   ├── Footer.tsx / .module.css
│   ├── PageHero.tsx / .module.css
│   ├── FilterBar.tsx / .module.css
│   ├── CoachGrid.tsx / .module.css
│   └── CompetitionCard.tsx / .module.css
├── lib/
│   └── supabase.ts          # All data fetchers + TypeScript types
├── .env.example
├── next.config.js
├── package.json
└── vercel.json
```

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Supabase anon key

# 3. Run dev server
npm run dev
# Visit http://localhost:3000
```

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub integration (recommended)
1. Push this folder to a GitHub repo (e.g. `twirlpower-directory`)
2. Vercel Dashboard → Add New Project → Import from GitHub
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://fascxnrrnsknjnojfxvv.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `NEXT_PUBLIC_SITE_URL` = `https://directory.twirlpower.com`
   - `NEXT_PUBLIC_APP_URL` = `https://app.twirlpower.com`
   - `NEXT_PUBLIC_MARKETING_URL` = `https://twirlpower.com`
4. Deploy

## Add the subdomain

After deploying:
1. Vercel → Project → Settings → Domains → Add `directory.twirlpower.com`
2. Bluehost DNS → Add CNAME:
   - Name: `directory`
   - Value: `cname.vercel-dns.com`
3. Wait 10–30 min for propagation

## ISR (Incremental Static Regeneration)

All pages use `export const revalidate = 3600` (1 hour).
- Pages are statically generated at build time
- Automatically refreshed every hour in the background
- Google sees fully rendered HTML — no JavaScript required for indexing

## SEO built in

Every page includes:
- `<title>` and `<meta description>` via Next.js Metadata API
- Schema.org JSON-LD structured data (Event, Person, SportsOrganization)
- Open Graph tags via root layout
- URL-based filters (each filter combo = unique indexable URL)

## Pages & URLs

| URL | Content |
|-----|---------|
| `directory.twirlpower.com` | Homepage with live stats |
| `directory.twirlpower.com/coaches` | Coach finder |
| `directory.twirlpower.com/clubs` | Club directory |
| `directory.twirlpower.com/clubs/[id]` | Individual club profile |
| `directory.twirlpower.com/competitions` | Upcoming competitions |
| `directory.twirlpower.com/competitions?past=1` | Past competitions |

## Filter URLs (all indexable by Google)

```
/coaches?state=CO
/coaches?org=USTA
/coaches?state=CO&org=USTA
/clubs?state=TX
/competitions?org=NBTA
/competitions?state=FL&org=USTA
/competitions?past=1&org=DMA
```

## Phase 2 additions (not built yet)

- `/organizations/usta` — USTA classification guide (SEO goldmine)
- `/organizations/nbta` — NBTA guide
- `/organizations/tu` — TU guide
- `/organizations/dma` — DMA guide
- Coach profile pages `/coaches/[id]`
- Competition detail pages `/competitions/[id]`
