# TwirlPower — Competition Directory & Director Roadmap

*Updated: April 22, 2026*

---

## Vision

Build the definitive competition directory for competitive baton twirling. Start by aggregating competitions from all sources (director-created + scraped from org websites), then shift toward getting directors to host directly on TwirlPower by offering tools that make running competitions easier.

---

## Phase 1: Directory Foundation (Current Sprint)

### Competition Sources

**A. Director-Created Competitions**
- ✅ Directors sign up, get verified, create competitions in-app
- ✅ Competitions sync to directory (public_competitions table)
- ✅ Admin approval flow for new directors
- ✅ Director can edit/delete/duplicate competitions
- ⬜ Directory site (Next.js) reads from Supabase and displays competitions publicly
- ⬜ External visitors can view competition details without an account
- ⬜ CTA to create account and register for competitions

**B. Scraped Competitions (Admin-Curated)**
- ⬜ Build scraper for org websites: USTA, NBTA, TU, DMA
- ⬜ Scraper runs on schedule (Vercel cron, weekly)
- ⬜ Scraped competitions go to admin queue (NOT auto-published)
- ⬜ Admin review screen: approve, reject, or mark as duplicate
- ⬜ New DB field: `source` on public_competitions (values: 'director' | 'scraped' | 'claimed')
- ⬜ Approved scraped competitions appear in directory without a linked director
- ⬜ Deduplication: match by name + date + state before adding to queue

**C. Claim a Competition**
- ⬜ Unclaimed competitions (scraped, no director) show "Claim this competition" button
- ⬜ Claim flow: user creates director account → submits claim with documentation → admin approves → director linked to competition
- ⬜ Similar to club claim flow already built
- ⬜ New table: `competition_claims` (competition_id, user_id, message, document_url, status)
- ⬜ Admin approval screen for competition claims

### Directory Site (Next.js)
- ⬜ Upcoming competitions page (filterable by state, org, date)
- ⬜ Competition detail pages with SEO metadata
- ⬜ Coach/studio finder
- ⬜ Club directory
- ⬜ CTAs throughout → app.twirlpower.com signup
- ⬜ ISR revalidation every hour from Supabase

### WordPress Integration
- ⬜ Upcoming competitions widget (embedded JS, pulls from Supabase)
- ⬜ Stats bar widget (families, twirlers, competitions tracked)
- ⬜ Club finder teaser widget
- ⬜ Links to directory site for full listings

---

## Phase 2: Director Tools & Self-Service

### Goal
Reduce reliance on scraping by making TwirlPower the best place for directors to manage their competitions. More directors hosting directly = fewer duplicates, better data, more value for everyone.

### Competition Management Tools
- ⬜ Competition templates (master event → annual editions, e.g. "Shamrock Twirl 2026" → "Shamrock Twirl 2027")
- ⬜ Event schedule builder (age divisions, event order, time slots)
- ⬜ Registration management (open/close registration, waitlists)
- ⬜ Entry fee collection (Stripe integration)
- ⬜ Competitor check-in / attendance tracking
- ⬜ Results entry portal for directors
- ⬜ Live results publishing

### Judge Accounts
- ⬜ Judge signup and verification
- ⬜ Score entry interface (mobile-optimized)
- ⬜ Real-time score aggregation
- ⬜ Score display for families and coaches

### Enhanced Directory
- ⬜ Auto-deduplication (match scraped vs director-created by name similarity + date + location)
- ⬜ Competition ratings/reviews from families
- ⬜ Historical competition data (past years' results, attendance)
- ⬜ Director profiles on directory (bio, past competitions, ratings)

### Monetization
- ⬜ Stripe integration for competition registration fees
- ⬜ Platform fee on registrations (small % or flat fee per competitor)
- ⬜ Premium director features (custom branding, advanced analytics)
- ⬜ Free tier for basic competition listing

---

## Phase 3: Competition Detail Page & Competition-Day UX

### Schedule System
- ⬜ `competition_schedule` table (competition_id, event_name, division, start_time, end_time, order_number)
- ⬜ Directors can add/edit schedule entries
- ⬜ Families see "Your events" with times highlighted on My Competition tab
- ⬜ "Schedule not yet posted" placeholder when no data
- ⬜ Design with pagination from the start (high-volume feature)

### Competition-Day Adaptive Mode
- ⬜ Detail page auto-switches default tab based on date:
  - BEFORE → Overview tab
  - DURING → My Competition tab (progress bar, tap-to-log)
  - AFTER → Results tab
- ⬜ Refactor Competitor's Edge into reusable `CompetitionEdgeView` component
- ⬜ Edge works on any competition detail page, not just Home page

### Attendee & Community
- ⬜ Show attending twirler names (not just count)
- ⬜ "X twirlers from your club are attending"
- ⬜ Coach view: which linked twirlers are attending

## Phase 4: Public Results & Ratings

- ⬜ Directors/admins can publish results for a competition
- ⬜ Public results viewable without account (ties into directory)
- ⬜ Competition ratings/reviews from families post-event
- ⬜ Historical competition data (past years' results, attendance)
- ⬜ Director profiles on directory (bio, past competitions, ratings)

## Phase 5: Ecosystem & Growth

- ⬜ Multi-role accounts (family + coach + director in one login)
- ⬜ Push notifications for competition updates
- ⬜ API for org websites to pull TwirlPower data
- ⬜ Mobile app (React Native or Capacitor)
- ⬜ Partnerships with USTA, NBTA, TU, DMA for official data feeds
- ⬜ Live score publishing (judge accounts + real-time score entry)

---

## Pre-Launch Checklist

_Complete before inviting real users beyond beta testers._

- ⬜ Upgrade to Supabase Pro ($25/mo) — daily backups, point-in-time recovery, higher connection limits
- ⬜ Set up weekly manual database export as additional safety net
- ⬜ Verify RLS policies on all tables (no accidental public writes)
- ⬜ Test auth flows end-to-end (signup, login, password reset, co-guardian invite)
- ⬜ Verify email delivery (check Resend logs for bounce/spam rates)
- ⬜ Review Vercel usage limits (serverless function invocations)
- ⬜ Set up Supabase usage alerts (connection count, storage)

---

## Performance & Scale Prep

_Not urgent — do when approaching 5K+ active users or when query times degrade._

- ⬜ Paginate `loadAllData` — lazy-load competition history (recent first, fetch older on scroll)
- ⬜ Upgrade to Supabase Pro tier before public launch ($25/mo)
- ⬜ Add database indexes based on slow query logs
- ⬜ Optimize RLS policies (complex policies slow reads at scale)
- ⬜ Lazy-load director tools (schedules, registration, live results) — design with pagination from the start
- ⬜ Consider Supabase Realtime subscriptions for live features (connection limits per tier)
- ⬜ Real-time "users online" count in admin dashboard (Supabase Presence — requires Pro plan)

---

## Technical Notes

### Scraper Architecture
- Vercel serverless cron job (runs weekly)
- Separate scraper per org (USTA, NBTA, TU, DMA)
- Output: normalized competition objects (name, date, location, org, state)
- Insert into `scraped_competitions` staging table
- Admin reviews in admin panel → approve → copies to `public_competitions`

### New Database Tables Needed
- `scraped_competitions` — staging table for scraped data (name, date, org, state, source_url, status: pending|approved|rejected|duplicate)
- `competition_claims` — claim requests (competition_id, user_id, message, document_url, status: pending|approved|denied)
- Add `source` column to `public_competitions` (director|scraped|claimed)
- Add `claimed_by` column to `public_competitions` (nullable host_id)

### Key Principle
Scraped competitions are NEVER auto-published. Always admin-reviewed first. This prevents duplicates, inaccurate data, and maintains trust with directors who create competitions manually.
