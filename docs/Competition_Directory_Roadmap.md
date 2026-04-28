# TwirlPower — Competition Directory & Director Roadmap
Updated: April 30, 2026 (twirler lineup)

---

## Vision

Build the definitive Competition Operating System for baton twirling. Two parallel tracks:
1. **Family/Coach app** (app.twirlpower.com) — competition tracking, results, TwirlTracker, club management
2. **Director app** (manage.twirlpower.com) — full competition management, scheduling, registration, results, live scoring

Long-term goal: Replace third-party tabulation systems entirely. Every competition runs on TwirlPower.

---

## What's Been Built (April 2026)

### Family/Coach App (app.twirlpower.com)
- ✅ Family accounts, twirler profiles, guardian management
- ✅ Coach accounts, verification, athlete linking
- ✅ Club management (create, claim, join, approve members)
- ✅ Competition directory (public_competitions, 207 imported)
- ✅ Competition claiming flow (director claims scraped competition)
- ✅ Admin panel (competitions, directors, clubs, accounts tabs)
- ✅ Results tracking (score, placement, CAS/Movement events, scorecards)
- ✅ Scorecard photo upload + viewing (Supabase Storage)
- ✅ TwirlTracker (renamed from Competitor's Edge) — competition day control center
- ✅ Event Planner — pre-plan events before competition day with set #, lane, time
- ✅ Multi-role accounts (family + host + admin in one login)
- ✅ Coach favorites, coach invite to competitions
- ✅ Competition history, results history
- ✅ Directory site (Next.js) — live

### Director App (manage.twirlpower.com) — Phase 2A Complete
- ✅ Director dashboard (Upcoming/Draft/Past competitions)
- ✅ Create/Edit competition (4-step form: Basic Info, Registration, Settings, Events)
- ✅ Competition status lifecycle: draft → published → registration → locked → live → completed
- ✅ Reverse status transitions with confirmation
- ✅ Status audit log
- ✅ Gyms tab (add/name/reorder gyms, practice gym toggle)
- ✅ Schedule tab (renamed from Event Design) — visual lane board
  - Gym toggle, synchronized horizontal scrolling
  - Drag event categories from palette into gym
  - Lane columns auto-created per event
  - Block lane toggle, practice lane toggle
  - Practice gym linking (mirrors competition gym structure)
  - Color coding, event order numbers
  - Inline edit (gear icon on event chips) — opens edit modal pre-filled
- ✅ Build Events tab — director's event catalog
  - Events grouped by category (collapsible sections)
  - Add/Edit modal with auto-title preview (Division + Classification + Category + Age range)
  - Optional override for custom title
  - Qualifier toggle, description, notes, entry fee fields
  - Backed by new `competition_built_events` table
  - Drag-from-sidebar wiring on Schedule tab: chips link via `competition_lane_events.built_event_id`
- ✅ Master events table seeded (USTA, NBTA, TU, DMA)
- ✅ Master event categories with org default order (Settings Step 4 sorts by `master_events.order_number` then name)
- ✅ Competition settings: execution mode, avg set time, reset buffer, music plays, on-deck triggers, results release mode
- ✅ Placeholder tabs: Entries, Judges, Results

### Tab Structure (April 27, 2026)
**Overview | Gyms | Build Events | Schedule | Entries | Judges | Results**
- "Event Design" was renamed to "Schedule" (lane board kept intact)
- "Build Events" is a new tab for creating individual events from category templates
- Old auto-schedule "Schedule" tab was removed; will be rebuilt to consume Built Events

### Database (Supabase)
- ✅ All Phase 2 tables created and RLS-secured
- ✅ competition_gyms, competition_instance_lanes
- ✅ competition_event_instances, competition_events
- ✅ competition_event_categories, master_event_categories
- ✅ competition_schedule_items, competition_schedule_violations
- ✅ competition_entries, competition_planned_events
- ✅ competition_judge_assignments
- ✅ competition_status_log
- ✅ aggregate_awards stub
- ✅ payments, payment_items, refunds, credits (schema only)

---

## Real Competition Insights (April 26, 2026 — CO State USTA)

Key learnings from first live TwirlTracker test:

- **Scores come before placements** — state events release scores immediately but hold placements until awards. Need "Scored — Placement Pending" status.
- **Late twirlers happen** — directors fit in late entries on competition day. Need visible "+ Add Late Entry" on Run Competition page.
- **Results release mode** — scores can go out immediately, placements held until director releases. New competition setting: Standard | Scores First | Director Controlled.
- **TwirlTracker worked well** — event planner with set numbers was useful. Sort by set number, show Set # and Lane on cards.
- **CAS/Movement events** — different result format (Passed/Not Yet + level). Need separate result entry flow for these.
- **Music plays twice for practice** — practice blocks are timed warm-ups, not individual sets.

---

## Active Sprint — Phase 2B: Events Within Lanes + Schedule Builder

### Schedule + Build Events Tabs (Apr 27–28 — done)
- ✅ Events within lane columns (specific events: "Open Novice Solo 9-11")
- ✅ Inline edit (gear icon) on Schedule lane chips — opens edit modal pre-filled
- ✅ Build Events tab — director's catalog of events independent of lane placement
- ✅ Build Events Add/Edit modal (category, division, classification, age, custom title, description, notes, entry fee, qualifier toggle)
- ✅ Settings Step 4 sorts master_events by `order_number` then alphabetically
- ✅ Drag built events from sidebar into lane cells on Schedule tab
  - Sidebar shows built events grouped by category, focused category at top
  - Click a category header on the board to focus it in the sidebar
  - Cross-category drops rejected with toast
  - Placed events appear dimmed with checkmark in the sidebar
  - `built_event_id` FK on `competition_lane_events`
  - Drop already-placed event into a different lane → "Move it here?" prompt
- ✅ Schedule board grid layout (Apr 28)
  - SET column on the left; sequential set numbers across the entire schedule
  - Per-(lane × set-row) cells; one event per cell
  - Within-column drag handle (⋮⋮) to reorder events in the same lane × category
  - × button on chips to remove from lane (event returns to sidebar as unplaced)
  - Manual "+ Add Event" removed from lane cells (drag from sidebar only)
- ✅ Breaks — full-width amber rows, insertable between any two categories
  - "+ Break" affordance appears between sections in editing mode
  - Editable label + duration; per-gym; new `competition_schedule_breaks` table
- ✅ Practice Records subheading per category
  - Italic muted row under category header (centered across all lanes); default ON
  - Click to rename; × to hide; unified Practice toggle in the category header to show/hide
  - New `practice_label` / `show_practice` columns on `competition_events`
- ✅ Drag placed events between lanes (Apr 29) — chip drag from board, not just sidebar
- ✅ Cross-category drops are warned, not blocked — confirm prompt allows scattering events outside their home section
- ✅ Empty cells show "Drop event here" hint while a drag is in progress (sidebar OR board)
- ✅ Cross-category board chip move no longer duplicates the chip (Apr 30) — laneEvsForCat now matches by event_type only
- ✅ Lock toggle (Editing/Locked) scope extended to Build Events tab — same toggle disables Add/Edit/Delete and shows a "Schedule is locked" banner
- ✅ Twirler lineup inside placed events (Apr 30)
  - Each event chip is collapsible/expandable; collapsed view shows event name + twirler-count badge
  - Expanded view shows event header + ordered twirler rows with drag-handles
  - Set numbers now count TWIRLER ROWS (not events), sequential across the entire schedule
  - Manual + Add Twirler (name + optional club) and + Add Scratch
  - Within-event twirler reorder via drag handle; × to remove a twirler/scratch
  - New `competition_event_twirlers` table with the standard host/admin RLS chain
- ✅ Duet & group entry support on lineup
  - Added entry_type / partner_name / group_name columns
  - + Add Twirler form has a Solo/Duet/Group toggle, default selected from event category name (heuristic: "duet" → duet; "group/team/corps/parade/march" → group)
  - Duet displays as "Twirler 1 / Partner" on one row (one set slot)
  - Group displays as the team name on one row (one set slot)
  - Twirler-count badge on collapsed chip counts entries (not heads)
- ✅ Schedule export — Print/PDF (browser print dialog → Save as PDF) + CSV (UTF-8 BOM, equal-width lane columns in PDF)
- ✅ Public/Private visibility toggle on competitions (Apr 28)
  - New `is_public` column on `public_competitions`; backfilled true for already-approved comps
  - Toggle on Overview tab; ON sets `is_public + approved`, OFF clears `is_public`
  - Confirm prompt before publishing a still-draft competition
  - "View Public Listing →" link visible on the Overview when public
  - Family app's public-comp queries now also filter `is_public = true`
  - Director Create/Edit wizard now captures `description` (Step 1) and `registration_url` (Step 2, only when registration_mode = External URL)
  - Family app comp-detail Overview shows the description and a Register button when the host set a registration URL
- ✅ Entries tab + registration model (foundation for in-app + public-form + embed registration)
  - New `competition_entries` and `competition_entry_events` tables
  - Filterable table: search by name/club/email, status filter, status badges
  - Add/Edit modal: twirler info, parent contact, event picker (with partner/group inputs for duet/group categories), status, director notes
  - Registration source recorded per entry; "director" for in-tab adds. In-app / public-form / embed paths will write to the same tables.
  - Tab label shows live count: "Entries (N)"
  - Locked-schedule banner reminds the director that new entries won't appear on the board until they unlock and add them
- ⬜ Auto-sort per lane (Open → State, Novice → Advanced, younger → older)
- ⬜ Late entry support ("+Add Late Entry" button, Late badge)
- ⬜ Drag breaks to reorder between categories
- ⬜ Results release mode in competition settings

### TwirlTracker Fixes (family app)
- ⬜ Placement fully optional — never blocks saving
- ⬜ "Scored — Placement Pending" status and section
- ⬜ "Add Placement" quick action (1st/2nd/3rd/4th/Other)
- ⬜ Real-time UI update after result saved (no reload)
- ⬜ ON DECK + NEXT UP two-card layout (remove duplicate hero text)
- ⬜ Place pending amber indicator on completed cards
- ⬜ CAS/Movement white screen crash fix (score.toFixed bug)
- ⬜ Results event dropdown → pull from planned events list
- ⬜ Results level dropdown → sync with planned event skill level
- ⬜ Default sort by org when no set numbers entered
- ⬜ Scorecard upload white screen on mobile fix
- ⬜ Favicon restored on both apps

---

## Phase 2C — Schedule Builder

### Schedule Tab (director app)
- ⬜ Day tabs for multi-day competitions
- ⬜ Fixed synchronized lane header row
- ⬜ Auto Schedule Competition button
- ⬜ Category headers auto-inserted in default order
- ⬜ Practice blocks (full-width, no set number, amber styling)
- ⬜ Set numbers auto-generated sequentially
- ⬜ Scratch sets shown as empty (not hidden)
- ⬜ Drag twirlers into lane slots
- ⬜ Auto-sort: Open → State, Novice → Advanced, younger → older
- ⬜ Block lane toggle per event
- ⬜ Lock event (prevents further changes)
- ⬜ Mobile: swipe between lanes, tap to assign twirler

### Autoschedule V1
- ⬜ Distribute twirlers evenly across non-blocked lanes
- ⬜ Respect minimum gap between same twirler's events (default 15 min)
- ⬜ Flag violations as structured schedule_violations
- ⬜ Ask: overwrite existing or fill gaps only
- ⬜ Practice slots auto-scheduled X min before competition slot

---

## Phase 2D — Registration & Payments

- ⬜ Family registration flow (browse events, add to cart, checkout)
- ⬜ Stripe integration (entry fees, refunds, credits)
- ⬜ Registration open/close automation
- ⬜ Non-member guardian email flow
- ⬜ Director registration management (view signups, override fees, late additions)
- ⬜ Co-registration (multiple twirlers, single checkout)
- ⬜ Refund processing through director app
- ⬜ Payment reports (revenue by event, by day)

---

## Phase 2E — Entries & Judges Tabs

### Entries Tab
- ⬜ View all registrations per competition
- ⬜ Manual entry (name, club, age, guardian email, events)
- ⬜ Entry fee override per athlete (comp/scholarship)
- ⬜ Late addition on competition day
- ⬜ Export entries (CSV)

### Judges Tab
- ⬜ Add judges (name, email — no account required yet)
- ⬜ Assign judge to lane (default: whole day)
- ⬜ Override per event category (rotation, breaks, fairness)
- ⬜ Multiple judges per lane (olympic scoring option)

---

## Phase 3 — Competition Day (Run Competition Page)

- ⬜ /competition/:id/run — dedicated live page
- ⬜ Tablet-optimized UI (large tap targets, minimal chrome)
- ⬜ Current set across all lanes
- ⬜ Per-lane: current athlete, on-deck, queue
- ⬜ USTA mode: music indicator, all lanes advance together
- ⬜ NBTA/TU/DMA mode: each lane advances independently
- ⬜ No-show marking (judge taps, skips slot)
- ⬜ Late entry addition on competition day
- ⬜ Emergency pause
- ⬜ Director override for any status
- ⬜ Results entry per performance (score, placement, notes)
- ⬜ Results release controls (Standard/Scores First/Director Controlled)
- ⬜ "Release Placements" button when placements held

### Smart Warm-Up (family app)
- ⬜ Real-time set tracking
- ⬜ USTA: on-deck notification X sets before event (default 2)
- ⬜ Async orgs: on-deck notification X min before (default 15)
- ⬜ Progressive: "15 min away" → "5 min away" → "On deck"
- ⬜ Practice block notification when practice starts

---

## Phase 3B — Results & Scoring

- ⬜ Results tab in director app
- ⬜ Score entry per entry per judge
- ⬜ Multi-judge averaging (standard + olympic option)
- ⬜ Director review before finalizing
- ⬜ First place blocking (Protected First Place)
- ⬜ Tie handling (identical scores = tie, director resolves)
- ⬜ Score audit trail (all changes logged)
- ⬜ Results posted notifications (email + in-app)
- ⬜ Consolidated results email (members + non-members)
- ⬜ Printable scorecard output per twirler
- ⬜ Data export: CSV/JSON

### Scoring Templates
- ⬜ Standard Solo (score, placement, no_drop, notes)
- ⬜ Strut/Marching (subscores: knee height, toe point, posture, etc.)
- ⬜ Movement & Compulsories CAS (matrix: movements × levels × Low/Med/High)
- ⬜ Show/Dance Routine
- ⬜ Corps (5 caption scores)
- ⬜ Custom (director-defined)

---

## Phase 4 — Advanced Features

### Competition Templates
- ⬜ Save competition structure as template
- ⬜ Org default templates (USTA, NBTA, TU, DMA)
- ⬜ Share templates with other directors
- ⬜ Start new competition from template

### Director Reports
- ⬜ Total registrations (by event, age/division, day)
- ⬜ Revenue breakdown (by event, by day)
- ⬜ Scheduling conflicts and tight transitions
- ⬜ No-show tracking
- ⬜ Lifetime family value (post first event)
- ⬜ Qualifier results tracking → advancement eligibility

### Aggregate Awards
- ⬜ High Point awards (aggregate placements across events)
- ⬜ Pageant titles
- ⬜ Grand Champion tracking
- ⬜ Custom award types

### Judge Accounts
- ⬜ Judge signup and verification
- ⬜ Direct login to score entry interface
- ⬜ Real-time score aggregation
- ⬜ Score display for families as posted

---

## Phase 5 — Ecosystem & Growth

### Sponsorship Program
- ⬜ Local business sponsors offset director platform fees
- ⬜ Sponsor placement in app for all attendees at competition
- ⬜ Featured Competition placement in directory for larger events
- ⬜ Sponsorship outreach tools for directors
- ⬜ Revenue model TBD for larger regional/national events

### Marketing Platform
- ⬜ Directors push competitions to targeted families/coaches in area
- ⬜ Email campaigns for upcoming competitions
- ⬜ Push notifications for schedule published, results posted

### Hardware Tier (Premium)
- ⬜ Pre-configured judge tablets shipped to venue
- ⬜ Portable WiFi hotspot (eliminates school WiFi dependency)
- ⬜ TwirlPower branding visible at venue
- ⬜ Enterprise add-on pricing

### Music Integration (Future Premium)
- ⬜ Director uploads music files per set to TwirlPower
- ⬜ Music stored locally on competition control device (no buffering)
- ⬜ Auto-plays when set is opened in Run Competition page
- ⬜ Hardware considerations: dedicated tablet/device as music controller
- ⬜ Family app: on-deck notification synced to music start
- ⬜ Both ends need to be seamless: director presses play, music starts, families notified

### Directory & Scraping
- ⬜ Scraper for org websites (USTA, NBTA, TU, DMA) — Vercel cron, weekly
- ⬜ Admin review queue for scraped competitions
- ⬜ Auto-deduplication (name + date + location matching)
- ⬜ Competition ratings/reviews from families
- ⬜ Historical competition data (past years' results)
- ⬜ Director profiles (bio, past competitions, ratings)
- ⬜ WordPress widgets (upcoming competitions, stats bar)

### Platform
- ⬜ NBTA Collegiate / College Majorette org support
- ⬜ DMA full rulebook integration
- ⬜ Org-specific tiebreaker automation
- ⬜ Push notifications (schedule published, results posted)
- ⬜ Mobile app (React Native or Capacitor)
- ⬜ API for org websites to pull TwirlPower data
- ⬜ Partnerships with USTA, NBTA, TU, DMA for official data feeds
- ⬜ Live scoreboard (TV/tablet display at venue)
- ⬜ Tabulation data export (custom, on request)
- ⬜ Offline-first scoring (currently: aggressive autosave + retry)

---

## Pre-Launch Checklist

Complete before inviting real users beyond beta testers:

- ⬜ Remove director pages from main app (redirect host role → manage.twirlpower.com)
- ⬜ Upgrade to Supabase Pro ($25/mo) — daily backups, higher connection limits
- ⬜ Weekly manual database export as backup
- ⬜ Verify RLS policies on all tables
- ⬜ Test auth flows end-to-end (signup, login, password reset, co-guardian invite)
- ⬜ Verify email delivery (Resend logs)
- ⬜ Review Vercel usage limits
- ⬜ Set up Supabase usage alerts
- ⬜ "Allow Protected First Place" rename in director app settings
- ⬜ Results event dropdown → pull from planned events (not hardcoded list)

---

## Director Pricing Tiers

| Tier | Mode | Revenue Model |
|---|---|---|
| Free — Directory Listing | 1 | Free forever |
| Starter — Planning Tools | 2 | Monthly or annual subscription |
| Pro — Full Management | 3 | Subscription + per-entry fee ($1–2/entry) |
| Enterprise — Organization Plan | 3/4 | Negotiated contract, dedicated support |

---

## Open Questions (USTA Contact)

1. Event block vs lane-first planning — how do directors actually think?
2. USTA protection rule — does USTA use it?
3. NBTA protection rule — does NBTA use it?
4. USTA sanction compliance — specific output format requirements?
5. Division order within lane — is Open → State → Novice → Advanced the USTA standard?
6. High Point awards — auto-calculate or provide data only?
7. NBTA lane execution — confirmed asynchronous?
