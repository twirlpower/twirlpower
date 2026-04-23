# TwirlPower — Competition Directory & Director Roadmap

*Updated: April 23, 2026*

---

## Vision

Build the definitive competition directory for competitive baton twirling. Start by aggregating competitions from all sources (director-created + scraped from org websites), then shift toward getting directors to host directly on TwirlPower by offering tools that make running competitions easier.

---

## Phase 1: Directory Foundation

### Competition Sources

**A. Director-Created Competitions**
- ✅ Directors sign up, get verified, create competitions in-app
- ✅ Competitions sync to directory (public_competitions table)
- ✅ Admin approval flow for new directors
- ✅ Director can edit/delete/duplicate competitions
- ✅ Director public profile page (name, avatar, org badges, bio, contact, competitions list)
- ✅ Director profile clickable from competition cards
- ✅ Competition schema expanded (end_date, city, event_type, contact, sanction_number, category, source_series)
- ✅ State abbreviation mapping and normalization
- ✅ Event type dropdown (State, Regional, National, Open, Invitational, Miss Majorette, Camp, Other)
- ⬜ Directory site (Next.js) reads from Supabase and displays competitions publicly
- ⬜ External visitors can view competition details without an account
- ⬜ CTA to create account and register for competitions

**B. Scraped / Imported Competitions**
- ✅ CSV import of 207 competitions from all 4 orgs (NBTA, DMA, TU, USTA) via SQL upsert
- ✅ `event_slug` deduplication on import (ON CONFLICT DO UPDATE)
- ⬜ Build scraper for org websites: USTA, NBTA, TU, DMA
- ⬜ Scraper runs on schedule (Vercel cron, weekly)
- ⬜ Scraped competitions go to admin queue (NOT auto-published)
- ⬜ Admin review screen: approve, reject, or mark as duplicate
- ⬜ Deduplication: match by name + date + state before adding to queue

**C. Claim a Competition**
- ✅ Full claim lifecycle: URL capture (?claim=COMP_ID) → claim submission → admin approval → director linked
- ✅ ClaimCompetitionCard component with message + doc upload
- ✅ Admin "Competition Claims" sub-tab with approve/deny
- ✅ Claim status indicators on competition cards
- ✅ Email notifications: claim_request, claim_approved
- ✅ Admin unclaim feature: remove director from competition
- ✅ RLS policies for admin competition updates/deletes
- ✅ Claim history audit trail (searchable, paginated, 20/page)

### Competition Detail Page
- ✅ CompetitionDetailPage component with tabbed layout
- ✅ Date-adaptive default tab (During → My Events, Past → Results, Future → Overview)
- ✅ Overview tab: venue with maps link, contact, sanction number, director (clickable), description, attendees
- ✅ My Events tab: reuses Competitor's Edge event card pattern
- ✅ Results tab: logged results with scorecard links
- ✅ Action buttons: Add to My Competitions, Get Directions, Share
- ✅ Deep link from directory (?comp=COMP_ID)
- ✅ Coach view: Overview-only (no My Events/Results tabs)
- ✅ Coach invite twirlers section on competition detail

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

## Completed: Coach Features (April 22-23, 2026)

- ✅ Coach verification system (file upload, admin approval, verified badge)
- ✅ Coach invite link (?coach=COACH_ID) — auto-links new users, bulk email invite
- ✅ Coach post-signup invite screen with shareable link
- ✅ Coach competitions page: Competition History, Upcoming, Favorites tabs
- ✅ Coach favorites (star button on upcoming cards, localStorage persistence, favorites tab)
- ✅ Coach invite twirlers to public competitions (CoachInviteToCompetition component)
- ✅ Coach competition detail: Overview-only tab with invite section
- ✅ Coach history: clickable cards link to competition detail when in public directory
- ✅ Coach history tabs: "Twirler History" + "Created by Me"
- ✅ Fixed coach white screen crashes (missing props)
- ✅ Coach competition-detail and director-profile routes added to coach render path

## Completed: Admin Panel Restructure (April 23, 2026)

- ✅ Consolidated tabs: Dashboard, Competitions, Directors, Clubs, Accounts
- ✅ Dashboard (formerly Data Overview) is default first tab
- ✅ Clickable stat cards → jump to correct tab and sub-tab
- ✅ Renamed Hosts → Directors throughout
- ✅ Competitions: sub-tabs Pending Claims | All Competitions (state filter, sort, pagination 20/page) | Claim History
- ✅ Directors: sub-tabs Pending | All Directors (with comp count)
- ✅ Clubs: sub-tabs Pending Claims | All Clubs | Claim History
- ✅ Accounts: sub-tabs Families | Twirlers | Coaches (with delete, verify/revoke buttons)
- ✅ Bug reports: resolve with timestamp + resolved_by, show/hide resolved list
- ✅ Added Clubs stat card, renamed HOSTS → DIRECTORS

## Completed: Family & Competition Fixes (April 23, 2026)

- ✅ Family-created competitions always unsanctioned (removed toggle from modal)
- ✅ "User-reported" badge for family-created competitions
- ✅ Coach upcoming: "View Details →" instead of "Add to my competitions"
- ✅ Mobile results cards: scorecard button, smart Get Directions
- ✅ Dashboard: "Recent Competitions" list (up to 5 past, clickable)
- ✅ Notification split: bell = family notifications, sidebar badge = admin tasks

---

## Phase 2: Director Tools & Self-Service

### Competition Management Tools
- ⬜ Competition templates (master event → annual editions)
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
- ⬜ Auto-deduplication (match by name similarity + date + location)
- ⬜ Competition ratings/reviews from families
- ⬜ Historical competition data (past years' results, attendance)

### Monetization
- ⬜ Stripe integration for competition registration fees
- ⬜ Platform fee on registrations
- ⬜ Premium director features (custom branding, advanced analytics)
- ⬜ Free tier for basic competition listing

---

## Phase 3: Schedule System & Competition-Day UX

- ⬜ `competition_schedule` table
- ⬜ Directors can add/edit schedule entries
- ⬜ Families see "Your events" with times highlighted
- ⬜ Competition-Day adaptive mode (auto-switch tabs based on date)
- ⬜ Refactor Competitor's Edge into reusable component

## Phase 4: Public Results & Ratings

- ⬜ Directors/admins can publish results for a competition
- ⬜ Public results viewable without account
- ⬜ Competition ratings/reviews post-event
- ⬜ Historical competition data

## Phase 5: Ecosystem & Growth

- ⬜ Multi-role accounts (family + coach + director in one login)
- ⬜ Push notifications for competition updates
- ⬜ API for org websites to pull TwirlPower data
- ⬜ Mobile app (React Native or Capacitor)
- ⬜ Partnerships with USTA, NBTA, TU, DMA for official data feeds
- ⬜ Live score publishing (judge accounts + real-time score entry)

---

## Known Bugs / Outstanding Issues

- ⬜ Club member approval flow: pending members not showing for coach/club owner to approve
- ⬜ Club member pending notification not appearing in sidebar
- ⬜ Coach invite to competition: verify `invites` table schema has correct columns
- ⬜ Marketing/directory site: competition cards link to app, unclaimed comps show "Claim" button

---

## Pre-Launch Checklist

- ⬜ Upgrade to Supabase Pro ($25/mo)
- ⬜ Set up weekly manual database export
- ⬜ Verify RLS policies on all tables
- ⬜ Test auth flows end-to-end
- ⬜ Verify email delivery (Resend logs)
- ⬜ Review Vercel usage limits
- ⬜ Set up Supabase usage alerts

---

## Performance & Scale Prep

- ⬜ Paginate `loadAllData` — lazy-load competition history
- ⬜ Upgrade to Supabase Pro tier before public launch
- ⬜ Add database indexes based on slow query logs
- ⬜ Optimize RLS policies
- ⬜ Lazy-load director tools with pagination
- ⬜ Supabase Realtime subscriptions for live features
- ⬜ Real-time "users online" count in admin dashboard (Supabase Presence — requires Pro plan)
