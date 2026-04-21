// TwirlPower — Baton Twirling Competition & Progress Tracker
// Single-file React component. Drop into a Vite React project as src/App.jsx
// Required: src/main.jsx should render <App /> into #root
// No external dependencies beyond React itself.
// Auth: Supabase (real accounts, email verification, password reset)
// Data: localStorage (device-bound) — cloud sync coming in next update
//
// To run locally:
//   npm create vite@latest twirlpower -- --template react
//   cd twirlpower && npm install
//   Replace src/App.jsx with this file, replace src/main.jsx (see README)
//   npm run dev -- --host
//
// Admin PIN (for host approval): twirlpower2025
// Change before production use.

import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fascxnrrnsknjnojfxvv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhc2N4bnJybnNrbmpub2pmeHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjI3MjAsImV4cCI6MjA5MTkzODcyMH0.PeBZxHI8FwISfS0tMwXTcpHBnUFyoLCdtQNm59HrmQU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ORGS = {
 USTA: {
  id: "USTA",
  name: "United States Twirling Association",
  levels: ["Novice", "Beginner", "Intermediate", "Advanced"],
  eventCategories: [
   { category: "Solo Baton",       events: ["Solo", "2-Baton", "3-Baton"] },
   { category: "Strut & March",    events: ["Strut", "Basic March", "Military March", "Parade March", "Presentation"] },
   { category: "Artistic",         events: ["Artistic Twirl", "Artistic Twirl Pairs"] },
   { category: "Pair & Small Group", events: ["Duet", "Trio"] },
   { category: "Team Events",      events: ["Twirl Team", "Dance Twirl Team", "Show Team"] },
   { category: "Corps & Large Group", events: ["Parade Corps", "Entertainment Corps", "Artistic Group"] },
   { category: "Collegiate",       events: ["Collegiate"] },
   { category: "Skill & Achievement", events: ["Compulsories", "Movement Technique"] },
  ],
  get events() { return this.eventCategories.flatMap(c => c.events); },
  leveledEvents: ["Solo", "2-Baton", "3-Baton", "Strut", "Artistic Twirl", "Artistic Twirl Pairs", "Duet", "Collegiate"],
  thresholds: { Novice: 3, Beginner: 5, Intermediate: 10 },
  rules: {
   contestedOnly: true,
   uncontestedCounts: false,
   protectionRule: false,
   finalRoundOnly: false,
   crossOrgRules: {
    NBTA: {
     counts: true,
     exceptions: ["Strut"],
     note: "NBTA wins count toward USTA except Strut event"
    },
    DMA: {
     counts: true,
     exceptions: [],
     note: null,
     unknownFlags: [{ id: "Q11", text: "Do DMA wins count toward USTA advancement? USTA counts wins from other orgs in most events." }]
    }
   }
  }
 },
 NBTA: {
  id: "NBTA",
  name: "National Baton Twirling Association",
  levels: ["Novice", "Beginner", "Intermediate", "Advanced"],
  eventCategories: [
   { category: "Solo Baton",         events: ["Solo", "2-Baton", "3-Baton"] },
   { category: "Strut & March",      events: ["Super-X Strut", "Basic March", "Military March", "Parade March", "Presentation"] },
   { category: "Artistic & Rhythmic", events: ["Rhythmic Twirl", "Show Twirl"] },
   { category: "Pair & Small Group", events: ["Duet", "Trio"] },
   { category: "Team Events",        events: ["Twirl Team", "Dance Twirl Team"] },
   { category: "Half-Time Show",     events: ["Half-Time Show Twirl Team", "Half-Time Pom Pon", "Half-Time Danceline"] },
   { category: "Corps",              events: ["Parade Corps", "Flag Corps", "Show Corps", "Twirling Corps"] },
   { category: "Danceline & Pom",   events: ["Danceline"] },
   { category: "Appearance",         events: ["Modeling"] },
   { category: "Collegiate",         events: ["Collegiate Solo", "Collegiate Downfield"] },
  ],
  get events() { return this.eventCategories.flatMap(c => c.events); },
  leveledEvents: ["Solo", "2-Baton", "3-Baton", "Super-X Strut", "Show Twirl", "Duet"],
  thresholds: { Novice: 5, Beginner: 5, Intermediate: 8 },
  rules: {
   contestedOnly: false,
   uncontestedCounts: true,
   protectionRule: true,
   finalRoundOnly: true,
   crossOrgRules: {
    USTA: {
     counts: true,
     exceptions: [],
     note: null,
     unknownFlags: [
      { id: "Q1", text: "Does NBTA exclude USTA Strut wins the way USTA excludes NBTA Strut wins?" },
      { id: "Q2", text: "Does the 'final round only' rule apply at all competition tiers or only specific ones?" }
     ]
    },
    DMA: {
     counts: true,
     exceptions: [],
     note: null,
     unknownFlags: [{ id: "Q12", text: "Do DMA wins count toward NBTA advancement? NBTA counts wins from all orgs generally." }]
    }
   }
  }
 }
,
 TU: {
  id: "TU",
  name: "Twirling Unlimited",
  levels: ["Special Beginner", "Novice", "Beginner", "Intermediate", "Advanced"],

  winModel: "cumulative",

  cumulativeThresholds: {
   "Special Beginner": 0,
   "Novice": 2,
   "Beginner": 5,
   "Intermediate": 10,
   "Advanced": 18,
  },

  thresholds: { "Special Beginner": 2, Novice: 3, Beginner: 5, Intermediate: 8 },
  eventCategories: [
   { category: "Solo Baton",         events: ["Solo", "2-Baton", "3-Baton"] },
   { category: "Strut & March",      events: ["Fancy Strut", "Basic March", "Basic X Strut", "Box Strut", "T Strut"] },
   { category: "Artistic",           events: ["Show Routine", "Solo Dance Twirl"] },
   { category: "Pair & Small Group", events: ["Duet Twirl", "Duet Fancy Strut", "Duet Dance Twirl"] },
   { category: "Team Events",        events: ["Twirl Team", "Dance Twirl Team"] },
   { category: "Corps",              events: ["Parade Corps", "Mini Corps", "Floor Corps", "Production Group"] },
   { category: "Appearance",         events: ["Dress Model", "Costume Model"] },
   { category: "Collegiate",         events: ["Collegiate Solo", "Collegiate Dance Twirl"] },
  ],
  get events() { return this.eventCategories.flatMap(c => c.events); },
  leveledEvents: ["Solo", "2-Baton", "3-Baton", "Fancy Strut", "Basic March", "Show Routine", "Duet Twirl"],

  contentRestrictions: {
   "Special Beginner": { maxTurns: 1, maxElbows: 2, note: "No turns over 1, no more than 2 continuous elbows" },
   "Novice":           { maxTurns: 2, maxElbows: 4, note: "No more than a 2-turn, no more than 4 continuous elbows" },
   "Beginner":         { maxTurns: 3, maxElbows: 6, note: "No more than a 3-turn, no more than 6 continuous elbows" },
   "Intermediate":     { maxTurns: 4, maxElbows: 8, note: "No more than a 4-turn, no more than 8 continuous elbows" },
   "Advanced":         { maxTurns: null, maxElbows: null, note: "No restrictions" },
  },
  rules: {
   contestedOnly: false,
   uncontestedCounts: true,
   protectionRule: true,
   finalRoundOnly: false,
   twirlingOffWinsCounts: false,
   pageantWinsCount: false,
   crossOrgRules: {
    USTA: { counts: true, exceptions: [], note: "All cross-org wins count in TU" },
    NBTA: { counts: true, exceptions: [], note: "All cross-org wins count in TU" },
    DMA:  { counts: true, exceptions: [], note: "All cross-org wins count in TU" },
   }
  }
 },
 DMA: {
  id: "DMA",
  name: "Drum Majorettes of America",
  levels: ["Special Beginner", "Beginner", "Intermediate", "Advanced", "Elite"],

  winModel: "cumulative",

  cumulativeThresholds: {
   "Special Beginner": 0,
   "Beginner": 2,
   "Intermediate": 10,
   "Advanced": 28,
   "Elite": null,
  },

  thresholds: { "Special Beginner": 2, Beginner: 8, Intermediate: 18, Advanced: null },

  eventCategories: [
   { category: "Solo Baton",         events: ["Solo", "2-Baton", "3+ Baton"] },
   { category: "Strut & March",      events: ["Fancy Strut", "Basic March", "Military March"] },
   { category: "Artistic",           events: ["Show Presentation"] },
   { category: "Pair & Small Group", events: ["Duet", "Trio"] },
   { category: "Team Events",        events: ["Twirl Team", "Dance Twirl Team", "Strut Line", "Novelty Team"] },
   { category: "Danceline & Pom",    events: ["Dance Line", "Pom Line"] },
   { category: "Corps",              events: ["Halftime Corps"] },
   { category: "Appearance",         events: ["Best Appearing", "Business Attire/Interview"] },
   { category: "All-Star Title",     events: ["All-Star Title (Solo + 2-Baton + 3-Baton)"] },
  ],
  get events() { return this.eventCategories.flatMap(c => c.events); },
  leveledEvents: ["Solo", "2-Baton", "3+ Baton", "Fancy Strut", "Basic March", "Show Presentation"],
  rules: {
   contestedOnly: false,

   uncontestedCounts: true,

   protectionRule: false,
   finalRoundOnly: false,
   crossOrgRules: {
    USTA: { counts: true, exceptions: [], note: "All cross-org wins count toward DMA (trophy count)" },
    NBTA: { counts: true, exceptions: [], note: "All cross-org wins count toward DMA (trophy count)" },
    TU:   { counts: true, exceptions: [], note: "All cross-org wins count toward DMA (trophy count)" },
   }
  }
 }
};

const ORG_INFO = {
 USTA: {
  founded: "1956",
  website: "https://www.ustwirling.com",
  tagline: "The nation's leading sport baton twirling organization",
  color: "#2563eb",
  history: "Founded in 1956, USTA is the premier sport baton twirling organization in the U.S. and the official representative to the IBTF, selecting Team USA for World Championships. USTA sanctions ~200 competitions per year and developed the Competitive Achievement System (CAS).",
  classificationSummary: "Per-level, per-event tracking. Only contested wins count (no uncontested). No protection rule. Advancement is independent per event.",
  levels: [
   { name: "Novice", wins: "0–3 competitive wins", note: "Advances after 3rd win" },
   { name: "Beginner", wins: "Up to 5 competitive wins", note: "Advances after 5th win" },
   { name: "Intermediate", wins: "Up to 10 competitive wins", note: "Advances after 10th win" },
   { name: "Advanced", wins: "10+ competitive wins", note: "Highest level" },
  ],
  keyRules: [
   "Only competitive (contested) wins count toward advancement",
   "Wins are tracked per event — levels are independent across events",
   "Most NBTA wins count toward USTA (except Strut event)",
   "Athlete may enter up to one level above their current classification",
   "School and studio awards do not count toward classification",
  ],
  scoring: {
   summary: "Judges score on a 100-point scale. The point total determines placement within each division; placement (1st place) determines whether a win counts toward advancement.",
   categories: [
    { name: "Technical Execution", points: "up to 40 pts", desc: "Baton handling, releases, catches, rolls — technical proficiency and difficulty of skills" },
    { name: "Choreography & Routine", points: "up to 30 pts", desc: "Use of music, routine construction, transitions, use of floor space" },
    { name: "Showmanship & Presentation", points: "up to 20 pts", desc: "Stage presence, expression, costume appropriateness, overall performance quality" },
    { name: "Difficulty", points: "up to 10 pts", desc: "Degree of difficulty of baton skills included in the routine" },
   ],
   deductions: [
    "Drops: typically 1–2 point deduction per drop depending on event",
    "Boundary violations: deduction for stepping out of designated performance area",
    "Time violations: penalty for routines under or over the allowed time",
    "Illegal content: deduction for moves not permitted at the entered level",
   ],
   note: "Exact point breakdowns vary by event type (Solo vs. Corps vs. Strut). Always refer to the current USTA rulebook for official judging criteria.",
  },
 },
 NBTA: {
  founded: "Early 1950s",
  website: "https://www.nbtainternational.com",
  tagline: "America's Youth on Parade — winning is participating",
  color: "#7c3aed",
  history: "Founded in the early 1950s, NBTA hosts America's Youth on Parade (AYOP) at Notre Dame — one of twirling's most prestigious national events. Known for its honor system, Miss Majorette of America pageant, and prohibition on gymnastics in competition routines.",
  classificationSummary: "Per-level, per-event tracking. All wins count (including uncontested). Protection rule available. Only final-round wins count — prelim/semi-final wins do not.",
  levels: [
   { name: "Novice", wins: "Up to 5 wins at this level", note: "Advances after 5th Novice win" },
   { name: "Beginner", wins: "Up to 5 wins at this level", note: "Advances after 5th Beginner win" },
   { name: "Intermediate", wins: "Up to 8 wins at this level", note: "Advances after 8th Intermediate win" },
   { name: "Advanced", wins: "8+ Intermediate wins reached", note: "Highest level" },
  ],
  keyRules: [
   "All wins count including uncontested (one-person) divisions",
   "Protection rule: judge may award 1st place that does not count toward advancement",
   "Only final round wins count — prelim/semi-final wins do not",
   "Gymnastics moves are NOT permitted in NBTA competition",
   "Once at a higher level, you cannot go back down",
  ],
  scoring: {
   summary: "NBTA uses a point-based system with three judges scoring independently. Scores are averaged or totaled to determine placement. The point system determines who wins; wins accumulate toward level advancement.",
   categories: [
    { name: "Technique & Execution", points: "up to 40 pts", desc: "Baton control, catching, rolling, release mechanics — technical skill and accuracy" },
    { name: "Presentation & Showmanship", points: "up to 30 pts", desc: "Expression, confidence, costume, overall performance quality and entertainment value" },
    { name: "Choreography", points: "up to 20 pts", desc: "Routine construction, music interpretation, floor usage, and transitions" },
    { name: "Difficulty", points: "up to 10 pts", desc: "Complexity and risk level of baton skills performed" },
   ],
   deductions: [
    "Drops: typically 1 point per drop",
    "Illegal moves: gymnastics-based skills result in deductions or disqualification",
    "Time violations: penalty for routines outside the allowed window",
    "Boundary violations: stepping outside the performance area",
   ],
   note: "NBTA scoring criteria may vary by event type and competition level. The protection rule allows a judge to award 1st place that does not advance the athlete — used to recognize improvement without forcing advancement. Always refer to the current NBTA rulebook.",
  },
 },
 TU: {
  founded: "1981",
  website: "https://www.twirlingunlimited.com",
  tagline: "Unity in twirling — welcoming athletes from all organizations",
  color: "#0d9488",
  history: "Founded in 1981 by twirling teachers and judges, TU was created so athletes from all organizations could compete together on equal footing. TU charges no membership fees, publishes the monthly Twyrl Type newsletter, and hosts Regional and International championships.",
  classificationSummary: "Cumulative 5-level system — wins from ALL orgs count across all levels combined. Pageant and twirl-off wins excluded. Content restrictions per level (turn/elbow limits). 0–6 division is sheltered.",
  levels: [
   { name: "Special Beginner (L1)", wins: "0–2 total wins", note: "Advances after 2nd win" },
   { name: "Novice (L2)", wins: "2–5 total wins", note: "Advances after reaching 5 total" },
   { name: "Beginner (L3)", wins: "5–10 total wins", note: "Advances after reaching 10 total" },
   { name: "Intermediate (L4)", wins: "10–18 total wins", note: "Advances after reaching 18 total" },
   { name: "Advanced (L5)", wins: "18+ total wins", note: "Highest level" },
  ],
  keyRules: [
   "ALL first-place wins count regardless of organization or number of competitors",
   "Pageant wins do NOT count toward advancement",
   "Twirl-off wins do NOT count toward advancement",
   "Content restrictions apply per level (turns and elbow rolls capped)",
   "Double-entering is allowed; triple-entering is not",
   "No membership fees — open to all twirlers",
  ],
 },
 DMA: {
  founded: "1947",
  website: "https://www.dmatwirl.org",
  tagline: "The original — founded 1947, celebrating over 79 years of baton twirling",
  color: "#d97706",
  history: "Founded in 1947, DMA is one of the oldest and largest twirling organizations in the U.S. — the first to separate competition by skill level and the first to host a national event. Signature events include the Majorette Queen of America (summer) and America's Most Beautiful Majorette (winter Mini-Nationals). DMA also offers extensive scholarships.",
  classificationSummary: "Cumulative trophy count — wins from ANY org count across all levels. Per-event advancement. Elite requires top-3 at Nationals × 4 (not win-count based). ⚠️ Thresholds from third-party data — verify against DMA rulebook.",
  levels: [
   { name: "Special Beginner", wins: "0–2 total wins", note: "Advances after 2nd win" },
   { name: "Beginner", wins: "Up to ~10 total wins", note: "Advances after ~8 Beginner wins ⚠️ verify" },
   { name: "Intermediate", wins: "Up to ~28 total wins", note: "Advances after ~18 Intermediate wins ⚠️ verify" },
   { name: "Advanced", wins: "28+ total wins", note: "Standard top level" },
   { name: "Elite", wins: "Top 3 at Nationals × 4", note: "Special designation — not win-count based" },
  ],
  keyRules: [
   "Trophy count regardless of organization — all org wins count",
   "Classification is per event — levels are independent",
   "Your highest level in any event determines your title entry level",
   "Elite requires top-3 at Nationals or Mini-Nationals 4 times",
   "All-Star Title combines Solo + 2-Baton + 3-Baton scores equally",
   "⚠️ Full rulebook available at competitions or from DMA headquarters",
  ],
 },
};

const CAS_LEVELS = ["C", "B", "BI", "BII", "A", "AA", "AAA", "Elite"];
const CAS_EVENTS = new Set(["Compulsories", "Movement Technique"]);

// Sub-score categories for each CAS event
const CAS_SUBSCORES = {
  "Compulsories": [
    { key: "batonTechnique", label: "Baton Technique" },
    { key: "difficulty", label: "Difficulty" },
    { key: "execution", label: "Execution" },
    { key: "timing", label: "Timing & Rhythm" },
  ],
  "Movement Technique": [
    { key: "bodyTechnique", label: "Body Technique" },
    { key: "posture", label: "Posture & Carriage" },
    { key: "footwork", label: "Footwork" },
    { key: "expression", label: "Expression & Performance" },
  ],
};

const OPEN_QUESTIONS = [
 { id: "Q1", text: "NBTA strut cross-org: Does NBTA exclude USTA strut wins the way USTA excludes NBTA strut wins?" },
 { id: "Q2", text: "NBTA twirl-off 'final round only': Does this apply at all competition tiers or only specific ones (local, state, regional, national)?" },
 { id: "Q3", text: "Age division win equivalence: Do wins count the same regardless of how age groups were structured at a given competition?" },
 { id: "Q4", text: "USTA uncontested win at voluntarily entered higher level: Does this count toward anything?" },
 { id: "Q5", text: "TU sanctioned events: Does TU require sanctioning for wins to count, or do all TU-run event wins count?" },
 { id: "Q6", text: "TU cross-org sanctioning: Does a USTA/NBTA event need TU sanctioning for wins to count toward TU advancement?" },
 { id: "Q7", text: "Sanctioned vs. unsanctioned: Do USTA/NBTA require their sanctioning for wins to count toward advancement?" },
 { id: "Q8", text: "DMA Newcomer level: DMA's history references a Newcomer level but no win threshold or placement in the level sequence was found publicly. Where does it fall and how many wins to advance?" },
 { id: "Q9", text: "DMA uncontested wins: Does DMA count wins where the athlete is the only competitor in their division? Defaulting to YES (counts) until confirmed." },
 { id: "Q10", text: "DMA protection rule: Does DMA use a protection rule allowing judges to award 1st place without it counting toward advancement? Not found in public data — defaulting to NO." },
 { id: "Q11", text: "DMA wins toward USTA: Do DMA wins count toward USTA advancement? USTA counts most cross-org wins but has specific exceptions. Defaulting to YES (counts) until confirmed." },
 { id: "Q12", text: "DMA wins toward NBTA: Do DMA wins count toward NBTA advancement? NBTA counts wins from all orgs generally. Defaulting to YES (counts) until confirmed." },
 { id: "Q13", text: "DMA Elite designation: Elite requires top-3 at Nationals/Mini-Nationals 4 times — not a standard win threshold. Should this be tracked differently in TwirlPower? Currently flagged as non-trackable via win count." },
 { id: "Q14", text: "DMA cumulative thresholds: The 8-win Beginner and 18-win Intermediate thresholds are sourced from third-party data (Twirlmate), not directly from the DMA rulebook. Please verify against the official DMA rulebook." },
 { id: "Q15", text: "USTA August 2025 rule change: USTA is replacing win-count advancement with a judge recommendation model (3 recommendations = level advance). Does this apply to all events or only certain ones?" },
 { id: "Q16", text: "USTA recommendation expiry: Do judge recommendations expire after a certain time period, or do they accumulate indefinitely?" },
 { id: "Q17", text: "NBTA cross-org impact: Under the new USTA recommendation system, do USTA competition results still count toward NBTA win-based advancement? The old system counted USTA wins toward NBTA — this needs confirmation under the new model." },
];

function getNextLevel(orgId, currentLevel) {
 const levels = ORGS[orgId].levels;
 const idx = levels.indexOf(currentLevel);
 if (idx === -1 || idx === levels.length - 1) return null;
 return levels[idx + 1];
}

function getWinsNeeded(orgId, currentLevel) {
 return ORGS[orgId].thresholds[currentLevel] ?? null;
}

function getCumulativeThreshold(orgId, level) {
 return ORGS[orgId]?.cumulativeThresholds?.[level] ?? 0;
}

function getTUCumulativeThreshold(level) {
 return getCumulativeThreshold("TU", level);
}

function shouldWinCount(result, targetOrgId, twirlerOrgs) {
 const { orgId, event, placement, contested, protectionRule, isFinalRound,
     isTwirlOff, isPageant, sanctioned } = result;
 if (placement !== 1) return { counts: false, reason: "Not a first place" };

 const targetOrg = ORGS[targetOrgId];
 if (!targetOrg) return { counts: false, reason: "Unknown organization" };

 if (targetOrgId === "TU") {
  if (isPageant) return { counts: false, reason: "Pageant wins do not count toward TU advancement" };
  if (isTwirlOff) return { counts: false, reason: "Twirl-off wins do not count toward TU advancement" };
 }

 if (orgId === targetOrgId) {
  if (targetOrg.rules.contestedOnly && !contested) {
   return { counts: false, reason: "Uncontested win does not count toward " + targetOrgId };
  }
  if (targetOrg.rules.protectionRule && protectionRule) {
   return { counts: false, reason: "Protection rule applied" };
  }
  if (targetOrg.rules.finalRoundOnly && isFinalRound === false) {
   return { counts: false, reason: "Prelim/semi-final wins do not count toward " + targetOrgId };
  }
  return { counts: true, reason: null };
 }

 const crossOrgRule = targetOrg.rules.crossOrgRules?.[orgId];
 if (!crossOrgRule) {
  return { counts: true, reason: null, unknown: true, unknownNote: "Cross-org rule unknown — defaulting to count. Follow up needed." };
 }
 if (!crossOrgRule.counts) {
  return { counts: false, reason: crossOrgRule.note || "Does not count cross-org" };
 }
 if (crossOrgRule.exceptions?.includes(event)) {
  return { counts: false, reason: `${event} wins from ${orgId} do not count toward ${targetOrgId}` };
 }
 if (crossOrgRule.unknownFlags?.length > 0) {
  return { counts: true, reason: null, unknown: true, unknownNote: crossOrgRule.note || "Some cross-org rules unknown — verify" };
 }
 return { counts: true, reason: null };
}

function calculateProgress(twirlerProfile, allResults) {
 const progress = {};

 // Build set of events to track: regularEvents + any event with actual results
 const competedEvents = new Set(
   allResults.filter(r => r.twirlerId === twirlerProfile.id).map(r => r.event)
 );
 const regularEvents = new Set(twirlerProfile.regularEvents || []);
 const relevantForOrg = (orgId, leveledEvents) =>
   leveledEvents.filter(event =>
     regularEvents.has(event) ||
     competedEvents.has(event) ||
     // Also include if there's a manual classification set above default
     (twirlerProfile.classificationState?.[`${orgId}__${event}`]?.level &&
      twirlerProfile.classificationState[`${orgId}__${event}`].level !== ORGS[orgId]?.levels?.[0])
   );

 for (const orgId of twirlerProfile.organizations) {
  const org = ORGS[orgId];
  if (!org) continue;
  progress[orgId] = {};

  const eventsToTrack = relevantForOrg(orgId, org.leveledEvents);

  if (org.winModel === "cumulative") {
   for (const event of eventsToTrack) {
    const classKey = `${orgId}__${event}`;
    const stateEntry = twirlerProfile.classificationState?.[classKey] || {};
    const currentLevel = stateEntry.level || org.levels[0];
    const manualOverride = stateEntry.manualOverride || false;
    const priorWins = stateEntry.priorWins || 0;
    const nextLevel = getNextLevel(orgId, currentLevel);

    const allLevelResults = allResults.filter(r =>
     r.twirlerId === twirlerProfile.id &&
     r.event === event
    );

    let trackedWins = 0;
    const winDetails = [];
    for (const r of allLevelResults) {
     const verdict = shouldWinCount(r, orgId, twirlerProfile.organizations);
     if (verdict.counts) {
      trackedWins++;
      winDetails.push({ ...r, unknown: verdict.unknown, unknownNote: verdict.unknownNote });
     }
    }

    const totalCumulativeWins = priorWins + trackedWins;
    const currentThreshold = getCumulativeThreshold(orgId, currentLevel);
    const nextThreshold = nextLevel ? getCumulativeThreshold(orgId, nextLevel) : null;

    const isSpecialAdvancement = nextThreshold === null && nextLevel;
    const winsAtCurrentLevel = Math.max(0, totalCumulativeWins - currentThreshold);
    const winsNeededAtLevel = (nextThreshold !== null && nextThreshold !== undefined)
     ? nextThreshold - currentThreshold : null;
    const winsRemaining = winsNeededAtLevel
     ? Math.max(0, nextThreshold - totalCumulativeWins) : 0;

    progress[orgId][event] = {
     currentLevel,
     nextLevel,
     winsCount: winsAtCurrentLevel,
     totalCumulativeWins,
     priorWins,
     trackedWins,
     winsNeeded: winsNeededAtLevel,
     winsRemaining,
     shouldAdvance: winsNeededAtLevel && totalCumulativeWins >= nextThreshold,
     isSpecialAdvancement,
     manualOverride,
     winDetails,
     isCumulative: true,
    };
   }
   continue;
  }

  for (const event of eventsToTrack) {
   const classKey = `${orgId}__${event}`;
   const stateEntry = twirlerProfile.classificationState?.[classKey] || {};
   const currentLevel = stateEntry.level || org.levels[0];
   const manualOverride = stateEntry.manualOverride || false;
   const priorWins = stateEntry.priorWins || 0;
   const winsNeeded = getWinsNeeded(orgId, currentLevel);
   const nextLevel = getNextLevel(orgId, currentLevel);

   const relevantResults = allResults.filter(r =>
    r.twirlerId === twirlerProfile.id &&
    r.event === event &&
    r.classificationLevelEntered === currentLevel
   );

   let trackedWins = 0;
   const winDetails = [];
   for (const r of relevantResults) {
    const verdict = shouldWinCount(r, orgId, twirlerProfile.organizations);
    if (verdict.counts) {
     trackedWins++;
     winDetails.push({ ...r, unknown: verdict.unknown, unknownNote: verdict.unknownNote });
    }
   }

   const winsCount = priorWins + trackedWins;

   progress[orgId][event] = {
    currentLevel,
    nextLevel,
    winsCount,
    priorWins,
    trackedWins,
    winsNeeded,
    winsRemaining: winsNeeded ? Math.max(0, winsNeeded - winsCount) : 0,
    shouldAdvance: winsNeeded && winsCount >= winsNeeded && nextLevel,
    manualOverride,
    winDetails
   };
  }
 }
 return progress;
}

function useLocalStorage(key, initial) {
 const [val, setVal] = useState(() => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
  catch { return initial; }
 });
 useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
 return [val, setVal];
}

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function fmtDate(d) { if (!d) return "—"; const dt = new Date(d.includes("T") ? d : d + "T00:00:00"); return isNaN(dt) ? "—" : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function getAge(dob) { if (!dob) return null; const b = new Date(dob); const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n.setFullYear(1970) < b.setFullYear(1970)) a--; return a; }

function getAgeDivision(dob, orgId) {
 const age = getAge(dob);
 if (age === null) return null;

 if (orgId === "DMA") {
  if (age <= 10) return "Juvenile (0–10)";
  if (age <= 14) return "Junior (11–14)";
  if (age <= 23) return "Senior (15–23)";
  return "Adult (24+)";
 }

 if (orgId === "TU") {
  if (age <= 6) return "0–6 (Sheltered)";
  if (age <= 8) return "7–8";
  if (age <= 11) return "9–11";
  if (age <= 14) return "12–14";
  return "15+";
 }

 if (orgId === "NBTA") {
  if (age <= 6) return "0–6";
  if (age <= 9) return "7–9";
  if (age <= 12) return "10–12";
  if (age <= 15) return "13–15";
  return "16+";
 }

 if (orgId === "USTA") {
  if (age <= 6) return "0–6";
  if (age <= 9) return "7–9";
  if (age <= 12) return "10–12";
  if (age <= 15) return "13–15";
  if (age <= 18) return "16–18";
  return "19+";
 }

 if (age <= 9) return "0–9";
 if (age <= 12) return "10–12";
 if (age <= 15) return "13–15";
 return "16+";
}

function printClassificationRecord(twirler, progress, results, competitions) {
 const orgs = twirler.organizations || [];
 const age = getAge(twirler.dob);
 const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

 let rows = "";
 for (const orgId of orgs) {
  const org = ORGS[orgId];
  if (!org) continue;
  for (const event of org.leveledEvents) {
   const prog = progress?.[orgId]?.[event];
   if (!prog) continue;
   const ageDivision = getAgeDivision(twirler.dob, orgId);
   const winsText = prog.isCumulative
    ? `${prog.totalCumulativeWins} total (cumulative)`
    : `${prog.winsCount} at ${prog.currentLevel}`;
   rows += `<tr>
    <td>${orgId}</td>
    <td>${event}</td>
    <td><strong>${prog.currentLevel}</strong></td>
    <td>${ageDivision || "—"}</td>
    <td>${winsText}</td>
    <td>${prog.nextLevel ? `${prog.winsRemaining} wins to ${prog.nextLevel}` : "Advanced — no further advancement"}</td>
   </tr>`;
  }
 }

 const wins = results
  .filter(r => r.twirlerId === twirler.id && r.placement === 1)
  .slice(-10)
  .reverse();

 let winRows = "";
 for (const w of wins) {
  const comp = competitions.find(c => c.id === w.competitionId);
  winRows += `<tr>
   <td>${comp ? fmtDate(comp.date) : "—"}</td>
   <td>${comp?.name || "—"}</td>
   <td>${w.orgId || comp?.orgId || "—"}</td>
   <td>${w.event}</td>
   <td>${w.classificationLevelEntered}</td>
   <td>${comp?.sanctioned === false ? "Unsanctioned" : "Sanctioned"}</td>
  </tr>`;
 }

 const html = `<!DOCTYPE html><html><head><title>Classification Record — ${twirler.firstName}</title><style>body{font-family:Georgia,serif;color:#0f172a;max-width:900px;margin:0 auto;padding:32px}h1{font-size:24px;margin-bottom:4px}.sub{color:#64748b;font-size:13px;margin-bottom:24px}.section{margin-bottom:24px}h2{font-size:13px;font-weight:700;text-transform:uppercase;color:#334155;border-bottom:2px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f1f5f9;text-align:left;padding:6px 8px;font-size:10px;text-transform:uppercase;color:#64748b}td{padding:6px 8px;border-bottom:1px solid #f1f5f9}tr:last-child td{border-bottom:none}.footer{margin-top:28px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px}</style></head><body><h1>Classification Record — ${twirler.firstName}</h1><div class="sub">Generated ${today} · TwirlPower${twirler.dob ? ` · Age ${age}` : ""}${twirler.club ? ` · ${twirler.club}` : ""}</div><div class="section"><h2>Current Classification Levels</h2><table><thead><tr><th>Org</th><th>Event</th><th>Level</th><th>Age Division</th><th>Wins</th><th>Next Level</th></tr></thead><tbody>${rows || "<tr><td colspan=6>No data</td></tr>"}</tbody></table></div>${winRows ? `<div class="section"><h2>Recent First-Place Wins</h2><table><thead><tr><th>Date</th><th>Competition</th><th>Org</th><th>Event</th><th>Level</th><th>Sanctioned</th></tr></thead><tbody>${winRows}</tbody></table></div>` : ""}<div class="footer">Self-reported record maintained by the family using TwirlPower. Governed by each org's official rulebook. Print date: ${today}.</div></body></html>`;

 const win = window.open("", "_blank");
 if (win) {
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
 }
}
function initials(name) { return (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
function levelColor(level) {
 const map = { Novice: "#4ade80", Beginner: "#60a5fa", Intermediate: "#f59e0b", Advanced: "#f87171", "—": "#94a3b8" };
 return map[level] || "#94a3b8";
}
function orgColor(orgId) { return orgId === "USTA" ? "#2563eb" : orgId === "NBTA" ? "#7c3aed" : orgId === "TU" ? "#0d9488" : orgId === "DMA" ? "#d97706" : "#64748b"; }

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--navy:#0f172a;--navy2:#1e293b;--navy3:#334155;--slate:#64748b;--muted:#94a3b8;--border:#e2e8f0;--bg:#f8fafc;--card:#ffffff;--blue:#3b82f6;--blue2:#2563eb;--purple:#8b5cf6;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--brand:#0d9488;--brand2:#0f766e;--brand-light:#f0fdfa;--pink:#e11d6a;--pink2:#be1259;--pink-light:#fce7f0;--gold:#f59e0b;--gold-light:#fef3c7;--radius:12px;--radius-sm:8px}body.dark{--bg:#0f172a;--card:#1e293b;--border:#334155;--slate:#94a3b8;--muted:#64748b;--navy:#f1f5f9;--navy2:#e2e8f0;--navy3:#cbd5e1}body.dark .input,body.dark .select,body.dark .textarea{background:#0f172a;color:#f1f5f9}body.dark .table tr:hover td{background:#334155}body.dark .badge-gray{background:#334155;color:#cbd5e1}body.dark .modal{background:#1e293b}body.dark .modal-header,body.dark .modal-footer{border-color:#334155}body.dark .card-sm{background:#0f172a}body.dark .alert-info{background:#0c2340;border-color:#1e40af;color:#93c5fd}body.dark .alert-warn{background:#2d1a00;border-color:#92400e;color:#fcd34d}body.dark .alert-success{background:#052e16;border-color:#166534;color:#86efac}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--navy)}.serif{font-family:'DM Serif Display',serif}.app{display:flex;min-height:100vh}.sidebar{width:240px;min-width:240px;background:var(--navy);display:flex;flex-direction:column;padding:0;position:sticky;top:0;height:100vh;overflow-y:auto}.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,0.08)}.sidebar-logo h1{font-family:'DM Serif Display',serif;color:white;font-size:22px;line-height:1.1}.sidebar-logo h1 span{color:var(--brand)}.sidebar-logo p{color:var(--muted);font-size:10px;margin-top:5px;letter-spacing:1px;text-transform:uppercase}.sidebar-section{padding:12px 0}.sidebar-label{padding:6px 20px;font-size:10px;font-weight:600;letter-spacing:1.2px;color:var(--slate);text-transform:uppercase}.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;color:var(--muted);font-size:14px;font-weight:400;transition:all 0.15s;border-left:3px solid transparent}.nav-item:hover{color:white;background:rgba(255,255,255,0.05)}.nav-item.active{color:white;background:rgba(13,148,136,0.15);border-left-color:var(--brand)}.nav-icon{width:18px;height:18px;flex-shrink:0}.sidebar-twirler{padding:12px 16px;margin:8px;background:rgba(255,255,255,0.06);border-radius:var(--radius-sm);cursor:pointer}.sidebar-twirler:hover{background:rgba(255,255,255,0.1)}.sidebar-twirler.active{background:rgba(13,148,136,0.2);border:1px solid rgba(13,148,136,0.4)}.sidebar-twirler .name{color:white;font-size:13px;font-weight:500}.sidebar-twirler .sub{color:var(--muted);font-size:11px;margin-top:2px}.main{flex:1;overflow-y:auto;padding:32px;max-width:1000px}.page-header{margin-bottom:28px}.page-title{font-family:'DM Serif Display',serif;font-size:28px;color:var(--navy)}.page-sub{color:var(--slate);font-size:14px;margin-top:4px}.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px}.card-sm{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.grid-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}.stat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px}.stat-label{font-size:11px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:var(--slate);margin-bottom:6px}.stat-value{font-size:26px;font-weight:600;color:var(--navy);line-height:1}.stat-sub{font-size:12px;color:var(--slate);margin-top:4px}.badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.3px}.badge-blue{background:#dbeafe;color:#1d4ed8}.badge-purple{background:#ede9fe;color:#6d28d9}.badge-green{background:#dcfce7;color:#15803d}.badge-amber{background:#fef3c7;color:#b45309}.badge-red{background:#fee2e2;color:#b91c1c}.badge-gray{background:#f1f5f9;color:#475569}.badge-warn{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}.progress-bar{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden}.progress-fill{height:100%;border-radius:999px;transition:width 0.3s}.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all 0.15s;font-family:inherit}.btn-primary{background:var(--brand);color:white}.btn-primary:hover{background:var(--brand2)}.btn-secondary{background:var(--bg);color:var(--navy);border:1px solid var(--border)}.btn-secondary:hover{background:var(--border)}.btn-danger{background:#fee2e2;color:var(--red)}.btn-danger:hover{background:#fecaca}.btn-sm{padding:6px 12px;font-size:12px}.btn-ghost{background:transparent;color:var(--slate);border:1px solid var(--border)}.btn-ghost:hover{background:var(--bg)}.btn:disabled,.btn[disabled]{opacity:0.4;cursor:not-allowed;pointer-events:none}.input,.select,.textarea{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;color:var(--navy);background:white;outline:none;transition:border 0.15s}.input:focus,.select:focus,.textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(13,148,136,0.12)}.label{font-size:12px;font-weight:600;color:var(--slate);margin-bottom:5px;display:block;letter-spacing:0.3px}.form-group{margin-bottom:14px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.table{width:100%;border-collapse:collapse;font-size:14px}.table th{text-align:left;padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:var(--slate);border-bottom:1px solid var(--border)}.table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle}.table tr:last-child td{border-bottom:none}.table tr:hover td{background:#f8fafc}.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}.modal{background:white;border-radius:var(--radius);width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2)}.modal-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}.modal-title{font-family:'DM Serif Display',serif;font-size:20px}.modal-body{padding:20px 24px}.modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}.alert{padding:12px 16px;border-radius:var(--radius-sm);font-size:13px;margin-bottom:12px;display:flex;gap:10px;align-items:flex-start}.alert-warn{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412}.alert-info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}.alert-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0}.avatar-lg{width:52px;height:52px;font-size:18px}.chip-group{display:flex;gap:6px;flex-wrap:wrap}.chip{display:inline-flex;align-items:center;padding:4px 10px;border:1px solid var(--border);border-radius:20px;font-size:12px;font-weight:500;color:var(--slate);cursor:pointer;transition:all 0.15s}.chip.selected{background:var(--navy);color:white;border-color:var(--navy)}.chip:hover{border-color:var(--slate)}.divider{height:1px;background:var(--border);margin:16px 0}.text-muted{color:var(--slate)}.text-xs{font-size:12px}.text-sm{font-size:13px}.flex{display:flex}.flex-col{display:flex;flex-direction:column}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-6{margin-bottom:24px}.mt-auto{margin-top:auto}.w-full{width:100%}.overflow-hidden{overflow:hidden}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.warn-flag{color:var(--amber);font-size:14px;cursor:help}.empty-state{text-align:center;padding:48px 24px;color:var(--slate)}.empty-state h3{font-size:16px;font-weight:500;color:var(--navy3);margin-bottom:6px}.empty-state p{font-size:14px}.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.section-title{font-size:15px;font-weight:600;color:var(--navy)}.toggle{display:flex;align-items:center;gap:8px;cursor:pointer}.toggle-track{width:36px;height:20px;background:var(--border);border-radius:999px;position:relative;transition:background 0.2s}.toggle-track.on{background:var(--blue)}.toggle-thumb{width:16px;height:16px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}.toggle-track.on .toggle-thumb{left:18px}.level-timeline{display:flex;flex-direction:column;gap:0}.level-step{display:flex;gap:12px;padding-bottom:16px;position:relative}.level-step:not(:last-child)::before{content:'';position:absolute;left:11px;top:24px;width:2px;bottom:0;background:var(--border)}.level-dot{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid}.level-dot.done{background:var(--green);border-color:var(--green);color:white}.level-dot.current{background:var(--blue);border-color:var(--blue);color:white}.level-dot.future{background:white;border-color:var(--border);color:var(--muted)}.filter-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.filter-bar .select{width:auto;min-width:120px;flex:1 1 120px}.mobile-topbar{display:none}.sidebar-overlay{display:none}@media (max-width:768px){.sidebar{position:fixed;top:0;left:0;height:100vh;z-index:300;transform:translateX(-100%);transition:transform 0.25s ease;width:260px}.sidebar.open{transform:translateX(0)}.sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:299}.mobile-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--navy);position:sticky;top:0;z-index:200;border-bottom:2px solid var(--brand)}.mobile-topbar-title{font-family:'DM Serif Display',serif;color:white;font-size:18px}.mobile-menu-btn{background:transparent;border:none;cursor:pointer;padding:4px;color:white;display:flex;align-items:center}.main{padding:16px}.grid-2,.grid-3{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}}`;
// ─── ICONS ─────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    history: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
    progress: "M18 20V10 M12 20V4 M6 20v-6",
    plus: "M12 5v14 M5 12h14",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    settings: "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 8v4l3 3",
    trophy: "M6 2h12l1 6c0 4-3 7-7 7S5 12 5 8L6 2z M10 19v2 M14 19v2 M8 21h8",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18 M6 6l12 12",
    chevron_down: "M6 9l6 6 6-6",
    chevron_right: "M9 18l6-6-6-6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M19 6l-1 14H6L5 6 M9 6V4h6v2",
    export: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    question: "M8 9a4 4 0 118 0c0 2.5-2 3-2 5 M12 18h.01",
    link: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
    info: "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 8v4 M12 16h.01",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    image: "M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M21 15l-5-5L5 21",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {(paths[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};
// ─── BATON ICON ─────────────────────────────────────────────────────────────
// SVG illustration of a baton: shaft with ball tip and small tip, slightly angled

function BatonIcon({ size = 48, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}
      xmlns="http://www.w3.org/2000/svg" aria-label="Baton">
      <g transform="translate(24,24) rotate(-35)">
        {/* Shaft */}
        <line x1="-16" y1="0" x2="16" y2="0" stroke="white" strokeWidth="3.5" strokeLinecap="butt" opacity="0.9"/>
        {/* Left tip — flared trapezoid */}
        <polygon points="-16,-2.5 -16,2.5 -21.5,5 -21.5,-5" fill="#e11d6a" stroke="white" strokeWidth="1"/>
        {/* Right tip — flared trapezoid */}
        <polygon points="16,-2.5 16,2.5 21.5,5 21.5,-5" fill="#e11d6a" stroke="white" strokeWidth="1"/>
        {/* Grip wraps */}
        <line x1="-6" y1="-3" x2="-6" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <line x1="0" y1="-3" x2="0" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <line x1="6" y1="-3" x2="6" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      </g>
    </svg>
  );
}

// ─── BATON ICON DARK (for light backgrounds) ─────────────────────────────────

function BatonIconDark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="Baton">
      <g transform="translate(24,24) rotate(-35)">
        <line x1="-16" y1="0" x2="16" y2="0" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="butt" opacity="0.85"/>
        <polygon points="-16,-2.5 -16,2.5 -21.5,5 -21.5,-5" fill="#e11d6a" stroke="#0f172a" strokeWidth="1"/>
        <polygon points="16,-2.5 16,2.5 21.5,5 21.5,-5" fill="#e11d6a" stroke="#0f172a" strokeWidth="1"/>
        <line x1="-6" y1="-3" x2="-6" y2="3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="6" y1="-3" x2="6" y2="3" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </g>
    </svg>
  );
}

// ─── TOGGLE ─────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <div className={`toggle-track ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── CONFIRM MODAL ──────────────────────────────────────────────────────────

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>}>
      <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
}

// ─── PROGRESS RING ─────────────────────────────────────────────────────────

function ProgressRing({ pct, color = "#3b82f6", size = 56 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  // ── PWA install prompt ──
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  const isInstalled = typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const isIos = typeof navigator !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !/crios|fxios/i.test(navigator.userAgent); // iOS Safari only
  const isMobile = typeof navigator !== 'undefined' &&
    /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  const installDismissed = typeof localStorage !== 'undefined' &&
    localStorage.getItem('tp_install_dismissed') === 'true';

  // Whether to show anything install-related at all
  const canShowInstall = !isInstalled && isMobile && !installDismissed;

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    if (!canShowInstall) return;
    // Android/Chrome: capture native prompt
    const handler = e => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    // iOS: show banner on load (no native prompt available)
    if (isIos) setShowInstallBanner(true);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function triggerInstall() {
    if (isIos) {
      setShowIosInstructions(true);
      setShowInstallBanner(false);
      return;
    }
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(({ outcome }) => {
      setInstallPrompt(null);
      setShowInstallBanner(false);
      if (outcome === 'accepted') {
        localStorage.setItem('tp_install_dismissed', 'true');
      }
    });
  }

  function dismissInstall() {
    setShowInstallBanner(false);
    localStorage.setItem('tp_install_dismissed', 'true');
  }

  function markIosDone() {
    setShowIosInstructions(false);
    localStorage.setItem('tp_install_dismissed', 'true');
  }

  // ── Supabase auth state ──
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingInviteToken, setPendingInviteToken] = useState(() => {
    // Read invite token from URL on first load
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    if (token) {
      // Store in sessionStorage and clean URL
      sessionStorage.setItem('tp_invite_token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }
    return token || sessionStorage.getItem('tp_invite_token') || null;
  });
  const [inviteEmail, setInviteEmail] = useState(sessionStorage.getItem('tp_invite_email') || '');

  // Look up invite email from token (unauthenticated, uses public RLS policy)
  useEffect(() => {
    if (pendingInviteToken && !inviteEmail) {
      supabase.from('family_invites').select('guardian_email').eq('token', pendingInviteToken).single()
        .then(({ data }) => {
          if (data?.guardian_email) {
            setInviteEmail(data.guardian_email);
            sessionStorage.setItem('tp_invite_email', data.guardian_email);
          }
        });
    }
  }, [pendingInviteToken]);
  const [userRole, setUserRole] = useState(null); // 'family' | 'coach' | 'host' | null
  const [coachAccount, setCoachAccount] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setDataLoading(false); // No user — stop loading immediately
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowPasswordReset(true);
        setAuthUser(session?.user ?? null);
        setAuthLoading(false);
        return;
      }
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setAuthUser(session?.user ?? null);
        if (session?.user) checkAdmin(session.user.id);
        else { setIsAdmin(false); setDataLoading(false); }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId) {
    const { data } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .single();
    setIsAdmin(!!data);
  }

  const [familyAccount, setFamilyAccount] = useState(null);
  const [twirlers, setTwirlers] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [results, setResults] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachCompetitions, setCoachCompetitions] = useState([]);
  const [coachClubs, setCoachClubs] = useState([]);
  const [pendingClubMembers, setPendingClubMembers] = useState([]);
  const [coachClubClaims, setCoachClubClaims] = useState([]);
  const [invites, setInvites] = useState([]);
  const [coachLinks, setCoachLinks] = useState([]);
  const [competitionHosts, setCompetitionHosts] = useState([]);
  const [pendingClubClaims, setPendingClubClaims] = useState(0);
  const [publicCompetitions, setPublicCompetitions] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // ── Offline cache helpers ──
  const CACHE_KEY = 'tp_offline_cache';
  function saveOfflineCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, savedAt: Date.now() })); } catch(e) {}
  }
  function loadOfflineCache() {
    try { const s = localStorage.getItem(CACHE_KEY); return s ? JSON.parse(s) : null; } catch(e) { return null; }
  }

  // Listen for online/offline events
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  // ── Load all user data from Supabase when auth user ID changes ──
  const loadedForUserRef = useRef(null);

  useEffect(() => {
    if (!authUser) {
      loadedForUserRef.current = null;
      setFamilyAccount(null); setCoachAccount(null); setUserRole(null);
      setTwirlers([]); setCompetitions([]);
      setResults([]); setCoaches([]); setCoachCompetitions([]);
      setInvites([]); setCompetitionHosts([]); setPublicCompetitions([]);
      setAttendees([]);
      return;
    }
    // Only reload if this is a different user than what's already loaded
    if (loadedForUserRef.current === authUser.id) return;
    loadedForUserRef.current = authUser.id;
    loadAllData(authUser.id);
  }, [authUser]);

  async function loadAllData(userId) {
    setDataLoading(true);

    // If offline, try loading from cache
    if (!navigator.onLine) {
      const cached = loadOfflineCache();
      if (cached) {
        setIsOffline(true);
        if (cached.familyAccount) setFamilyAccount(cached.familyAccount);
        if (cached.twirlers) setTwirlers(cached.twirlers);
        if (cached.competitions) setCompetitions(cached.competitions);
        if (cached.results) setResults(cached.results);
        if (cached.coaches) setCoaches(cached.coaches);
        if (cached.userRole) setUserRole(cached.userRole);
        setDataLoading(false);
        return;
      }
    }

    try {
      // Load user role — seed from auth metadata if missing
      let { data: roleData } = await supabase
        .from('user_roles').select('role').eq('user_id', userId).single();

      if (!roleData) {
        // Role row missing — read from auth user metadata and create it
        const { data: { user } } = await supabase.auth.getUser();
        const metaRole = user?.user_metadata?.role || 'family';
        await supabase.from('user_roles').upsert({ user_id: userId, role: metaRole });
        roleData = { role: metaRole };
      }

      const role = roleData?.role || 'family';
      setUserRole(role);

      // ── Process pending invite token ──
      const inviteToken = pendingInviteToken || sessionStorage.getItem('tp_invite_token');
      if (inviteToken && role === 'family') {
        const { data: inviteRows } = await supabase
          .from('family_invites')
          .select('*, family_accounts(*)')
          .eq('token', inviteToken)
          .is('accepted_at', null)
          .gt('expires_at', new Date().toISOString())
          .limit(1);

        const invite = inviteRows?.[0] || null;

        // ── Coach invite: store pending coach_id, let family flow continue normally ──
        if (invite && invite.invite_type === 'coach' && invite.coach_id) {
          console.log('[DEBUG loadAllData] Coach invite found, storing coach_id:', invite.coach_id);
          sessionStorage.setItem('tp_pending_coach_id', invite.coach_id);
          await supabase.from('family_invites')
            .update({ accepted_at: new Date().toISOString(), accepted_by_user_id: userId })
            .eq('token', inviteToken);
          sessionStorage.removeItem('tp_invite_token');
          sessionStorage.removeItem('tp_invite_email');
          setPendingInviteToken(null);
          // Fall through to normal family flow
        }

        // ── Guardian invite: redirect to linked family ──
        else if (invite && invite.family_accounts) {
          const linkedFamily = invite.family_accounts;
          const userAuthData = await supabase.auth.getUser();
          const userEmail = userAuthData.data?.user?.email;

          const existingGuardians = linkedFamily.additional_guardians || [];
          const alreadyLinked = existingGuardians.some(g =>
            g.email?.toLowerCase() === userEmail?.toLowerCase()
          );

          if (!alreadyLinked) {
            const newGuardian = {
              id: uid(),
              name: invite.guardian_name || userEmail,
              email: userEmail,
              phone: invite.guardian_phone || '',
              relationship: invite.relationship || 'Parent',
              confirmed: true,
            };
            await supabase.from('family_accounts')
              .update({ additional_guardians: [...existingGuardians, newGuardian] })
              .eq('id', linkedFamily.id);
          } else {
            const updatedGuardians = existingGuardians.map(g =>
              g.email?.toLowerCase() === userEmail?.toLowerCase()
                ? { ...g, confirmed: true } : g
            );
            await supabase.from('family_accounts')
              .update({ additional_guardians: updatedGuardians })
              .eq('id', linkedFamily.id);
          }

          await supabase.from('family_invites')
            .update({ accepted_at: new Date().toISOString(), accepted_by_user_id: userId })
            .eq('token', inviteToken);
          sessionStorage.removeItem('tp_invite_token');
          sessionStorage.removeItem('tp_invite_email');
          setPendingInviteToken(null);

          const rel = invite.relationship || 'Parent';
          const isCoGuardian = ['Parent', 'Guardian', 'Co-Guardian'].includes(rel);
          setGuardianMode(isCoGuardian ? 'co-guardian' : 'viewer');
          setFamilyAccount({ ...linkedFamily, parentName: linkedFamily.parent_name,
            additionalGuardians: linkedFamily.additional_guardians || [] });

          const { data: tw } = await supabase.rpc('get_guardian_twirlers', { family_uuid: linkedFamily.id });
          const mappedTwirlers = (tw || []).map(t => ({
            ...t, firstName: t.first_name,
            classificationState: t.classification_state || {},
            classificationHistory: t.classification_history || [],
            regularEvents: t.regular_events || [],
            organizations: t.organizations || [],
          }));
          setTwirlers(mappedTwirlers);

          if (mappedTwirlers.length > 0) {
            const twirlerIds = mappedTwirlers.map(t => t.id);
            const [{ data: comps }, { data: res }] = await Promise.all([
              supabase.rpc('get_guardian_competitions', { twirler_ids: twirlerIds }),
              supabase.rpc('get_guardian_results', { twirler_ids: twirlerIds }),
            ]);
            setCompetitions((comps || []).map(c => ({ ...c, orgId: c.org_id, fromPublic: c.from_public })));
            setResults((res || []).map(r => ({
              ...r, orgId: r.org_id, twirlerId: r.twirler_id, competitionId: r.competition_id,
              classificationLevelEntered: r.classification_level_entered,
              protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
              isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
              score: r.score, allCatch: r.all_catch, casLevel: r.cas_level,
              casPassed: r.cas_passed, judgeNote: r.judge_note,
              scorecardUrl: r.scorecard_url, subScores: r.sub_scores || {},
            })));
          }
          setDataLoading(false);
          return;
        } else if (!invite) {
          sessionStorage.removeItem('tp_invite_token');
          sessionStorage.removeItem('tp_invite_email');
          setPendingInviteToken(null);
        }
      }

      // If coach — load coach data and return
      if (role === 'coach') {
        const { data: ca } = await supabase
          .from('coach_accounts').select('*').eq('user_id', userId).single();
        if (ca) {
          setCoachAccount({ ...ca, organizations: ca.organizations || [] });
          await loadCoachData(ca.id);
        }
        setDataLoading(false);
        return;
      }

      // Load family account
      const { data: fa } = await supabase
        .from('family_accounts').select('*').eq('user_id', userId).single();

      // Even if user has their own family account, check if they're a guardian on another
      // family account. If their own account has no twirlers, prefer the linked family.
      if (fa) {
        const { data: authUserData } = await supabase.auth.getUser();
        const userEmail = authUserData?.user?.email;
        if (userEmail) {
          // Use SECURITY DEFINER function to bypass RLS and find linked family
          const { data: guardianRows } = await supabase
            .rpc('get_guardian_family', { guardian_email: userEmail.toLowerCase() });

          const linkedFamily = (guardianRows || []).find(f => f.id !== fa.id) || null;
          if (linkedFamily) {
            // Check if own account is empty (no twirlers)
            const { data: ownTwirlers } = await supabase.from('twirlers').select('id').eq('family_id', fa.id);
            if (!ownTwirlers || ownTwirlers.length === 0) {
              // Own account is empty — use the linked family instead
              const guardian = (linkedFamily.additional_guardians || [])
                .find(g => g.email?.toLowerCase() === userEmail.toLowerCase());
              const rel = guardian?.relationship || "Other";
              const isCoGuardian = ["Parent", "Guardian", "Co-Guardian"].includes(rel);
              setGuardianMode(isCoGuardian ? 'co-guardian' : 'viewer');

              // Mark confirmed
              if (guardian && !guardian.confirmed) {
                const updatedGuardians = (linkedFamily.additional_guardians || []).map(g =>
                  g.email?.toLowerCase() === userEmail.toLowerCase() ? { ...g, confirmed: true } : g
                );
                await supabase.from('family_accounts')
                  .update({ additional_guardians: updatedGuardians })
                  .eq('id', linkedFamily.id);
                linkedFamily.additional_guardians = updatedGuardians;
              }

              setFamilyAccount({ ...linkedFamily, parentName: linkedFamily.parent_name,
                additionalGuardians: linkedFamily.additional_guardians || [] });

              // Load linked family's data via SECURITY DEFINER function (bypasses RLS)
              const { data: tw } = await supabase.rpc('get_guardian_twirlers', { family_uuid: linkedFamily.id });
              const mappedTwirlers = (tw || []).map(t => ({
                ...t, firstName: t.first_name,
                classificationState: t.classification_state || {},
                classificationHistory: t.classification_history || [],
                regularEvents: t.regular_events || [],
                organizations: t.organizations || [],
              }));
              setTwirlers(mappedTwirlers);

              if (mappedTwirlers.length > 0) {
                const twirlerIds = mappedTwirlers.map(t => t.id);
                const [{ data: comps }, { data: res }, { data: coa }, { data: inv }, { data: cl }] = await Promise.all([
                  supabase.rpc('get_guardian_competitions', { twirler_ids: twirlerIds }),
                  supabase.rpc('get_guardian_results', { twirler_ids: twirlerIds }),
                  supabase.rpc('get_guardian_coaches', { family_uuid: linkedFamily.id }),
                  supabase.rpc('get_guardian_invites', { twirler_ids: twirlerIds }),
                  supabase.rpc('get_guardian_coach_links', { twirler_ids: twirlerIds }),
                ]);
                setCompetitions((comps || []).map(c => ({ ...c, orgId: c.org_id, fromPublic: c.from_public })));
                setResults((res || []).map(r => ({
                  ...r, orgId: r.org_id, twirlerId: r.twirler_id, competitionId: r.competition_id,
                  classificationLevelEntered: r.classification_level_entered,
                  protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
                  isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
                  score: r.score, allCatch: r.all_catch, casLevel: r.cas_level,
                  casPassed: r.cas_passed, judgeNote: r.judge_note,
                  scorecardUrl: r.scorecard_url, subScores: r.sub_scores || {},
                })));
                setCoaches((coa || []).map(c => ({ ...c, linkedTwirlers: c.linked_twirlers || [], organizations: c.organizations || [] })));
                setInvites((inv || []).map(i => ({ ...i, twirlerId: i.twirler_id, coachId: i.coach_id,
                  competitionId: i.competition_id, respondedAt: i.responded_at, createdAt: i.created_at })));
                setCoachLinks((cl || []).map(l => ({ ...l, twirlerId: l.twirler_id, coachId: l.coach_id,
                  familyId: l.family_id, coachName: l.coach_name, coachEmail: l.coach_email,
                  coachStudio: l.coach_studio, coachOrgs: l.coach_organizations || [],
                  createdAt: l.created_at, type: 'coach_link' })));
              }
              setDataLoading(false);
              return;
            }
          }
        }
      }

      if (fa) {
        setFamilyAccount({ ...fa, parentName: fa.parent_name, additionalGuardians: fa.additional_guardians || [] });

        // Load twirlers
        const { data: tw } = await supabase
          .from('twirlers').select('*').eq('family_id', fa.id);
        const mappedTwirlers = (tw || []).map(t => ({
          ...t, firstName: t.first_name,
          classificationState: t.classification_state || {},
          classificationHistory: t.classification_history || [],
          regularEvents: t.regular_events || [],
          organizations: t.organizations || [],
        }));
        setTwirlers(mappedTwirlers);

        if (mappedTwirlers.length > 0) {
          const twirlerIds = mappedTwirlers.map(t => t.id);

          // Load competitions
          const { data: comps } = await supabase
            .from('competitions').select('*').in('twirler_id', twirlerIds).order('date', { ascending: false });
          setCompetitions((comps || []).map(c => ({
            ...c, orgId: c.org_id, fromPublic: c.from_public
          })));

          // Load results
          const { data: res } = await supabase
            .from('results').select('*').in('twirler_id', twirlerIds);
          setResults((res || []).map(r => ({
            ...r, orgId: r.org_id, twirlerId: r.twirler_id,
            competitionId: r.competition_id,
            classificationLevelEntered: r.classification_level_entered,
            protectionRule: r.protection_rule,
            isFinalRound: r.is_final_round,
            isPageant: r.is_pageant,
            isTwirlOff: r.is_twirl_off,
            score: r.score,
            allCatch: r.all_catch,
            casLevel: r.cas_level,
            casPassed: r.cas_passed,
            judgeNote: r.judge_note,
            scorecardUrl: r.scorecard_url,
            subScores: r.sub_scores || {},
          })));

          // Save to offline cache after core data loaded
          const mappedComps = (comps || []).map(c => ({ ...c, orgId: c.org_id, fromPublic: c.from_public }));
          const mappedRes = (res || []).map(r => ({
            ...r, orgId: r.org_id, twirlerId: r.twirler_id, competitionId: r.competition_id,
            classificationLevelEntered: r.classification_level_entered,
            protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
            isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
            score: r.score, allCatch: r.all_catch, casLevel: r.cas_level,
            casPassed: r.cas_passed, judgeNote: r.judge_note,
            scorecardUrl: r.scorecard_url, subScores: r.sub_scores || {},
          }));
          saveOfflineCache({
            familyAccount: { ...fa, parentName: fa.parent_name, additionalGuardians: fa.additional_guardians || [] },
            twirlers: mappedTwirlers,
            competitions: mappedComps,
            results: mappedRes,
            userRole: 'family',
          });

          // Load coaches
          const { data: coa } = await supabase
            .from('coaches').select('*').eq('family_id', fa.id);
          setCoaches((coa || []).map(c => ({
            ...c, linkedTwirlers: c.linked_twirlers || [], organizations: c.organizations || []
          })));

          // Load invites
          const { data: inv } = await supabase
            .from('invites').select('*').in('twirler_id', twirlerIds);
          setInvites((inv || []).map(i => ({
            ...i, twirlerId: i.twirler_id, coachId: i.coach_id,
            competitionId: i.competition_id, respondedAt: i.responded_at,
            createdAt: i.created_at,
          })));

          // Load coach twirler link requests
          const { data: coachLinks } = await supabase
            .from('coach_athlete_links')
            .select('*, coach_accounts(name, email, studio, organizations)')
            .in('twirler_id', twirlerIds);
          setCoachLinks((coachLinks || []).map(l => ({
            ...l,
            twirlerId: l.twirler_id,
            coachId: l.coach_id,
            familyId: l.family_id,
            coachName: l.coach_accounts?.name,
            coachEmail: l.coach_accounts?.email,
            coachStudio: l.coach_accounts?.studio,
            coachOrgs: l.coach_accounts?.organizations || [],
            createdAt: l.created_at,
            type: 'coach_link',
          })));
        }

        // Load attendees for this family's twirlers
        const { data: att } = await supabase
          .from('attendees').select('*').eq('twirler_id', mappedTwirlers[0]?.id || '');
        setAttendees((att || []).map(a => ({
          ...a, twirlerId: a.twirler_id, competitionId: a.competition_id,
          addedAt: a.added_at,
        })));
      }

      // Load public competitions (visible to all)
      const { data: pubComps } = await supabase
        .from('public_competitions').select('*').eq('approved', true).order('date', { ascending: true });
      setPublicCompetitions((pubComps || []).map(c => ({
        ...c, orgId: c.org_id, hostId: c.host_id,
      })));

      // Load competition hosts
      const { data: hosts } = await supabase
        .from('competition_hosts').select('*').eq('user_id', userId);
      setCompetitionHosts((hosts || []).map(h => ({
        ...h, createdAt: h.created_at,
      })));

      // Load pending club claims count for admin badge (only if admin)
      if (isAdmin) {
        const { count } = await supabase
          .from('clubs').select('id', { count: 'exact', head: true })
          .eq('status', 'pending_claim');
        setPendingClubClaims(count || 0);
      }

      // If no own family account, check if this user is a guardian on another account
      if (!fa) {
        const { data: authUserData } = await supabase.auth.getUser();
        const userEmail = authUserData?.user?.email;
        if (userEmail) {
          // Use SECURITY DEFINER function to bypass RLS
          const { data: guardianRows } = await supabase
            .rpc('get_guardian_family', { guardian_email: userEmail.toLowerCase() });

          const linkedFamily = (guardianRows || [])[0] || null;
          if (linkedFamily) {
            const guardian = (linkedFamily.additional_guardians || [])
              .find(g => g.email?.toLowerCase() === userEmail.toLowerCase());
            const rel = guardian?.relationship || "Parent"; // default to Parent if not found
            const isCoGuardian = ["Parent", "Guardian", "Co-Guardian"].includes(rel);
            setGuardianMode(isCoGuardian ? 'co-guardian' : 'viewer');

            // Mark this guardian as confirmed in the family account
            if (guardian && !guardian.confirmed) {
              const updatedGuardians = (linkedFamily.additional_guardians || []).map(g =>
                g.email?.toLowerCase() === userEmail.toLowerCase() ? { ...g, confirmed: true } : g
              );
              await supabase.from('family_accounts')
                .update({ additional_guardians: updatedGuardians })
                .eq('id', linkedFamily.id);
              linkedFamily.additional_guardians = updatedGuardians;
            }

            setFamilyAccount({ ...linkedFamily, parentName: linkedFamily.parent_name,
              additionalGuardians: linkedFamily.additional_guardians || [] });

            // Load all the family data via SECURITY DEFINER function (bypasses RLS)
            const { data: tw } = await supabase.rpc('get_guardian_twirlers', { family_uuid: linkedFamily.id });
            const mappedTwirlers = (tw || []).map(t => ({
              ...t, firstName: t.first_name,
              classificationState: t.classification_state || {},
              classificationHistory: t.classification_history || [],
              regularEvents: t.regular_events || [],
              organizations: t.organizations || [],
            }));
            setTwirlers(mappedTwirlers);

            if (mappedTwirlers.length > 0) {
              const twirlerIds = mappedTwirlers.map(t => t.id);
              const [{ data: comps }, { data: res }, { data: coa }, { data: inv }, { data: cl }] = await Promise.all([
                supabase.rpc('get_guardian_competitions', { twirler_ids: twirlerIds }),
                supabase.rpc('get_guardian_results', { twirler_ids: twirlerIds }),
                supabase.rpc('get_guardian_coaches', { family_uuid: linkedFamily.id }),
                supabase.rpc('get_guardian_invites', { twirler_ids: twirlerIds }),
                supabase.rpc('get_guardian_coach_links', { twirler_ids: twirlerIds }),
              ]);
              setCompetitions((comps || []).map(c => ({ ...c, orgId: c.org_id })));
              setResults((res || []).map(r => ({ ...r, orgId: r.org_id, twirlerId: r.twirler_id,
                competitionId: r.competition_id, classificationLevelEntered: r.classification_level_entered,
                protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
                isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
                score: r.score, allCatch: r.all_catch, casLevel: r.cas_level,
                casPassed: r.cas_passed, judgeNote: r.judge_note,
                scorecardUrl: r.scorecard_url, subScores: r.sub_scores || {},
              })));
              setCoaches((coa || []).map(c => ({ ...c, linkedTwirlers: c.linked_twirlers || [], organizations: c.organizations || [] })));
              setInvites((inv || []).map(i => ({ ...i, twirlerId: i.twirler_id, coachId: i.coach_id,
                competitionId: i.competition_id, respondedAt: i.responded_at, createdAt: i.created_at })));
              setCoachLinks((cl || []).map(l => ({ ...l, twirlerId: l.twirler_id, coachId: l.coach_id,
                familyId: l.family_id, coachName: l.coach_name, coachEmail: l.coach_email,
                coachStudio: l.coach_studio, coachOrgs: l.coach_organizations || [],
                createdAt: l.created_at, type: 'coach_link' })));
            }
            setDataLoading(false);
            return;
          }
        }
      }

    } catch (err) {
      console.error('Error loading data:', err);
    }
    setDataLoading(false);
  }

  const [guardianMode, setGuardianMode] = useState(null); // null | 'co-guardian' | 'viewer'
  const [activeTwirlerId, setActiveTwirlerId] = useLocalStorage("tp_active_twirler", null);
  const [page, setPage] = useLocalStorage("tp_page", "home");
  const [modals, setModals] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useLocalStorage('tp_dark_mode', false);
  const [previewRole, setPreviewRole] = useState(null); // null = own role, 'family'|'coach'|'host'

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Always ensure a valid selection — if stored id is stale or null, pick first twirler
  const resolvedActiveTwirlerId = twirlers.find(t => t.id === activeTwirlerId)
    ? activeTwirlerId
    : twirlers[0]?.id || null;

  useEffect(() => {
    if (resolvedActiveTwirlerId && resolvedActiveTwirlerId !== activeTwirlerId) {
      setActiveTwirlerId(resolvedActiveTwirlerId);
    }
  }, [resolvedActiveTwirlerId]);

  const WRITE_MODALS = ['addCompetition', 'addResults', 'override', 'historicalData', 'addTwirler', 'editTwirler'];
  const openModal = (name, data = {}) => {
    if (guardianMode === 'viewer' && WRITE_MODALS.includes(name)) return;
    if (isOffline && WRITE_MODALS.includes(name)) {
      alert("You're offline. Please reconnect to make changes.");
      return;
    }
    setModals(m => ({ ...m, [name]: { open: true, ...data } }));
  };
  const closeModal = (name) => setModals(m => ({ ...m, [name]: { ...m[name], open: false } }));

  const [hostMode, setHostMode] = useState(null); // null | host object — set when logging in as host

  async function loadCoachData(coachId) {
    // Load twirlers linked to this coach
    const { data: links } = await supabase
      .from('coach_athlete_links')
      .select('*, twirlers(*), family_accounts(parent_name, email, state)')
      .eq('coach_id', coachId)
      .eq('status', 'accepted');

    if (links && links.length > 0) {
      // Build twirlers list from links
      const linkedTwirlers = links.map(l => ({
        ...l.twirlers,
        firstName: l.twirlers.first_name,
        classificationState: l.twirlers.classification_state || {},
        classificationHistory: l.twirlers.classification_history || [],
        organizations: l.twirlers.organizations || [],
        familyName: l.family_accounts?.parent_name,
        familyEmail: l.family_accounts?.email,
        linkId: l.id,
        linkStatus: l.status,
      }));
      setTwirlers(linkedTwirlers);

      // Load competitions created by this coach
      const { data: coachComps } = await supabase
        .from('coach_competitions')
        .select('*, coach_competition_invites(*)')
        .eq('coach_id', coachId)
        .order('date', { ascending: false });
      setCoachCompetitions((coachComps || []).map(c => ({
        ...c, orgId: c.org_id,
        invites: (c.coach_competition_invites || []).map(i => ({
          ...i, twirlerId: i.twirler_id, status: i.status,
        }))
      })));

      // Load family-side competitions and results for linked twirlers
      const twirlerIds = linkedTwirlers.map(t => t.id);
      const { data: famComps } = await supabase
        .from('competitions').select('*').in('twirler_id', twirlerIds).order('date', { ascending: false });
      setCompetitions((famComps || []).map(c => ({
        ...c, orgId: c.org_id, fromPublic: c.from_public
      })));

      const { data: famResults } = await supabase
        .from('results').select('*').in('twirler_id', twirlerIds);
      setResults((famResults || []).map(r => ({
        ...r, orgId: r.org_id, twirlerId: r.twirler_id,
        competitionId: r.competition_id,
        classificationLevelEntered: r.classification_level_entered,
        protectionRule: r.protection_rule,
        isFinalRound: r.is_final_round,
        isPageant: r.is_pageant,
        isTwirlOff: r.is_twirl_off,
        score: r.score,
        allCatch: r.all_catch,
        casLevel: r.cas_level,
        casPassed: r.cas_passed,
        judgeNote: r.judge_note,
        scorecardUrl: r.scorecard_url,
        subScores: r.sub_scores,
      })));
    }

    // Load pending link requests (twirlers invited to this coach)
    const { data: pendingLinks } = await supabase
      .from('coach_athlete_links')
      .select('*, twirlers(first_name), family_accounts(parent_name, email)')
      .eq('coach_id', coachId)
      .eq('status', 'pending');
    setInvites((pendingLinks || []).map(l => ({
      ...l,
      twirlerId: l.twirler_id,
      twirlerName: l.twirlers?.first_name,
      familyName: l.family_accounts?.parent_name,
      familyEmail: l.family_accounts?.email,
      type: 'athlete_link',
    })));

    // Load clubs this coach belongs to
    const { data: clubMemberships } = await supabase
      .from('club_coaches')
      .select('*')
      .eq('coach_id', coachId)
      .eq('status', 'active');
    if (clubMemberships && clubMemberships.length > 0) {
      const clubIds = clubMemberships.map(m => m.club_id);
      const { data: clubData } = await supabase
        .from('clubs').select('*').in('id', clubIds);
      setCoachClubs((clubMemberships || []).map(m => {
        const club = (clubData || []).find(c => c.id === m.club_id) || {};
        return { ...club, coachRole: m.role, membershipId: m.id };
      }));
    } else {
      setCoachClubs([]);
    }

    // Load pending club claim requests for this coach
    const { data: claimReqs } = await supabase
      .from('club_claim_requests')
      .select('*, clubs(name)')
      .eq('coach_id', coachId)
      .eq('status', 'pending');
    setCoachClubClaims(claimReqs || []);

    // Load pending club member requests for clubs this coach owns
    const ownedClubIds = (coachClubs || [])
      .filter(c => c.coachRole === 'owner')
      .map(c => c.id);
    if (ownedClubIds.length > 0) {
      const { data: pendingMembers } = await supabase
        .from('club_members')
        .select('*, twirlers(first_name, organizations), clubs(name)')
        .in('club_id', ownedClubIds)
        .eq('status', 'pending');
      setPendingClubMembers(pendingMembers || []);
    } else {
      setPendingClubMembers([]);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setFamilyAccount(null);
    setActiveTwirlerId(null);
    setHostMode(null);
    setPage("home");
    setSidebarOpen(false);
    setAuthUser(null);
    try { localStorage.removeItem("tp_active_twirler"); } catch(e) {}
  }

  const activeTwirler = twirlers.find(t => t.id === resolvedActiveTwirlerId);
  const twirlerResults = results.filter(r => r.twirlerId === resolvedActiveTwirlerId);
  // Include ALL competitions for this twirler — with OR without results
  const twirlerComps = competitions.filter(c =>
    c.twirler_id === resolvedActiveTwirlerId ||
    c.twirlerId === resolvedActiveTwirlerId ||
    twirlerResults.some(r => r.competitionId === c.id) ||
    invites.some(i => i.twirlerId === resolvedActiveTwirlerId && i.competitionId === c.id && i.status === "accepted")
  );
  const progress = activeTwirler ? calculateProgress(activeTwirler, results) : {};
  const pendingInvites = invites.filter(i =>
    twirlers.some(t => t.id === i.twirlerId) && i.status === "pending"
  );

  const pendingCoachLinks = coachLinks.filter(l => l.status === 'pending');

  // All pending notifications combined
  const allNotifications = [
    ...pendingInvites.map(i => ({ ...i, notifType: 'competition_invite' })),
    ...pendingCoachLinks.map(l => ({ ...l, notifType: 'coach_link' })),
  ];

  // Pass resolved id as the canonical activeTwirlerId throughout the app
  const effectiveActiveTwirlerId = resolvedActiveTwirlerId;

  // Advanceable events check — send email when athlete first hits advancement threshold
  useEffect(() => {
    if (!activeTwirler || !familyAccount) return;
    const sentKey = `tp_advance_alerts_${activeTwirler.id}`;
    const alreadySent = JSON.parse(localStorage.getItem(sentKey) || '{}');
    const newlySent = { ...alreadySent };
    let anyNew = false;

    for (const orgId of activeTwirler.organizations || []) {
      const org = ORGS[orgId];
      if (!org) continue;
      for (const event of org.leveledEvents) {
        const prog = progress?.[orgId]?.[event];
        const alertKey = `${orgId}__${event}__${prog?.currentLevel}`;
        if (prog?.shouldAdvance && !prog?.manualOverride && !alreadySent[alertKey]) {
          newlySent[alertKey] = true;
          anyNew = true;
          // Send email to family
          sendEmail('advancement_alert', familyAccount.email, {
            athleteName: activeTwirler.firstName,
            orgId,
            orgName: org.name,
            event,
            currentLevel: prog.currentLevel,
            nextLevel: prog.nextLevel,
            winsCount: prog.winsCount,
            winsNeeded: prog.winsNeeded,
          });
          // Also notify linked coaches
          (coachLinks || []).filter(l => l.twirlerId === activeTwirler.id && l.status === 'accepted').forEach(l => {
            if (l.coachEmail) {
              sendEmail('advancement_alert_coach', l.coachEmail, {
                athleteName: activeTwirler.firstName,
                familyName: familyAccount.parentName,
                orgId,
                orgName: org.name,
                event,
                currentLevel: prog.currentLevel,
                nextLevel: prog.nextLevel,
              });
            }
          });
        }
      }
    }
    if (anyNew) localStorage.setItem(sentKey, JSON.stringify(newlySent));
  }, [progress, activeTwirler?.id]);

  // ── TWIRLER MUTATIONS ──
  async function addTwirler(data) {
    const fa = familyAccount;
    if (!fa) return;
    const { data: inserted, error } = await supabase.from('twirlers').insert({
      family_id: fa.id,
      first_name: data.firstName,
      dob: data.dob || null,
      club: data.club || null,
      organizations: data.organizations || [],
      regular_events: data.regularEvents || [],
      classification_state: {},
      classification_history: [],
    }).select().single();
    if (error) { console.error('addTwirler:', error); return; }
    const t = { ...inserted, firstName: inserted.first_name, classificationState: {}, classificationHistory: [], regularEvents: inserted.regular_events || [], organizations: inserted.organizations || [] };
    setTwirlers(prev => [...prev, t]);
    setActiveTwirlerId(t.id);

    // If there's a pending coach invite, auto-create the coach link
    const pendingCoachId = sessionStorage.getItem('tp_pending_coach_id');
    console.log('[DEBUG addTwirler] tp_pending_coach_id:', pendingCoachId);
    if (pendingCoachId) {
      await supabase.from('coach_athlete_links').insert({
        coach_id: pendingCoachId,
        twirler_id: inserted.id,
        family_id: fa.id,
        status: 'accepted',
        invited_by: 'coach',
      });
      sessionStorage.removeItem('tp_pending_coach_id');
    }

    return t;
  }

  async function updateTwirler(id, data) {
    const dbData = {};
    if (data.firstName !== undefined) dbData.first_name = data.firstName;
    if (data.dob !== undefined) dbData.dob = data.dob;
    if (data.club !== undefined) dbData.club = data.club;
    if (data.organizations !== undefined) dbData.organizations = data.organizations;
    if (data.regularEvents !== undefined) dbData.regular_events = data.regularEvents;
    if (data.classificationState !== undefined) dbData.classification_state = data.classificationState;
    if (data.classificationHistory !== undefined) dbData.classification_history = data.classificationHistory;
    setTwirlers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t)); // optimistic
    await supabase.from('twirlers').update(dbData).eq('id', id);
  }

  async function deleteTwirler(id) {
    setTwirlers(prev => prev.filter(t => t.id !== id));
    setResults(prev => prev.filter(r => r.twirlerId !== id));
    if (resolvedActiveTwirlerId === id) setActiveTwirlerId(twirlers.find(t => t.id !== id)?.id || null);
    await supabase.from('twirlers').delete().eq('id', id);
  }

  async function overrideClassification(twirlerId, orgId, event, newLevel, reason) {
    const twirler = twirlers.find(t => t.id === twirlerId);
    if (!twirler) return;
    const classKey = `${orgId}__${event}`;
    const history = [...(twirler.classificationHistory || []), {
      date: new Date().toISOString().slice(0, 10), orgId, event,
      from: twirler.classificationState?.[classKey]?.level || ORGS[orgId].levels[0],
      to: newLevel, method: "manual", reason
    }];
    const newState = { ...twirler.classificationState, [classKey]: { level: newLevel, manualOverride: true } };
    await updateTwirler(twirlerId, { classificationState: newState, classificationHistory: history });
  }

  async function applyHistoricalData(twirlerId, historyEntries) {
    const twirler = twirlers.find(t => t.id === twirlerId);
    if (!twirler) return;
    const newState = { ...(twirler.classificationState || {}) };
    const newHistory = [...(twirler.classificationHistory || [])];
    const today = new Date().toISOString().slice(0, 10);
    for (const entry of historyEntries) {
      const classKey = `${entry.orgId}__${entry.event}`;
      const prevLevel = newState[classKey]?.level || ORGS[entry.orgId]?.levels[0];
      newState[classKey] = { level: entry.level, priorWins: entry.priorWins || 0, manualOverride: false, historicalEntry: true };
      if (entry.level !== prevLevel) {
        newHistory.push({ date: today, orgId: entry.orgId, event: entry.event, from: prevLevel, to: entry.level, method: "historical", reason: `Starting classification set at onboarding (${entry.priorWins || 0} prior wins recorded)` });
      }
    }
    await updateTwirler(twirlerId, { classificationState: newState, classificationHistory: newHistory });
  }

  // ── COMPETITION MUTATIONS ──
  async function addCompetition(data) {
    const twirler = twirlers.find(t => t.id === resolvedActiveTwirlerId);
    if (!twirler || !familyAccount) return;
    const { data: inserted, error } = await supabase.from('competitions').insert({
      family_id: familyAccount.id,
      twirler_id: twirler.id,
      name: data.name,
      date: data.date || null,
      location: data.location || null,
      venue: data.venue || null,
      state: data.state || null,
      start_time: data.startTime || null,
      org_id: data.orgId || null,
      sanctioned: data.sanctioned !== false,
      notes: data.notes || null,
    }).select().single();
    if (error) { console.error('addCompetition:', error); return; }
    const c = { ...inserted, orgId: inserted.org_id };
    setCompetitions(prev => [...prev, c]);
    return c.id;
  }

  async function addResults(compId, newResults) {
    if (!newResults.length) return;
    const rows = newResults.map(r => ({
      competition_id: compId,
      twirler_id: resolvedActiveTwirlerId,
      event: r.event,
      classification_level_entered: r.classificationLevelEntered,
      placement: parseInt(r.placement),
      contested: r.contested !== false,
      protection_rule: !!r.protectionRule,
      is_final_round: r.isFinalRound ?? null,
      is_pageant: !!r.isPageant,
      is_twirl_off: !!r.isTwirlOff,
      org_id: r.orgId || null,
      notes: r.notes || null,
      score: r.score ? parseFloat(r.score) : null,
      all_catch: !!r.allCatch,
      cas_level: r.casLevel || null,
      cas_passed: r.casPassed ?? null,
      judge_note: r.judgeNote || null,
      scorecard_url: r.scorecardUrl || null,
      sub_scores: r.subScores && Object.keys(r.subScores).length ? r.subScores : null,
    }));
    const { data: inserted, error } = await supabase.from('results').insert(rows).select();
    if (error) { console.error('addResults:', error); return; }
    const mapped = (inserted || []).map(r => ({
      ...r, orgId: r.org_id, twirlerId: r.twirler_id, competitionId: r.competition_id,
      classificationLevelEntered: r.classification_level_entered,
      protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
      isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
      score: r.score, allCatch: r.all_catch,
      casLevel: r.cas_level, casPassed: r.cas_passed, judgeNote: r.judge_note,
      scorecardUrl: r.scorecard_url, subScores: r.sub_scores || {},
    }));
    setResults(prev => {
      const updated = [...prev, ...mapped];
      // Boost install banner after first result logged
      if (prev.length === 0 && mapped.length > 0 && canShowInstall) setShowInstallBanner(true);
      return updated;
    });
  }

  async function addResultsToComp(compId, newResults) {
    // Upload any scorecard files first, replace file object with URL
    const withUrls = await Promise.all(newResults.map(async r => {
      if (!r.scorecardFile) return r;
      const ext = r.scorecardFile.name.split('.').pop();
      const path = `scorecards/${resolvedActiveTwirlerId}/${compId}_${r.event.replace(/\s+/g,'_')}_${Date.now()}.${ext}`;
      const { data: up } = await supabase.storage.from('documents').upload(path, r.scorecardFile, { upsert: true });
      if (!up) return r;
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path);
      return { ...r, scorecardUrl: publicUrl, scorecardFile: null };
    }));
    await addResults(compId, withUrls);
  }

  async function deleteResult(id) {
    setResults(prev => prev.filter(r => r.id !== id));
    await supabase.from('results').delete().eq('id', id);
  }

  async function updateResult(id, updates) {
    setResults(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    const dbUpdates = {};
    if (updates.placement !== undefined) dbUpdates.placement = updates.placement;
    if (updates.classificationLevelEntered !== undefined) dbUpdates.classification_level_entered = updates.classificationLevelEntered;
    if (updates.contested !== undefined) dbUpdates.contested = updates.contested;
    if (updates.protectionRule !== undefined) dbUpdates.protection_rule = updates.protectionRule;
    if (updates.isFinalRound !== undefined) dbUpdates.is_final_round = updates.isFinalRound;
    if (updates.isPageant !== undefined) dbUpdates.is_pageant = updates.isPageant;
    if (updates.isTwirlOff !== undefined) dbUpdates.is_twirl_off = updates.isTwirlOff;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.score !== undefined) dbUpdates.score = updates.score ? parseFloat(updates.score) : null;
    if (updates.allCatch !== undefined) dbUpdates.all_catch = updates.allCatch;
    if (updates.casLevel !== undefined) dbUpdates.cas_level = updates.casLevel || null;
    if (updates.casPassed !== undefined) dbUpdates.cas_passed = updates.casPassed ?? null;
    if (updates.judgeNote !== undefined) dbUpdates.judge_note = updates.judgeNote || null;
    if (updates.scorecardUrl !== undefined) dbUpdates.scorecard_url = updates.scorecardUrl || null;
    if (updates.subScores !== undefined) dbUpdates.sub_scores = updates.subScores || null;
    await supabase.from('results').update(dbUpdates).eq('id', id);
  }

  async function updateCompetition(id, updates) {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.venue !== undefined) dbUpdates.venue = updates.venue;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
    if (updates.orgId !== undefined) dbUpdates.org_id = updates.orgId;
    if (updates.sanctioned !== undefined) dbUpdates.sanctioned = updates.sanctioned;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    await supabase.from('competitions').update(dbUpdates).eq('id', id);
  }

  async function deleteCompetition(id) {
    // Delete all results for this competition first, then the competition itself
    await supabase.from('results').delete().eq('competition_id', id);
    await supabase.from('competitions').delete().eq('id', id);
    setResults(prev => prev.filter(r => r.competitionId !== id));
    setCompetitions(prev => prev.filter(c => c.id !== id));
  }

  // ── COACH MUTATIONS ──
  async function addCoach(data) {
    if (!familyAccount) return;
    const { data: inserted, error } = await supabase.from('coaches').insert({
      family_id: familyAccount.id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      specialization: data.specialization || null,
      organizations: data.organizations || [],
      linked_twirlers: [],
    }).select().single();
    if (error) { console.error('addCoach:', error); return; }
    setCoaches(prev => [...prev, { ...inserted, linkedTwirlers: [], organizations: inserted.organizations || [] }]);
  }

  async function linkCoach(coachId, twirlerId) {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return;
    const updated = [...new Set([...(coach.linkedTwirlers || []), twirlerId])];
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, linkedTwirlers: updated } : c));
    await supabase.from('coaches').update({ linked_twirlers: updated }).eq('id', coachId);
  }

  async function unlinkCoach(coachId, twirlerId) {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return;
    const updated = (coach.linkedTwirlers || []).filter(id => id !== twirlerId);
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, linkedTwirlers: updated } : c));
    await supabase.from('coaches').update({ linked_twirlers: updated }).eq('id', coachId);
  }

  // ── HOST MUTATIONS ──
  async function registerHost(data) {
    // Upload document if provided
    let docUrl = null;
    if (data.file) {
      const ext = data.file.name.split(".").pop();
      const path = `${authUser?.id}/host_registration_${Date.now()}.${ext}`;
      const { data: upload } = await supabase.storage.from("documents").upload(path, data.file, { upsert: true });
      if (upload) {
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
        docUrl = publicUrl;
      }
    }
    const { data: inserted, error } = await supabase.from('competition_hosts').insert({
      user_id: authUser?.id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      organization: data.organization || null,
      state: data.state || null,
      notes: data.notes || null,
      document_url: docUrl,
      approved: false,
    }).select().single();
    if (error) { console.error('registerHost:', error); return; }
    const h = { ...inserted, createdAt: inserted.created_at, document_url: inserted.document_url };
    setCompetitionHosts(prev => [...prev, h]);
    return h;
  }

  async function approveHost(hostId) {
    setCompetitionHosts(prev => prev.map(h => h.id === hostId ? { ...h, approved: true } : h));
    await supabase.from('competition_hosts').update({ approved: true }).eq('id', hostId);
  }

  async function createPublicCompetition(hostId, data) {
    const { data: inserted, error } = await supabase.from('public_competitions').insert({
      host_id: hostId,
      name: data.name,
      date: data.date || null,
      org_id: data.orgId || null,
      state: data.state || null,
      address: data.address || null,
      info: data.info || null,
      sanctioned: data.sanctioned !== false,
      approved: true,
    }).select().single();
    if (error) { console.error('createPublicCompetition:', error); return; }
    const c = { ...inserted, orgId: inserted.org_id, hostId: inserted.host_id };
    setPublicCompetitions(prev => [...prev, c]);
    return c;
  }

  async function deletePublicCompetition(compId) {
    setPublicCompetitions(prev => prev.filter(c => c.id !== compId));
    setAttendees(prev => prev.filter(a => a.competitionId !== compId));
    await supabase.from('public_competitions').delete().eq('id', compId);
  }

  async function addAttendee(competitionId, twirlerId) {
    if (attendees.find(a => a.competitionId === competitionId && a.twirlerId === twirlerId)) return;
    const newAttendee = { id: uid(), competitionId, twirlerId, addedAt: new Date().toISOString().slice(0,10) };
    setAttendees(prev => [...prev, newAttendee]);
    // Also add to twirler's competition history
    const pub = publicCompetitions.find(c => c.id === competitionId);
    if (pub && !competitions.find(c => c.id === competitionId)) {
      const compToAdd = { ...pub, fromPublic: true };
      setCompetitions(prev => [...prev, compToAdd]);
    }
    await supabase.from('attendees').insert({
      competition_id: competitionId,
      twirler_id: twirlerId,
    });
  }

  async function removeAttendee(competitionId, twirlerId) {
    setAttendees(prev => prev.filter(a => !(a.competitionId === competitionId && a.twirlerId === twirlerId)));
    await supabase.from('attendees').delete()
      .eq('competition_id', competitionId).eq('twirler_id', twirlerId);
  }

  // ── COACH COMPETITION INVITES (still local for now) ──
  async function coachCreateCompetition(coachId, compData, invitedTwirlerIds) {
    // Insert competition to Supabase
    const { data: newComp, error: compError } = await supabase
      .from('coach_competitions')
      .insert({
        coach_id: coachId,
        name: compData.name,
        date: compData.date || null,
        location: compData.location || null,
        venue: compData.venue || null,
        state: compData.state || null,
        start_time: compData.startTime || null,
        org_id: compData.orgId || null,
        notes: compData.notes || null,
      })
      .select().single();
    if (compError) { console.error('coach comp insert:', compError); return; }

    // Insert invites and notify families by email
    if (invitedTwirlerIds.length > 0) {
      const inviteRows = invitedTwirlerIds.map(twirlerId => ({
        competition_id: newComp.id,
        twirler_id: twirlerId,
        coach_id: coachId,
        status: 'pending',
      }));
      await supabase.from('coach_competition_invites').insert(inviteRows);

      // Look up family emails for each invited twirler and send notifications
      for (const twirlerId of invitedTwirlerIds) {
        const { data: twirlerData } = await supabase
          .from('twirlers')
          .select('first_name, family_accounts(email, parent_name)')
          .eq('id', twirlerId)
          .single();
        if (twirlerData?.family_accounts?.email) {
          await sendEmail('competition_invite', twirlerData.family_accounts.email, {
            coachName: coachAccount?.name || 'Your coach',
            athleteName: twirlerData.first_name,
            compName: compData.name,
            compDate: compData.date ? new Date(compData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
            compLocation: compData.location || null,
            compOrg: compData.orgId || null,
          });
        }
      }
    }

    // Reload coach data to reflect new competition
    await loadCoachData(coachId);
  }

  async function respondToInvite(inviteId, accept) {
    const status = accept ? 'accepted' : 'declined';
    setInvites(prev => prev.map(i => i.id === inviteId ? { ...i, status } : i));
    await supabase.from('coach_competition_invites').update({ status }).eq('id', inviteId);

    if (accept) {
      // Find the coach competition and add to family competitions
      const invite = invites.find(i => i.id === inviteId);
      if (invite) {
        const { data: coachComp } = await supabase
          .from('coach_competitions')
          .select('*')
          .eq('id', invite.competitionId)
          .single();
        if (coachComp && activeTwirler) {
          // Add to family competitions table
          const { data: inserted } = await supabase
            .from('competitions')
            .insert({
              twirler_id: invite.twirlerId,
              name: coachComp.name,
              date: coachComp.date,
              location: coachComp.location,
              org_id: coachComp.org_id,
              notes: coachComp.notes,
              from_coach: true,
            })
            .select().single();
          if (inserted) {
            setCompetitions(prev => [...prev, { ...inserted, orgId: inserted.org_id }]);
          }
        }
      }
    }
  }

  async function respondToCoachLink(linkId, accept) {
    const status = accept ? 'accepted' : 'declined';
    const link = coachLinks.find(l => l.id === linkId);
    setCoachLinks(prev => prev.map(l => l.id === linkId ? { ...l, status } : l));
    await supabase.from('coach_athlete_links').update({ status }).eq('id', linkId);

    // Notify the coach by email
    if (link?.coachEmail) {
      const twirler = twirlers.find(t => t.id === link.twirlerId);
      await sendEmail('coach_link_accepted', link.coachEmail, {
        familyName: familyAccount?.parentName || 'A family',
        athleteName: twirler?.firstName || 'the athlete',
        accepted: accept,
      });
    }
  }

  // ── Data loading overlay ──
  if (dataLoading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "var(--navy)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <BatonIcon size={36} />
            </div>
            <div style={{ color: "var(--slate)", fontSize: 14 }}>Loading your data...</div>
          </div>
        </div>
      </>
    );
  }

  // ── Auth loading spinner ──
  if (authLoading) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1a0a10 60%, #2d0a1a 100%)" }}>
          <div style={{ textAlign: "center" }}>
            <BatonIcon size={48} />
            <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 16 }}>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  // ── Password recovery → show reset form ──
  if (showPasswordReset) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1a0a10 60%, #2d0a1a 100%)", padding: 20 }}>
          <div className="card" style={{ maxWidth: 400, width: "100%", padding: "40px 32px" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, background: "var(--navy)", borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BatonIcon size={36} />
                </div>
              </div>
              <h2 className="serif" style={{ fontSize: 22, color: "var(--navy)", marginBottom: 6 }}>Set new password</h2>
              <p style={{ fontSize: 13, color: "var(--slate)" }}>Choose a new password for your account.</p>
            </div>
            <PasswordResetForm
              supabase={supabase}
              onDone={() => { setShowPasswordReset(false); }}
            />
          </div>
        </div>
      </>
    );
  }

  // ── Not authenticated → show Auth screen ──
  if (!authUser) {
    return (
      <AuthScreen
        onAuth={user => setAuthUser(user)}
        authError={authError}
        setAuthError={setAuthError}
        hasInvite={!!pendingInviteToken}
        inviteEmail={inviteEmail}
      />
    );
  }

  // ── Coach account → show coach UI ──
  if (userRole === 'coach') {
    if (!coachAccount) {
      return (
        <CoachSetupScreen
          authUser={authUser}
          onComplete={async data => {
            const { data: inserted, error } = await supabase.from('coach_accounts').insert({
              user_id: authUser.id,
              name: data.name,
              email: authUser.email,
              phone: data.phone || null,
              club: data.club || null,
              specialization: data.specialization || null,
              organizations: data.organizations || [],
              bio: data.bio || null,
              state: data.state || null,
            }).select().single();
            if (error) { console.error('coach setup:', error); return; }
            setCoachAccount({ ...inserted, organizations: inserted.organizations || [] });
          }}
        />
      );
    }
    return (
      <CoachApp
        authUser={authUser}
        coachAccount={coachAccount}
        setCoachAccount={setCoachAccount}
        twirlers={twirlers}
        setTwirlers={setTwirlers}
        competitions={competitions}
        results={results}
        coachCompetitions={coachCompetitions}
        coachClubs={coachClubs}
        setCoachClubs={setCoachClubs}
        coachClubClaims={coachClubClaims}
        setCoachClubClaims={setCoachClubClaims}
        pendingClubMembers={pendingClubMembers}
        setPendingClubMembers={setPendingClubMembers}
        invites={invites}
        progress={progress}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdmin={isAdmin}
        onSignOut={signOut}
        supabase={supabase}
        loadCoachData={loadCoachData}
        page={page}
        setPage={setPage}
        openModal={openModal}
        closeModal={closeModal}
        modals={modals}
        coachCreateCompetition={coachCreateCompetition}
        publicCompetitions={publicCompetitions}
      />
    );
  }

  // ── Authenticated but no family profile yet → show SetupScreen ──
  // Skip for co-guardians/viewers who are linked to another family account
  if (!familyAccount && !guardianMode) {
    return (
      <SetupScreen
        onComplete={async data => {
          // Ensure user_roles row exists first
          await supabase.from('user_roles').upsert({ user_id: authUser.id, role: 'family' });
          setUserRole('family');

          // Check if they already have a family account (co-guardian who signed up before being linked)
          const { data: existing } = await supabase.from('family_accounts')
            .select('*').eq('user_id', authUser.id).single();

          if (existing) {
            setFamilyAccount({ ...existing, parentName: existing.parent_name, additionalGuardians: existing.additional_guardians || [] });
            // Force a fresh data load by resetting the ref
            loadedForUserRef.current = null;
            loadAllData(authUser.id);
            return;
          }

          const { data: inserted, error } = await supabase.from('family_accounts').insert({
            user_id: authUser.id,
            parent_name: data.parentName,
            email: data.email || authUser.email,
            phone: data.phone || null,
            state: data.state || null,
            relationship: data.relationship || 'Parent / Guardian',
            additional_guardians: [],
          }).select().single();

          if (error) {
            // Insert failed (likely duplicate) — reload fresh
            loadedForUserRef.current = null;
            loadAllData(authUser.id);
            return;
          }

          setFamilyAccount({ ...inserted, parentName: inserted.parent_name, additionalGuardians: [] });
          setPage("home");
        }}
        onHostPath={host => setHostMode(host)}
        competitionHosts={competitionHosts}
        registerHost={registerHost}
        authUser={authUser}
        onSignOut={signOut}
        isInvite={!!sessionStorage.getItem('tp_pending_coach_id') || userRole === 'family'}
      />
    );
  }

  // Host mode — bypass family account UI, go directly to host dashboard
  if (hostMode) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ background: "var(--navy)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid var(--brand)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <BatonIcon size={28} />
                <span style={{ fontFamily: "'DM Serif Display', serif", color: "white", fontSize: 18 }}>
                  Twirl<span style={{ color: "#e11d6a" }}>Power</span>
                  <span style={{ color: "var(--muted)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginLeft: 10 }}>Director Dashboard</span>
                </span>
              </div>
              <button onClick={signOut} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", color: "var(--muted)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                Sign out
              </button>
            </div>
            <div className="main">
              <HostDashboardPage
                competitionHosts={competitionHosts}
                publicCompetitions={publicCompetitions}
                attendees={attendees}
                twirlers={twirlers}
                familyAccount={{ email: hostMode.email }}
                registerHost={registerHost}
                createPublicCompetition={createPublicCompetition}
                deletePublicCompetition={deletePublicCompetition}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (twirlers.length === 0 && !guardianMode && !dataLoading && familyAccount) {
    return (
      <>
        <style>{css}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
          <div className="card" style={{ maxWidth: 480, width: "100%", textAlign: "center", padding: "40px 32px" }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, background: "var(--navy)", borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BatonIcon size={40} />
              </div>
            </div>
            <h2 className="serif" style={{ fontSize: 24, marginBottom: 8, color: "var(--navy)" }}>Add your first twirler</h2>
            <p style={{ color: "var(--slate)", fontSize: 14, marginBottom: 24 }}>Set up a profile for each athlete in your family.</p>
            <button className="btn btn-primary w-full" onClick={() => openModal("addTwirler")}>
              <Icon name="plus" size={16} /> Add Twirler Profile
            </button>
            <button className="btn btn-ghost w-full" style={{ marginTop: 10, fontSize: 13 }} onClick={signOut}>
              Sign out
            </button>
          </div>
          <AddTwirlerModal open={modals.addTwirler?.open} onClose={() => closeModal("addTwirler")} onSave={addTwirler} onOpenHistorical={twirler => openModal("historicalData", { twirler })} />
        </div>
      </>
    );
  }

  const pageProps = { activeTwirler, twirlers, competitions, results, twirlerResults, twirlerComps, progress, coaches, coachCompetitions, invites, pendingInvites, coachLinks, pendingCoachLinks, allNotifications, respondToCoachLink, familyAccount, openModal, closeModal, modals, addCompetition, addResults, addResultsToComp, deleteResult, deleteCompetition, overrideClassification, applyHistoricalData, updateTwirler, deleteTwirler, updateResult, updateCompetition, setTwirlers, setCompetitions, setResults, setCoaches, addCoach, linkCoach, unlinkCoach, coachCreateCompetition, respondToInvite, setActiveTwirlerId, competitionHosts, publicCompetitions, attendees, registerHost, approveHost, createPublicCompetition, deletePublicCompetition, addAttendee, removeAttendee, setFamilyAccount, guardianMode };

  return (
    <>
      <style>{css}</style>
      <ReportIssueButton page={page} authUser={authUser} familyAccount={familyAccount} coachAccount={null} />
      <BetaFeedbackPopup authUser={authUser} familyAccount={familyAccount} coachAccount={null} />
      <InstallBanner show={showInstallBanner && canShowInstall} onInstall={triggerInstall} onDismiss={dismissInstall} isIos={isIos} />
      <IosInstallModal show={showIosInstructions} onDone={markIosDone} onClose={() => setShowIosInstructions(false)} />
      <div className="app">
        <Sidebar page={page} setPage={p => { setPage(p); setSidebarOpen(false); }} twirlers={twirlers} activeTwirlerId={activeTwirlerId} setActiveTwirlerId={id => { setActiveTwirlerId(id); setSidebarOpen(false); }} openModal={openModal} familyAccount={familyAccount} progress={progress} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pendingInvites={pendingInvites} onSignOut={signOut} darkMode={darkMode} setDarkMode={setDarkMode} isAdmin={isAdmin} previewRole={previewRole} setPreviewRole={setPreviewRole} allNotifications={allNotifications} canShowInstall={canShowInstall} onInstallClick={triggerInstall} competitionHosts={competitionHosts} pendingClubClaims={pendingClubClaims} />
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="mobile-topbar-title">Twirl<span style={{ color: "#e11d6a" }}>Power</span></span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button className="mobile-menu-btn" style={{ position: "relative" }}
              onClick={() => { setPage("notifications"); setSidebarOpen(false); }} aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {allNotifications?.length > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16,
                  background: "#e11d6a", borderRadius: "50%", fontSize: 9, fontWeight: 700,
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {allNotifications.length}
                </span>
              )}
            </button>
            {guardianMode !== 'viewer' && (
              <button className="mobile-menu-btn" onClick={() => openModal("addCompetition")} aria-label="Add competition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            )}
          </div>
        </div>
        {/* Offline banner */}
        {isOffline && (
          <div style={{ background: "#fef3c7", borderBottom: "2px solid #f59e0b",
            padding: "8px 16px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📴</span>
            <span style={{ color: "#92400e", fontWeight: 500 }}>
              You're offline — viewing cached data. Changes can't be saved until you reconnect.
            </span>
          </div>
        )}
        {/* Guardian mode banner */}
        {guardianMode === 'viewer' && (
          <div style={{ background: "#fef3c7",
            borderBottom: "2px solid #f59e0b",
            padding: "8px 16px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>👁</span>
            <span style={{ color: "#92400e", fontWeight: 500 }}>
              You're viewing this family's account in read-only mode.
            </span>
          </div>
        )}
        <div className="main">
          {page === "home" && <HomePage {...pageProps} setPage={setPage} />}
          {page === "competitions" && <CompetitionsPage {...pageProps} updateResult={updateResult} updateCompetition={updateCompetition} />}
          {page === "progress" && <ProgressPage {...pageProps} results={results} competitions={competitions} />}
          {page === "profile" && <ProfilePage {...pageProps} setFamilyAccount={setFamilyAccount} openModal={openModal} competitionHosts={competitionHosts} approveHost={approveHost} competitions={competitions} results={results} setTwirlers={setTwirlers} setCompetitions={setCompetitions} setResults={setResults} setCoaches={setCoaches} isAdmin={isAdmin} setPage={setPage} authUser={authUser} supabase={supabase} />}
          {page === "coaches" && <CoachesPage {...pageProps} supabase={supabase} />}
          {page === "openqs" && isAdmin && <OpenQuestionsPage />}
          {page === "notifications" && <NotificationsPage {...pageProps} setPage={setPage} />}
          {page === "privacy" && <PrivacyPolicyPage onClose={() => setPage("home")} />}
          {page === "terms" && <TermsOfServicePage onClose={() => setPage("home")} />}
          {page === "admin" && isAdmin && <AdminPage {...pageProps} supabase={supabase} isAdmin={isAdmin} setPage={setPage} previewRole={previewRole} setPreviewRole={setPreviewRole} />}
          {page === "orgs" && <OrganizationsPage activeTwirler={activeTwirler} twirlerResults={twirlerResults} />}
          {page === "timeline" && <ClassificationTimelinePage {...pageProps} />}
          {page === "upcoming" && <CompetitionsPage {...pageProps} initialTab="upcoming" />}
          {page === "hostdash" && <HostDashboardPage {...pageProps} />}
        </div>
        </div>
      </div>

      <AddTwirlerModal open={modals.addTwirler?.open} onClose={() => closeModal("addTwirler")} onSave={addTwirler} onOpenHistorical={twirler => openModal("historicalData", { twirler })} />
      <AddCompetitionModal open={modals.addCompetition?.open} onClose={() => closeModal("addCompetition")} onSave={(compData, resultData) => { const id = addCompetition(compData); addResults(id, resultData); }} activeTwirler={activeTwirler} competitions={competitions} />
      <OverrideModal open={modals.override?.open} onClose={() => closeModal("override")} data={modals.override} onSave={overrideClassification} />
      <AddResultsModal open={modals.addResults?.open} onClose={() => closeModal("addResults")} competition={modals.addResults?.competition} activeTwirler={activeTwirler} onSave={addResultsToComp} competitions={competitions} prefillCompetitionId={modals.addResults?.competitionId} prefillEvent={modals.addResults?.prefillEvent} prefillLevel={modals.addResults?.prefillLevel} />
      <HistoricalDataModal open={modals.historicalData?.open} onClose={() => closeModal("historicalData")} activeTwirler={modals.historicalData?.twirler || activeTwirler} onSave={applyHistoricalData} />
    </>
  );
}

// ─── SETUP SCREEN ───────────────────────────────────────────────────────────

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────

function PasswordResetForm({ supabase, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(onDone, 2000);
  }

  if (done) return (
    <div className="alert alert-success" style={{ textAlign: "center" }}>
      <Icon name="check" size={16} color="var(--green)" />
      <span>Password updated! Signing you in...</span>
    </div>
  );

  return (
    <>
      {error && (
        <div className="alert alert-warn" style={{ marginBottom: 16 }}>
          <Icon name="alert" size={14} color="var(--amber)" />
          <span style={{ fontSize: 13 }}>{error}</span>
        </div>
      )}
      <div className="form-group">
        <label className="label">New password</label>
        <input className="input" type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoFocus />
      </div>
      <div className="form-group">
        <label className="label">Confirm password</label>
        <input className="input" type="password" value={confirm}
          onChange={e => setConfirm(e.target.value)} placeholder="Repeat password"
          onKeyDown={e => e.key === "Enter" && handleSubmit()} />
      </div>
      <button className="btn btn-primary w-full" disabled={loading || !password || !confirm} onClick={handleSubmit}>
        {loading ? "Updating..." : "Set New Password"}
      </button>
    </>
  );
}

function AuthScreen({ onAuth, authError, setAuthError, hasInvite, inviteEmail }) {
  const [mode, setMode] = useState(hasInvite ? "signup" : "login"); // "login" | "signup" | "coach-signup" | "reset"
  const [signupRole, setSignupRole] = useState(hasInvite ? "family" : null); // null | "family" | "coach"
  const [email, setEmail] = useState(inviteEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showLegal, setShowLegal] = useState(null); // null | "privacy" | "terms"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Update email if inviteEmail loads asynchronously
  useEffect(() => { if (inviteEmail && !email) setEmail(inviteEmail); }, [inviteEmail]);

  async function handleLogin(e) {
    e?.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setAuthError(error.message);
    else onAuth(data.user);
  }

  async function handleSignup(e) {
    e?.preventDefault();
    if (!email || !password) return;
    if (password !== confirmPassword) { setAuthError("Passwords do not match."); return; }
    if (password.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setAuthError(null);
    // Store role in user metadata — survives the email confirmation roundtrip
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: signupRole || 'family' } }
    });
    if (error) {
      setLoading(false);
      setAuthError(error.message);
      return;
    }
    // If no email confirmation required, seed role immediately
    if (data.user && data.session) {
      await supabase.from('user_roles').upsert({
        user_id: data.user.id,
        role: signupRole || 'family'
      });
    }
    setLoading(false);
    if (data.user && !data.session) {
      setMessage("Check your email for a confirmation link, then come back to sign in.");
      setMode("login");
    } else if (data.user) {
      onAuth(data.user);
    }
  }

  async function handleReset(e) {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) setAuthError(error.message);
    else { setMessage("Password reset email sent. Check your inbox."); setMode("login"); }
  }

  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 72, height: 72, background: "var(--navy)", borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(13,148,136,0.25)" }}>
          <BatonIcon size={48} />
        </div>
      </div>
      <h1 className="serif" style={{ fontSize: 32, marginBottom: 6, color: "var(--navy)" }}>
        Twirl<span style={{ color: "#e11d6a" }}>Power</span>
      </h1>
      <p style={{ color: "var(--slate)", fontSize: 14, letterSpacing: "0.3px" }}>Track · Compete · Advance</p>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {showLegal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", zIndex: 700,
          overflow: "auto", padding: 20 }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <button onClick={() => setShowLegal(null)} className="btn btn-secondary btn-sm" style={{ marginBottom: 16 }}>← Back to signup</button>
            {showLegal === "privacy" ? <PrivacyPolicyPage /> : <TermsOfServicePage />}
          </div>
        </div>
      )}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0a10 60%, #2d0a1a 100%)", padding: "20px" }}>
        <div className="card" style={{ maxWidth: 420, width: "100%", padding: "40px 36px" }}>
          <Logo />

          {message && (
            <div className="alert alert-success mb-4">
              <Icon name="check" size={15} color="var(--green)" />
              <span>{message}</span>
            </div>
          )}
          {authError && (
            <div className="alert alert-warn mb-4">
              <Icon name="alert" size={15} color="var(--amber)" />
              <span>{authError}</span>
            </div>
          )}

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 20 }}>Sign in to your account</div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoFocus
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
              </div>
              <button className="btn btn-primary w-full" disabled={loading || !email || !password} onClick={handleLogin}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setMode("signup"); setSignupRole(null); setAuthError(null); setMessage(null); }}>
                  Create account
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setMode("reset"); setAuthError(null); setMessage(null); }}>
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {/* ── SIGNUP ROLE SELECTION ── */}
          {mode === "signup" && !signupRole && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>Create your account</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20 }}>What best describes you?</p>
              {[
                { id: "family", icon: "👨‍👩‍👧", label: "Family / Parent / Guardian", desc: "Track classifications and competition history for your twirler" },
                { id: "coach", icon: "🎓", label: "Coach / Club Owner", desc: "Manage your twirlers, send competition invites, track progress, and manage your studio or club" },
                { id: "host", icon: "🏆", label: "Competition Director", desc: "Create and manage public competitions for twirlers to register for" },
              ].map(r => (
                <div key={r.id} onClick={() => setSignupRole(r.id)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                    border: "2px solid var(--border)", borderRadius: 10, cursor: "pointer",
                    marginBottom: 10, transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--brand)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <div style={{ fontSize: 28 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)" }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{r.desc}</div>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => { setMode("login"); setAuthError(null); }}>
                ← Back to sign in
              </button>
            </>
          )}

          {/* ── SIGNUP FORM (family or coach) ── */}
          {mode === "signup" && signupRole && signupRole !== "host" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <button onClick={() => setSignupRole(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: 18, lineHeight: 1 }}>←</button>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>
                  {signupRole === "coach" ? "🎓 Create Coach / Club Owner Account" : "👨‍👩‍👧 Create Family Account"}
                </div>
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoFocus />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters" />
              </div>
              <div className="form-group">
                <label className="label">Confirm password</label>
                <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === "Enter" && handleSignup()} />
              </div>
              <div className="alert alert-info mb-4">
                <Icon name="info" size={14} color="var(--brand)" />
                <span style={{ fontSize: 12 }}>You'll receive a confirmation email. Click the link to verify your account before signing in.</span>
              </div>
              <div className="form-group">
                <label className="label">Your date of birth (must be 18+)</label>
                <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0,10)} />
                {dob && getAge({ dob }) < 18 && (
                  <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>You must be 18 or older to create a TwirlPower account.</div>
                )}
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16, cursor: "pointer" }}>
                <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.6 }}>
                  I agree to the <button type="button" onClick={() => setShowLegal("terms")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", padding: 0, fontSize: 12, textDecoration: "underline" }}>Terms of Service</button> and <button type="button" onClick={() => setShowLegal("privacy")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", padding: 0, fontSize: 12, textDecoration: "underline" }}>Privacy Policy</button>. I confirm I am 18 or older and am creating this account as a parent or guardian.
                </span>
              </label>
              <button className="btn btn-primary w-full"
                disabled={loading || !email || !password || !confirmPassword || !agreedTerms || !dob || getAge({ dob }) < 18}
                onClick={handleSignup}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </>
          )}

          {/* ── HOST SIGNUP PATH ── */}
          {mode === "signup" && signupRole === "host" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <button onClick={() => setSignupRole(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: 18, lineHeight: 1 }}>←</button>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)" }}>🏆 Competition Director Sign Up</div>
              </div>
              <div className="alert alert-info mb-4">
                <Icon name="info" size={14} color="var(--brand)" />
                <div style={{ fontSize: 12 }}>
                  Director accounts require admin approval before you can create public competitions.
                  First create a TwirlPower account, then complete your director registration.
                </div>
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoFocus />
              </div>
              <div className="form-group">
                <label className="label">Password</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Confirm password</label>
                <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              {authError && <div className="alert alert-warn mb-3"><Icon name="alert" size={13} color="var(--red)" /><span style={{ fontSize: 12 }}>{authError}</span></div>}
              <button className="btn btn-primary w-full"
                disabled={loading || !email || !password || !confirmPassword || password !== confirmPassword}
                onClick={async () => {
                  setLoading(true); setAuthError(null);
                  const { data, error } = await supabase.auth.signUp({
                    email, password,
                    options: { data: { role: 'family' } } // hosts start as family, get host via setup
                  });
                  if (error) { setAuthError(error.message); setLoading(false); return; }
                  setMessage("Account created! Check your email to verify, then sign in to complete director registration.");
                  setMode("login");
                  setLoading(false);
                }}>
                {loading ? "Creating account..." : "Create Account & Register as Host"}
              </button>
              <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => setSignupRole(null)}>
                ← Back
              </button>
            </>
          )}

          {/* ── RESET ── */}
          {mode === "reset" && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>Reset your password</div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20 }}>Enter your email and we'll send you a reset link.</p>
              <div className="form-group">
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoFocus
                  onKeyDown={e => e.key === "Enter" && handleReset()} />
              </div>
              <button className="btn btn-primary w-full" disabled={loading || !email} onClick={handleReset}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => { setMode("login"); setAuthError(null); }}>
                ← Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── COACH SETUP SCREEN ──────────────────────────────────────────────────────

function CoachSetupScreen({ authUser, onComplete }) {
  const [form, setForm] = useState({
    name: "", phone: "", club: "", specialization: "", organizations: [], bio: "", state: ""
  });
  const [loading, setLoading] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    if (!form.name) return;
    setLoading(true);
    await onComplete(form);
    setLoading(false);
  }

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0a10 60%, #2d0a1a 100%)", padding: "20px" }}>
        <div className="card" style={{ maxWidth: 480, width: "100%", padding: "40px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
            <h1 className="serif" style={{ fontSize: 26, color: "var(--navy)", marginBottom: 4 }}>
              Set up your coach profile
            </h1>
            <p style={{ color: "var(--slate)", fontSize: 13 }}>
              Signed in as {authUser?.email}
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Your name *</label>
              <input className="input" value={form.name} onChange={e => f("name", e.target.value)}
                placeholder="Full name" autoFocus />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => f("phone", e.target.value)}
                placeholder="Optional" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Club</label>
              <input className="input" value={form.club} onChange={e => f("club", e.target.value)}
                placeholder="Club name" />
            </div>
            <div className="form-group">
              <label className="label">State</label>
              <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Specialization</label>
            <input className="input" value={form.specialization} onChange={e => f("specialization", e.target.value)}
              placeholder="e.g. Solo, Corps, All Events" />
          </div>
          <div className="form-group">
            <label className="label">Organizations you coach</label>
            <div className="chip-group">
              {Object.values(ORGS).map(org => {
                const selected = form.organizations.includes(org.id);
                return (
                  <div key={org.id} className={`chip ${selected ? "selected" : ""}`}
                    onClick={() => f("organizations", selected
                      ? form.organizations.filter(o => o !== org.id)
                      : [...form.organizations, org.id])}>
                    <span style={{ fontWeight: 600 }}>{org.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="form-group">
            <label className="label">Bio (optional)</label>
            <textarea className="textarea" value={form.bio} onChange={e => f("bio", e.target.value)}
              rows={2} placeholder="A short intro about your coaching experience..." />
          </div>

          <button className="btn btn-primary w-full" disabled={loading || !form.name} onClick={handleSubmit}>
            {loading ? "Setting up..." : "Complete Setup →"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── COACH APP ────────────────────────────────────────────────────────────────

function CoachApp({ authUser, coachAccount, setCoachAccount, twirlers, setTwirlers, competitions, results, coachCompetitions,
  coachClubs, setCoachClubs, coachClubClaims, setCoachClubClaims,
  pendingClubMembers, setPendingClubMembers,
  invites, progress, darkMode, setDarkMode, isAdmin, onSignOut, supabase, loadCoachData,
  page, setPage, openModal, closeModal, modals, coachCreateCompetition, publicCompetitions }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTwirlerId, setActiveTwirlerId] = useState(twirlers[0]?.id || null);
  const [searchAthletes, setSearchAthletes] = useState("");

  useEffect(() => {
    if (twirlers.length > 0 && !activeTwirlerId) setActiveTwirlerId(twirlers[0].id);
  }, [twirlers]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const activeTwirler = twirlers.find(t => t.id === activeTwirlerId) || twirlers[0];
  const pendingLinks = invites.filter(i => i.type === 'athlete_link' && i.status === 'pending');

  // Calculate progress for all twirlers (for roster view)
  const allProgress = Object.fromEntries(
    twirlers.map(t => [t.id, calculateProgress(t, [])])
  );

  const navItems = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "roster", label: "My Roster", icon: "users" },
    { id: "club", label: `My Clubs${coachClubs.length > 0 ? ` (${coachClubs.length})` : ""}`, icon: "star", pending: pendingClubMembers.length },
    { id: "competitions", label: "Competitions", icon: "trophy" },
    { id: "progress", label: "Progress Tracker", icon: "progress" },
  ];

  const accountItems = [
    { id: "coach-profile", label: "Coach Profile", icon: "user" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "settings", admin: true }] : []),
  ];

  const CoachSidebar = () => (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h1 className="serif">Twirl<span>Power</span></h1>
          <p>COACH</p>
        </div>

        {/* Pending club member requests notification */}
        {pendingClubMembers.length > 0 && (
          <div style={{ margin: "8px 12px 0", padding: "10px 12px", background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fca5a5", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🔔 Pending Club Requests ({pendingClubMembers.length})
            </div>
            {pendingClubMembers.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "white" }}>{m.twirlers?.first_name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{m.clubs?.name}</div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ fontSize: 10, padding: "3px 8px" }}
                  onClick={async () => {
                    await supabase.from("club_members").update({ status: "active" }).eq("id", m.id);
                    setPendingClubMembers(prev => prev.filter(x => x.id !== m.id));
                  }}>
                  ✓ Approve
                </button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm w-full" style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.6)" }}
              onClick={() => { setPage("club"); setSidebarOpen(false); }}>
              Manage in My Clubs →
            </button>
          </div>
        )}

        {/* Athletes */}
        <div className="sidebar-section">
          <div className="sidebar-label">Twirlers ({twirlers.length})</div>
          {twirlers.length === 0 ? (
            <div style={{ padding: "8px 20px", fontSize: 12, color: "var(--slate)" }}>No twirlers linked yet</div>
          ) : twirlers.map(t => (
            <div key={t.id}
              className={`sidebar-twirler ${activeTwirlerId === t.id ? "active" : ""}`}
              onClick={() => { setActiveTwirlerId(t.id); setSidebarOpen(false); }}>
              <div className="name">{t.firstName}</div>
              <div className="sub">
                {t.club || t.familyName || ""}
                {t.organizations?.length > 0 && <span style={{ marginLeft: 4 }}>{t.organizations.join(", ")}</span>}
              </div>
            </div>
          ))}
          <div style={{ padding: "6px 20px" }}>
            <button className="btn btn-ghost btn-sm w-full" onClick={() => { setPage("invite-athlete"); setSidebarOpen(false); }}
              style={{ fontSize: 12, justifyContent: "center" }}>
              + Invite Twirler
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-section">
          <div className="sidebar-label">Navigation</div>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => { setPage(item.id); setSidebarOpen(false); }}>
              <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
              <span>{item.label}</span>
              {item.pending > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "white",
                  borderRadius: 10, fontSize: 9, fontWeight: 700, padding: "1px 5px",
                  minWidth: 16, textAlign: "center" }}>
                  {item.pending}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Account */}
        <div className="sidebar-section">
          <div className="sidebar-label">Account</div>
          {accountItems.map(item => (
            <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              style={item.admin ? { borderLeft: page === item.id ? "3px solid #818cf8" : "3px solid transparent" } : {}}>
              <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
              <span style={item.admin ? { color: "#818cf8" } : {}}>{item.label}</span>
              {item.admin && <span className="badge" style={{ marginLeft: "auto", fontSize: 9, background: "#312e81", color: "#a5b4fc" }}>Admin</span>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 2 }}>{coachAccount?.name}</div>
          <div style={{ fontSize: 11, color: "var(--navy3)", marginBottom: 10 }}>Coach Account</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "var(--slate)" }}>{darkMode ? "Dark mode" : "Light mode"}</span>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, color: "var(--muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <button onClick={onSignOut}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "var(--muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <ReportIssueButton page={page} authUser={authUser} familyAccount={null} coachAccount={coachAccount} />
      <BetaFeedbackPopup authUser={authUser} familyAccount={null} coachAccount={coachAccount} />
      <div className="app">
        <CoachSidebar />
        <div className="main">
          {/* Mobile topbar */}
          <div className="mobile-topbar">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="mobile-topbar-title">TwirlPower <span style={{ color: "var(--brand)", fontSize: 12 }}>Coach</span></span>
            <div style={{ width: 30 }} />
          </div>

          {/* Pending twirler links banner */}
          {pendingLinks.length > 0 && (
            <div className="alert alert-info mb-4">
              <Icon name="info" size={14} color="var(--brand)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>
                  {pendingLinks.length} pending twirler link{pendingLinks.length !== 1 ? "s" : ""} — families need to accept.
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {pendingLinks.map(l => (
                    <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6,
                      background: "white", borderRadius: 6, padding: "4px 10px",
                      border: "1px solid var(--border)", fontSize: 12 }}>
                      <span>{l.twirlerName || "Twirler"}</span>
                      {l.familyEmail && (
                        <button className="btn btn-ghost btn-sm"
                          onClick={async () => {
                            await sendEmail("coach_link_request", l.familyEmail, {
                              coachName: coachAccount.name,
                              coachStudio: coachAccount.club,
                              coachOrgs: coachAccount.organizations,
                              athleteName: l.twirlerName,
                            });
                            alert(`Reminder sent to ${l.familyEmail}`);
                          }}
                          style={{ fontSize: 10, padding: "2px 6px" }}>
                          Resend
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pages */}
          {page === "home" && <CoachHomePage coachAccount={coachAccount} twirlers={twirlers} coachCompetitions={coachCompetitions} progress={allProgress} activeTwirler={activeTwirler} setPage={setPage} setActiveTwirlerId={setActiveTwirlerId} />}
          {page === "roster" && <ClubRosterPage twirlers={twirlers} progress={allProgress} coachAccount={coachAccount} coachClubs={coachClubs} setPage={setPage} setActiveTwirlerId={setActiveTwirlerId} />}
          {page === "club" && <ClubPage coachAccount={coachAccount} supabase={supabase}
            setPage={setPage} coachClubs={coachClubs} setCoachClubs={setCoachClubs}
            coachClubClaims={coachClubClaims} setCoachClubClaims={setCoachClubClaims}
            loadCoachData={loadCoachData} twirlers={twirlers}
            pendingClubMembers={pendingClubMembers} setPendingClubMembers={setPendingClubMembers} />}
          {page === "competitions" && <CoachCompetitionsPage coachCompetitions={coachCompetitions} competitions={competitions} results={results} twirlers={twirlers} activeTwirler={activeTwirler} setPage={setPage} publicCompetitions={publicCompetitions} familyAccount={null} addAttendee={() => {}} attendees={[]} registerHost={() => {}} />}
          {page === "history" && <CoachCompetitionsPage coachCompetitions={coachCompetitions} competitions={competitions} results={results} twirlers={twirlers} activeTwirler={activeTwirler} setPage={setPage} publicCompetitions={publicCompetitions} familyAccount={null} addAttendee={() => {}} attendees={[]} registerHost={() => {}} />}
          {page === "progress" && activeTwirler && <ProgressPage activeTwirler={activeTwirler} twirlers={twirlers} progress={progress} openModal={openModal} updateTwirler={() => {}} results={[]} competitions={[]} />}
          {page === "upcoming" && <CoachCompetitionsPage coachCompetitions={coachCompetitions} twirlers={twirlers} activeTwirler={activeTwirler} setPage={setPage} publicCompetitions={publicCompetitions} familyAccount={null} addAttendee={() => {}} attendees={[]} registerHost={() => {}} initialTab="upcoming" />}
          {page === "coach-profile" && <CoachProfilePage coachAccount={coachAccount} setCoachAccount={setCoachAccount} supabase={supabase} twirlers={twirlers} invites={invites} loadCoachData={loadCoachData} coachClubs={coachClubs} />}
          {page === "invite-athlete" && <InviteAthletePage coachAccount={coachAccount} supabase={supabase} setPage={setPage} loadCoachData={loadCoachData} />}
          {page === "create-competition" && <CreateCompetitionPage coachAccount={coachAccount} twirlers={twirlers} supabase={supabase} setPage={setPage} coachCreateCompetition={coachCreateCompetition} />}
          {page === "admin" && isAdmin && <AdminPage twirlers={twirlers} competitions={[]} results={[]} coaches={[]} familyAccount={null} competitionHosts={[]} approveHost={() => {}} supabase={supabase} isAdmin={isAdmin} setPage={setPage} previewRole={null} setPreviewRole={() => {}} />}
        </div>
      </div>
    </>
  );
}

// ─── COACH HOME PAGE ──────────────────────────────────────────────────────────

// ─── STUDIO ROSTER PAGE ───────────────────────────────────────────────────────

function ClubRosterPage({ twirlers, progress, coachAccount, coachClubs, setPage, setActiveTwirlerId }) {
  const [filterOrg, setFilterOrg] = useState("");
  const [filterClub, setFilterClub] = useState("");
  const [search, setSearch] = useState("");

  const filtered = twirlers
    .filter(t => !search || t.firstName?.toLowerCase().includes(search.toLowerCase()) || t.familyName?.toLowerCase().includes(search.toLowerCase()))
    .filter(t => !filterOrg || (t.organizations || []).includes(filterOrg))
    .filter(t => !filterClub || t.club === filterClub);

  const allOrgs = [...new Set(twirlers.flatMap(t => t.organizations || []))];
  const allClubs = [...new Set(twirlers.map(t => t.club).filter(Boolean))].sort();

  function exportRoster() {
    const rows = [
      ["Athlete", "Family", "Organization", "Event", "Current Level", "Wins", "Next Level", "Ready to Advance"],
      ...twirlers.flatMap(t =>
        (t.organizations || []).flatMap(orgId =>
          (ORGS[orgId]?.leveledEvents || []).map(event => {
            const prog = progress?.[t.id]?.[orgId]?.[event];
            if (!prog) return null;
            return [
              t.firstName,
              t.familyName || "",
              orgId,
              event,
              prog.currentLevel,
              prog.winsCount || 0,
              prog.nextLevel || "Advanced",
              prog.shouldAdvance ? "YES" : "no",
            ];
          }).filter(Boolean)
        )
      ),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coachAccount?.club || "Club"}_Roster_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Roster</h1>
          <p className="page-sub">{twirlers.length} athlete{twirlers.length !== 1 ? "s" : ""} · all classifications at a glance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={exportRoster}>
            <Icon name="export" size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setPage("invite-athlete")}>
            + Invite Twirler
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar mb-4">
        <div style={{ position: "relative", flex: "1 1 140px", minWidth: 0 }}>
          <input className="input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search twirlers..." style={{ paddingLeft: 32 }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <select className="select" value={filterOrg} onChange={e => setFilterOrg(e.target.value)}>
          <option value="">All Orgs</option>
          {allOrgs.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {allClubs.length > 1 && (
          <select className="select" value={filterClub} onChange={e => setFilterClub(e.target.value)}>
            <option value="">All Clubs</option>
            {allClubs.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
          <h3>{twirlers.length === 0 ? "No twirlers linked yet" : "No twirlers match your filters"}</h3>
          {twirlers.length === 0 && (
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setPage("invite-athlete")}>
              Invite your first athlete
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(t => {
            const tProgress = progress?.[t.id] || {};
            const advancingEvents = Object.entries(tProgress).flatMap(([orgId, events]) =>
              Object.entries(events).filter(([, p]) => p.shouldAdvance).map(([event, p]) => ({ orgId, event, p }))
            );
            const isAdvancing = advancingEvents.length > 0;

            return (
              <div key={t.id} className="card"
                style={{ borderLeft: isAdvancing ? "4px solid var(--green)" : "4px solid var(--border)", cursor: "pointer" }}
                onClick={() => { setActiveTwirlerId(t.id); setPage("progress"); }}>
                <div className="flex items-start gap-4">
                  <div className="avatar avatar-lg" style={{ background: isAdvancing ? "#dcfce7" : "var(--brand)", color: isAdvancing ? "#166534" : "white" }}>
                    {initials(t.firstName)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)" }}>{t.firstName}</div>
                      {t.familyName && <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.familyName}</div>}
                      {t.club && (
                        <span className="badge" style={{ fontSize: 10,
                          background: coachAccount?.club && t.club === coachAccount.club ? "var(--brand-light)" : "var(--bg)",
                          color: coachAccount?.club && t.club === coachAccount.club ? "var(--brand)" : "var(--slate)",
                          border: `1px solid ${coachAccount?.club && t.club === coachAccount.club ? "var(--brand)" : "var(--border)"}` }}>
                          {t.club}
                          {coachAccount?.club && t.club === coachAccount.club && " ✓"}
                        </span>
                      )}
                      {isAdvancing && (
                        <span className="badge badge-green" style={{ fontSize: 10 }}>
                          {advancingEvents.length} ready to advance
                        </span>
                      )}
                    </div>

                    {/* Classification grid */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                      {(t.organizations || []).flatMap(orgId =>
                        (ORGS[orgId]?.leveledEvents || []).map(event => {
                          const prog = tProgress?.[orgId]?.[event];
                          if (!prog) return null;
                          return (
                            <div key={`${orgId}-${event}`}
                              style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11,
                                background: prog.shouldAdvance ? "#dcfce7" : "var(--bg)",
                                border: `1px solid ${prog.shouldAdvance ? "#86efac" : "var(--border)"}` }}>
                              <span style={{ fontWeight: 700, color: orgColor(orgId) }}>{orgId}</span>
                              <span style={{ color: "var(--muted)", margin: "0 4px" }}>·</span>
                              <span style={{ color: "var(--slate)" }}>{event}</span>
                              <span style={{ color: "var(--muted)", margin: "0 4px" }}>·</span>
                              <span style={{ fontWeight: 600, color: prog.shouldAdvance ? "var(--green)" : "var(--navy)" }}>
                                {prog.currentLevel}
                              </span>
                              {prog.nextLevel && (
                                <span style={{ color: "var(--muted)", marginLeft: 4 }}>
                                  {prog.winsCount}/{prog.winsNeeded}
                                </span>
                              )}
                            </div>
                          );
                        }).filter(Boolean)
                      )}
                      {(t.organizations || []).length === 0 && (
                        <span style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>No organizations set</span>
                      )}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CoachHomePage({ coachAccount, twirlers, coachCompetitions, progress, activeTwirler, setPage, setActiveTwirlerId }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcomingComps = (coachCompetitions || [])
    .filter(c => c.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastComps = (coachCompetitions || [])
    .filter(c => c.date < today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const advancingCount = twirlers.filter(t =>
    Object.values(progress?.[t.id] || {}).some(org => Object.values(org).some(e => e.shouldAdvance))
  ).length;

  function goToTwirler(twirler) {
    setActiveTwirlerId(twirler.id);
    setPage("progress");
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Coach Dashboard</h1>
          <p className="page-sub">Welcome back, {coachAccount?.name}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => setPage("create-competition")}>
            <Icon name="plus" size={13} /> Create Competition
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setPage("invite-athlete")}>
            <Icon name="plus" size={13} /> Invite Twirler
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-3 mb-6">
        {[
          { label: "Twirlers", value: twirlers.length, icon: "👤", action: () => setPage("roster") },
          { label: "Upcoming", value: upcomingComps.length, icon: "📅", action: () => setPage("competitions") },
          { label: "Ready to advance", value: advancingCount, icon: "⬆️", action: () => setPage("roster"), highlight: advancingCount > 0 },
        ].map(s => (
          <div key={s.label} className="stat-card" onClick={s.action}
            style={{ cursor: "pointer", transition: "box-shadow 0.15s",
              border: s.highlight ? "1px solid #86efac" : "1px solid var(--border)",
              background: s.highlight ? "#f0fdf4" : "var(--card)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.highlight ? "var(--green)" : "var(--navy)" }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming competitions */}
      <div className="card mb-4">
        <div className="section-header">
          <span className="section-title">Upcoming Competitions</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage("competitions")}>View all</button>
        </div>
        {upcomingComps.length === 0 ? (
          <div style={{ padding: "16px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>No upcoming competitions scheduled.</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage("create-competition")}>
              + Create Competition
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {upcomingComps.slice(0, 5).map((c, i) => {
              const accepted = (c.invites || []).filter(inv => inv.status === "accepted").length;
              const pending = (c.invites || []).filter(inv => inv.status === "pending").length;
              const daysUntil = Math.ceil((new Date(c.date) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={c.id} style={{ padding: "12px 0",
                  borderBottom: i < upcomingComps.slice(0, 5).length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>
                        {fmtDate(c.date)}{c.start_time ? ` · ${c.start_time}` : ""}{c.state ? ` · ${c.state}` : ""}{c.venue ? ` · ${c.venue}` : ""}{c.location ? ` · ${c.location}` : ""}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                        {accepted} accepted · {pending} pending
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: daysUntil <= 7 ? "#fef3c7" : "#f1f5f9",
                      color: daysUntil <= 7 ? "#92400e" : "var(--slate)",
                      fontSize: 10, flexShrink: 0 }}>
                      {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil}d`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Twirler roster */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">My Twirlers ({twirlers.length})</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage("roster")}>Full roster →</button>
        </div>
        {twirlers.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <h3>No twirlers linked yet</h3>
            <p>Invite athletes by email to link them to your coach account.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setPage("invite-athlete")}>
              Invite Twirler
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {twirlers.map(t => {
              const tProgress = progress?.[t.id] || {};
              const advancing = Object.values(tProgress).some(org => Object.values(org).some(e => e.shouldAdvance));
              const levelCount = Object.values(tProgress).reduce((sum, org) => sum + Object.keys(org).length, 0);
              const lastComp = (coachCompetitions || [])
                .filter(c => (c.invites || []).some(i => i.twirler_id === t.id))
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
              return (
                <div key={t.id} onClick={() => goToTwirler(t)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    background: advancing ? "#f0fdf4" : "var(--bg)", borderRadius: 8, cursor: "pointer",
                    border: advancing ? "1px solid #86efac" : "1px solid var(--border)",
                    transition: "box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div className="avatar" style={{ background: advancing ? "#16a34a" : "var(--brand)", color: "white", fontSize: 13 }}>
                    {initials(t.firstName)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>{t.firstName}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>
                      {t.organizations?.join(", ")}
                      {lastComp && <span style={{ color: "var(--muted)", marginLeft: 8 }}>Last: {fmtDate(lastComp.date)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {advancing && <span className="badge badge-green" style={{ fontSize: 10 }}>Ready to advance</span>}
                    {levelCount > 0 && !advancing && (
                      <span className="badge badge-gray" style={{ fontSize: 10 }}>{levelCount} event{levelCount !== 1 ? "s" : ""}</span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COACH HISTORY PAGE ───────────────────────────────────────────────────────

function CoachCompetitionsPage({ coachCompetitions, competitions, results, twirlers, activeTwirler, setPage, publicCompetitions, familyAccount, addAttendee, attendees, registerHost, initialTab }) {
  const [tab, setTab] = useState(initialTab || 'history');

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid var(--border)" }}>
        {[
          { id: 'history', label: '📋 My Competitions' },
          { id: 'upcoming', label: '📅 Upcoming' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "none", background: "none", fontFamily: "inherit",
              color: tab === t.id ? "var(--brand)" : "var(--slate)",
              borderBottom: tab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
              marginBottom: -2 }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'history' && (
        <CoachHistoryPage coachCompetitions={coachCompetitions} competitions={competitions} results={results} twirlers={twirlers} activeTwirler={activeTwirler} setPage={setPage} />
      )}
      {tab === 'upcoming' && (
        <UpcomingCompetitionsPage publicCompetitions={publicCompetitions || []} familyAccount={familyAccount} addAttendee={addAttendee} attendees={attendees || []} twirlers={twirlers} activeTwirler={activeTwirler} setPage={setPage} registerHost={registerHost} addCompetition={() => {}} />
      )}
    </div>
  );
}

function CoachHistoryPage({ coachCompetitions, competitions, results, twirlers, activeTwirler, setPage }) {
  const [filterTwirler, setFilterTwirler] = useState("");
  const [tab, setTab] = useState("family"); // "family" | "coach"

  // Family-entered competitions (from the competitions + results tables)
  const famComps = (competitions || [])
    .filter(c => !filterTwirler || c.twirler_id === filterTwirler)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Coach-created competitions
  const coachComps = (coachCompetitions || [])
    .filter(c => !filterTwirler || (c.invites || []).some(i => i.twirler_id === filterTwirler))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Competition History</h1>
          <p className="page-sub">View competition history for your twirlers</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setPage("create-competition")}>
          + Create Competition
        </button>
      </div>

      <div className="filter-bar mb-4" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="select" value={filterTwirler} onChange={e => setFilterTwirler(e.target.value)}>
          <option value="">All twirlers</option>
          {twirlers.map(t => <option key={t.id} value={t.id}>{t.firstName}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 8, padding: 3 }}>
          {[{ id: 'family', label: 'Twirler History' }, { id: 'coach', label: 'My Competitions' }].map(t => (
            <button key={t.id} className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTab(t.id)} style={{ fontSize: 12 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "family" ? (
        famComps.length === 0 ? (
          <div className="empty-state">
            <h3>No competition history</h3>
            <p>{filterTwirler ? "No competitions found for this twirler." : "Competition results entered by families will appear here."}</p>
          </div>
        ) : famComps.map(c => {
          const twirler = twirlers.find(t => t.id === c.twirler_id);
          const compResults = (results || []).filter(r => r.competitionId === c.id);
          return (
            <div key={c.id} className="card mb-3">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{c.name}</div>
                  <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 2 }}>
                    {fmtDate(c.date)}{c.location ? ` · ${c.location}` : ""}
                    {c.orgId && <span className="badge badge-gray" style={{ marginLeft: 6, fontSize: 10 }}>{c.orgId}</span>}
                  </div>
                </div>
                {!filterTwirler && twirler && (
                  <span className="badge badge-brand" style={{ fontSize: 11 }}>{twirler.firstName}</span>
                )}
              </div>
              {compResults.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  {compResults.map(r => (
                    <div key={r.id} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", minWidth: 120 }}>{r.event}</span>
                      {r.placement && <span className="badge badge-brand" style={{ fontSize: 11 }}>#{r.placement}</span>}
                      {r.score != null && <span style={{ fontSize: 12, color: "var(--slate)" }}>Score: {r.score}</span>}
                      {r.allCatch && <span className="badge" style={{ fontSize: 10, background: "var(--green-light, #d1fae5)", color: "var(--green, #059669)" }}>All Catch</span>}
                      {r.casLevel && <span style={{ fontSize: 11, color: "var(--muted)" }}>CAS: {r.casLevel}{r.casPassed ? " ✓" : ""}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        coachComps.length === 0 ? (
          <div className="empty-state">
            <h3>No competitions yet</h3>
            <p>Create competition invites from the athlete cards on your dashboard.</p>
          </div>
        ) : coachComps.map(c => (
          <div key={c.id} className="card mb-3">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--navy)" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 2 }}>
                  {fmtDate(c.date)}{c.start_time ? ` · ${c.start_time}` : ""}{c.state ? ` · ${c.state}` : ""}{c.venue ? ` · ${c.venue}` : ""}{c.location ? ` · ${c.location}` : ""}
                  {c.org_id && <span className="badge badge-gray" style={{ marginLeft: 6, fontSize: 10 }}>{c.org_id}</span>}
                </div>
              </div>
            </div>
            {(c.invites || []).length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                  Invites
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.invites.map(i => {
                    const t = twirlers.find(tw => tw.id === i.twirler_id);
                    const color = i.status === 'accepted' ? "var(--green)" : i.status === 'declined' ? "var(--red)" : "var(--amber)";
                    return (
                      <div key={i.id} style={{ padding: "4px 10px", borderRadius: 20, background: "var(--bg)",
                        border: `1px solid ${color}`, fontSize: 12 }}>
                        {t?.firstName || "Unknown"}
                        <span style={{ marginLeft: 6, color, fontWeight: 600, fontSize: 10 }}>
                          {i.status === 'accepted' ? '✓' : i.status === 'declined' ? '✗' : '⏳'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ─── COACH PROFILE PAGE ───────────────────────────────────────────────────────

function CoachProfilePage({ coachAccount, setCoachAccount, supabase, twirlers, invites, loadCoachData, coachClubs }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(coachAccount || {});
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function saveProfile() {
    const { data, error } = await supabase.from('coach_accounts')
      .update({
        name: form.name,
        phone: form.phone,
        club: form.club,
        specialization: form.specialization,
        organizations: form.organizations || [],
        bio: form.bio,
        state: form.state || null,
      })
      .eq('id', coachAccount.id)
      .select().single();
    if (!error) {
      setCoachAccount({ ...data, organizations: data.organizations || [] });
      setEditing(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Coach Profile</h1>
        <p className="page-sub">Manage your profile and linked twirlers</p>
      </div>

      <div className="card mb-4">
        <div className="section-header">
          <span className="section-title">Profile</span>
          {!editing
            ? <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Icon name="edit" size={13} /> Edit</button>
            : <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={saveProfile}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setForm(coachAccount); setEditing(false); }}>Cancel</button>
              </div>}
        </div>

        {editing ? (
          <div>
            <div className="form-row">
              <div className="form-group"><label className="label">Name</label>
                <input className="input" value={form.name || ""} onChange={e => f("name", e.target.value)} /></div>
              <div className="form-group"><label className="label">Phone</label>
                <input className="input" value={form.phone || ""} onChange={e => f("phone", e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="label">Club</label>
              <div style={{ padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 8, fontSize: 13, color: "var(--slate)" }}>
                {coachClubs?.length > 0 ? coachClubs.map(c => c.name).join(", ")
                  : <span style={{ color: "var(--muted)", fontStyle: "italic" }}>No clubs — manage via My Clubs</span>}
              </div>
            </div>
            <div className="form-group"><label className="label">Specialization</label>
              <input className="input" value={form.specialization || ""} onChange={e => f("specialization", e.target.value)} /></div>
            <div className="form-group"><label className="label">State</label>
              <select className="select" value={form.state || ""} onChange={e => f("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Organizations</label>
              <div className="chip-group">
                {Object.values(ORGS).map(org => {
                  const selected = (form.organizations || []).includes(org.id);
                  return (
                    <div key={org.id} className={`chip ${selected ? "selected" : ""}`}
                      onClick={() => f("organizations", selected
                        ? (form.organizations || []).filter(o => o !== org.id)
                        : [...(form.organizations || []), org.id])}>
                      {org.id}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-group"><label className="label">Bio</label>
              <textarea className="textarea" value={form.bio || ""} onChange={e => f("bio", e.target.value)} rows={2} /></div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div className="avatar avatar-lg" style={{ background: "var(--brand)", color: "white" }}>
                {initials(coachAccount?.name || "?")}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)" }}>{coachAccount?.name}</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>{coachAccount?.email}</div>
                {coachAccount?.club && <div style={{ fontSize: 13, color: "var(--slate)" }}>{coachAccount.club}</div>}
              </div>
            </div>
            {coachAccount?.specialization && <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>Specialization: {coachAccount.specialization}</div>}
            {coachAccount?.state && <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>📍 {coachAccount.state}</div>}
            {coachAccount?.organizations?.length > 0 && (
              <div className="chip-group">
                {coachAccount.organizations.map(o => (
                  <div key={o} className="chip selected" style={{ cursor: "default" }}>{o}</div>
                ))}
              </div>
            )}
            {coachAccount?.bio && <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 10, lineHeight: 1.6 }}>{coachAccount.bio}</p>}
          </div>
        )}
      </div>

      {/* Linked athletes */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Linked Twirlers ({twirlers.length})</span>
        </div>
        {twirlers.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <h3>No twirlers linked yet</h3>
            <p>Use "Invite Twirler" to send a link request to a family.</p>
          </div>
        ) : twirlers.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
            borderBottom: "1px solid var(--border)" }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "var(--brand)", color: "white" }}>
              {initials(t.firstName)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--navy)" }}>{t.firstName}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.familyName || ""}</div>
            </div>
            <span className="badge badge-green" style={{ fontSize: 10 }}>Linked</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INVITE ATHLETE PAGE ──────────────────────────────────────────────────────

// ─── CREATE COMPETITION PAGE (COACH) ─────────────────────────────────────────

function CreateCompetitionPage({ coachAccount, twirlers, supabase, setPage, coachCreateCompetition }) {
  const [form, setForm] = useState({
    name: "", date: "", location: "", venue: "", state: "", startTime: "", orgId: "", notes: ""
  });
  const [selectedTwirlers, setSelectedTwirlers] = useState(twirlers.map(t => t.id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    if (!form.name || selectedTwirlers.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await coachCreateCompetition(coachAccount.id, form, selectedTwirlers);
      setPage("competitions");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleTwirler(id) {
    setSelectedTwirlers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create Competition Invite</h1>
        <p className="page-sub">Add a competition and invite your twirlers</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="form-group">
          <label className="label">Competition name *</label>
          <input className="input" value={form.name} onChange={e => f("name", e.target.value)}
            placeholder="e.g. State Championship 2026" autoFocus />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={e => f("date", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Organization</label>
            <select className="select" value={form.orgId} onChange={e => f("orgId", e.target.value)}>
              <option value="">Select org</option>
              {Object.values(ORGS).map(o => (
                <option key={o.id} value={o.id}>{o.id} — {o.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="label">Venue name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" value={form.venue} onChange={e => f("venue", e.target.value)}
            placeholder="e.g. Denver Coliseum" />
        </div>
        <div className="form-group">
          <label className="label">Address <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" value={form.location} onChange={e => f("location", e.target.value)}
            placeholder="Street address" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">State</label>
            <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Start time <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" type="time" value={form.startTime} onChange={e => f("startTime", e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Notes</label>
          <textarea className="textarea" value={form.notes} onChange={e => f("notes", e.target.value)}
            rows={2} placeholder="Any details for families — registration deadlines, hotel info, etc." />
        </div>

        {/* Athlete selection */}
        <div className="form-group">
          <label className="label">Invite athletes *</label>
          {twirlers.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--muted)" }}>No linked twirlers yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {twirlers.map(t => (
                <div key={t.id}
                  onClick={() => toggleTwirler(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    borderRadius: 8, cursor: "pointer", border: "2px solid",
                    borderColor: selectedTwirlers.includes(t.id) ? "var(--brand)" : "var(--border)",
                    background: selectedTwirlers.includes(t.id) ? "var(--brand-light)" : "var(--bg)" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid",
                    borderColor: selectedTwirlers.includes(t.id) ? "var(--brand)" : "var(--border)",
                    background: selectedTwirlers.includes(t.id) ? "var(--brand)" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selectedTwirlers.includes(t.id) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "var(--brand)", color: "white" }}>
                    {initials(t.firstName)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{t.firstName}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.familyName || ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-warn mb-3">
            <Icon name="alert" size={14} color="var(--amber)" />
            <span style={{ fontSize: 12 }}>{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={loading || !form.name || selectedTwirlers.length === 0}
            onClick={handleSubmit}>
            {loading ? "Sending..." : `Send Invite to ${selectedTwirlers.length} twirler${selectedTwirlers.length !== 1 ? "s" : ""}`}
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("competitions")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function InviteAthletePage({ coachAccount, supabase, setPage, loadCoachData }) {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState(null); // { sent: [], existing: [], failed: [] }
  const [pendingLinks, setPendingLinks] = useState([]);
  const [pendingFamilyInvites, setPendingFamilyInvites] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [resending, setResending] = useState({});

  useEffect(() => { loadPending(); }, []);

  async function loadPending() {
    setLoadingPending(true);
    const { data: links } = await supabase
      .from('coach_athlete_links')
      .select('*, twirlers(first_name), family_accounts(parent_name, email)')
      .eq('coach_id', coachAccount.id)
      .eq('status', 'pending')
      .eq('invited_by', 'coach')
      .order('created_at', { ascending: false });
    setPendingLinks(links || []);

    // Also load family_invites for new families not yet on TwirlPower
    const { data: famInvites } = await supabase
      .from('family_invites')
      .select('*')
      .eq('coach_id', coachAccount.id)
      .eq('invite_type', 'coach')
      .is('accepted_at', null)
      .order('created_at', { ascending: false });
    setPendingFamilyInvites(famInvites || []);
    setLoadingPending(false);
  }

  function addEmails() {
    const parsed = emailInput.split(/[\s,;]+/).map(e => e.trim().toLowerCase()).filter(e => e.includes('@'));
    const unique = parsed.filter(e => !emails.includes(e));
    if (unique.length) setEmails(prev => [...prev, ...unique]);
    setEmailInput('');
  }

  async function sendInvites() {
    if (!emails.length) return;
    setSending(true);
    const sent = [], existing = [], failed = [];

    for (const email of emails) {
      try {
        // Check if family exists
        const { data: families } = await supabase
          .from('family_accounts')
          .select('id, parent_name, email')
          .eq('email', email)
          .limit(1);

        const family = families?.[0];

        if (family) {
          // Get their twirlers
          const { data: twirlers } = await supabase
            .from('twirlers')
            .select('id, first_name')
            .eq('family_id', family.id);

          if (twirlers?.length) {
            // Create pending coach_athlete_links for each twirler
            const links = twirlers.map(t => ({
              coach_id: coachAccount.id,
              twirler_id: t.id,
              family_id: family.id,
              status: 'pending',
              invited_by: 'coach',
            }));
            await supabase.from('coach_athlete_links')
              .upsert(links, { onConflict: 'coach_id,twirler_id', ignoreDuplicates: true });

            // Send connection request email
            await sendEmail('coach_link_request', family.email, {
              coachName: coachAccount.name,
              coachStudio: coachAccount.studio,
              coachOrgs: coachAccount.organizations,
              athleteName: twirlers.map(t => t.first_name).join(', '),
            });
            existing.push({ email, name: family.parent_name, twirlers: twirlers.map(t => t.first_name) });
          } else {
            // Family exists but no twirlers yet — send token invite
            const { data: invite } = await supabase.from('family_invites').insert({
              guardian_email: email,
              coach_id: coachAccount.id,
              invite_type: 'coach',
              relationship: 'Parent',
            }).select('token').single();
            const inviteUrl = invite?.token ? `https://app.twirlpower.com?invite=${invite.token}` : 'https://app.twirlpower.com';
            await sendEmail('coach_invite_new_family', email, {
              coachName: coachAccount.name, coachStudio: coachAccount.studio,
              coachOrgs: coachAccount.organizations, inviteUrl,
            });
            sent.push({ email, isNew: false });
          }
        } else {
          // New family — create token invite
          const { data: invite } = await supabase.from('family_invites').insert({
            guardian_email: email,
            coach_id: coachAccount.id,
            invite_type: 'coach',
            relationship: 'Parent',
          }).select('token').single();
          const inviteUrl = invite?.token ? `https://app.twirlpower.com?invite=${invite.token}` : 'https://app.twirlpower.com';
          await sendEmail('coach_invite_new_family', email, {
            coachName: coachAccount.name, coachStudio: coachAccount.studio,
            coachOrgs: coachAccount.organizations, inviteUrl,
          });
          sent.push({ email, isNew: true });
        }
      } catch (err) {
        failed.push(email);
      }
    }

    await loadCoachData(coachAccount.id);
    await loadPending();
    setResults({ sent, existing, failed });
    setEmails([]);
    setSending(false);
  }

  async function resendInvite(link) {
    setResending(p => ({ ...p, [link.id]: true }));
    const family = link.family_accounts;
    const twirlerName = link.twirlers?.first_name || 'your twirler';
    await sendEmail('coach_link_request', family?.email, {
      coachName: coachAccount.name, coachStudio: coachAccount.studio,
      coachOrgs: coachAccount.organizations, athleteName: twirlerName,
    });
    setResending(p => ({ ...p, [link.id]: false }));
  }

  async function cancelInvite(linkId) {
    await supabase.from('coach_athlete_links').delete().eq('id', linkId);
    setPendingLinks(prev => prev.filter(l => l.id !== linkId));
  }

  async function resendFamilyInvite(invite) {
    setResending(p => ({ ...p, [`fi-${invite.id}`]: true }));
    const inviteUrl = invite.token ? `https://app.twirlpower.com?invite=${invite.token}` : 'https://app.twirlpower.com';
    await sendEmail('coach_invite_new_family', invite.guardian_email, {
      coachName: coachAccount.name, coachStudio: coachAccount.studio,
      coachOrgs: coachAccount.organizations, inviteUrl,
    });
    setResending(p => ({ ...p, [`fi-${invite.id}`]: false }));
  }

  async function cancelFamilyInvite(inviteId) {
    await supabase.from('family_invites').delete().eq('id', inviteId);
    setPendingFamilyInvites(prev => prev.filter(i => i.id !== inviteId));
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Invite Twirlers</h1>
          <p className="page-sub">Add families to your roster by email</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage('home')}>← Back</button>
      </div>

      {results ? (
        <div>
          {results.existing.length > 0 && (
            <div className="card mb-4" style={{ borderLeft: '4px solid var(--brand)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 8 }}>
                ✓ Connection requests sent ({results.existing.length})
              </div>
              <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 10 }}>
                These families are already on TwirlPower and received a connection request:
              </p>
              {results.existing.map(r => (
                <div key={r.email} style={{ fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>
                  <strong>{r.name || r.email}</strong>
                  {r.twirlers?.length > 0 && <span style={{ color: 'var(--slate)' }}> · {r.twirlers.join(', ')}</span>}
                </div>
              ))}
            </div>
          )}
          {results.sent.length > 0 && (
            <div className="card mb-4" style={{ borderLeft: '4px solid var(--amber)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 8 }}>
                ✉️ Invites sent ({results.sent.length})
              </div>
              <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 10 }}>
                These emails aren't on TwirlPower yet. Once they sign up and add a twirler, they'll appear in your roster automatically:
              </p>
              {results.sent.map(r => (
                <div key={r.email} style={{ fontSize: 13, color: 'var(--navy)', marginBottom: 4 }}>📧 {r.email}</div>
              ))}
            </div>
          )}
          {results.failed.length > 0 && (
            <div className="card mb-4" style={{ borderLeft: '4px solid var(--red)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--red)', marginBottom: 8 }}>
                Failed ({results.failed.length})
              </div>
              {results.failed.map(e => <div key={e} style={{ fontSize: 13 }}>{e}</div>)}
            </div>
          )}
          <button className="btn btn-primary" onClick={() => setResults(null)}>Invite More</button>
        </div>
      ) : (
        <div className="card mb-6">
          <div className="section-header">
            <span className="section-title">Email Addresses</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 16, lineHeight: 1.6 }}>
            Enter one or more email addresses. Existing TwirlPower families will get a connection request. New families will get an invite link to create an account.
          </p>
          <div className="form-group">
            <label className="label">Add emails (press Enter or comma to add)</label>
            <div className="flex gap-2">
              <input className="input" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                placeholder="parent@email.com" autoFocus
                onKeyDown={e => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), addEmails())} />
              <button className="btn btn-secondary btn-sm" onClick={addEmails} disabled={!emailInput.trim()}>Add</button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Paste a comma-separated list and click Add
            </div>
          </div>

          {emails.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 8 }}>
                {emails.length} email{emails.length !== 1 ? 's' : ''} queued:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {emails.map(e => (
                  <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', background: 'var(--bg)', borderRadius: 20,
                    border: '1px solid var(--border)', fontSize: 12 }}>
                    {e}
                    <button onClick={() => setEmails(prev => prev.filter(x => x !== e))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--muted)', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="btn btn-primary" disabled={!emails.length || sending} onClick={sendInvites}>
            {sending ? 'Sending...' : `Send ${emails.length ? `to ${emails.length}` : ''} Invite${emails.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Pending Invites */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase',
          letterSpacing: '0.5px', marginBottom: 12 }}>
          Pending Invites {!loadingPending && (pendingLinks.length + pendingFamilyInvites.length) > 0 && `(${pendingLinks.length + pendingFamilyInvites.length})`}
        </div>
        {loadingPending ? (
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Loading...</div>
        ) : (pendingLinks.length + pendingFamilyInvites.length) === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
            No pending invites. Families you've invited will appear here until they accept.
          </div>
        ) : (
          <div className="flex-col gap-2">
            {pendingFamilyInvites.map(invite => (
              <div key={`fi-${invite.id}`} className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div className="avatar" style={{ background: 'var(--amber-light, #fef3c7)', color: 'var(--amber, #d97706)', flexShrink: 0 }}>
                  ✉️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {invite.guardian_email}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--amber, #d97706)' }}>
                    Awaiting signup
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Invited {fmtDate(invite.created_at)}
                  </div>
                </div>
                <div className="flex gap-2" style={{ flexShrink: 0 }}>
                  <button className="btn btn-secondary btn-sm"
                    disabled={resending[`fi-${invite.id}`]}
                    onClick={() => resendFamilyInvite(invite)}
                    style={{ fontSize: 11 }}>
                    {resending[`fi-${invite.id}`] ? '...' : 'Resend'}
                  </button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => { if (window.confirm('Cancel this invite?')) cancelFamilyInvite(invite.id); }}
                    style={{ fontSize: 11 }}>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
            {pendingLinks.map(link => {
              const family = link.family_accounts;
              const twirler = link.twirlers;
              return (
                <div key={link.id} className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ background: 'var(--brand-light)', color: 'var(--brand)', flexShrink: 0 }}>
                    {initials(twirler?.first_name || family?.parent_name || '?')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)' }}>
                      {twirler?.first_name || '—'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--slate)' }}>
                      {family?.parent_name || family?.email || 'Pending signup'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      Invited {fmtDate(link.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm"
                      disabled={resending[link.id]}
                      onClick={() => resendInvite(link)}
                      style={{ fontSize: 11 }}>
                      {resending[link.id] ? '...' : 'Resend'}
                    </button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => { if (window.confirm('Cancel this invite?')) cancelInvite(link.id); }}
                      style={{ fontSize: 11 }}>
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SetupScreen({ onComplete, onHostPath, competitionHosts, registerHost, authUser, onSignOut, isInvite }) {
  const [accountType, setAccountType] = useState(isInvite ? "family" : null); // null | "family" | "host"
  const [form, setForm] = useState({ parentName: "", email: authUser?.email || "", phone: "", state: "" });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Host login — check if already registered
  const [hostEmail, setHostEmail] = useState("");
  const [hostLookupResult, setHostLookupResult] = useState(null); // null | "found" | "not_found"

  function lookupHost() {
    const found = competitionHosts.find(h => h.email?.toLowerCase() === hostEmail.toLowerCase());
    if (found) {
      setHostLookupResult("found");
      onHostPath(found);
    } else {
      setHostLookupResult("not_found");
    }
  }

  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 72, height: 72, background: "var(--navy)", borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(13,148,136,0.25)" }}>
          <BatonIcon size={48} />
        </div>
      </div>
      <h1 className="serif" style={{ fontSize: 32, marginBottom: 6, color: "var(--navy)" }}>
        Twirl<span style={{ color: "#e11d6a" }}>Power</span>
      </h1>
      <p style={{ color: "var(--slate)", fontSize: 14, letterSpacing: "0.3px" }}>Track · Compete · Advance</p>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0a10 60%, #2d0a1a 100%)", padding: "20px" }}>

        {/* Account type chooser */}
        {!accountType && (
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px" }}>
            <Logo />
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--slate)", textAlign: "center", marginBottom: 16 }}>
              What brings you to TwirlPower?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setAccountType("family")}
                style={{ padding: "16px 20px", border: "2px solid var(--border)", borderRadius: 12,
                  background: "white", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 3 }}>👨‍👩‍👧 Family / Athlete</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>Track competitions, results, and classification progress for your twirler</div>
              </button>
              <button onClick={() => setAccountType("coach")}
                style={{ padding: "16px 20px", border: "2px solid var(--border)", borderRadius: 12,
                  background: "white", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 3 }}>🎓 Coach / Club Owner</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>Manage your twirlers, send competition invites, and manage your studio or club</div>
              </button>
              <button onClick={() => setAccountType("host")}
                style={{ padding: "16px 20px", border: "2px solid var(--border)", borderRadius: 12,
                  background: "white", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 3 }}>🏆 Competition Director</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>Post competition listings for twirlers and coaches to discover</div>
              </button>
            </div>
            <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>Already have an account? </span>
              <button onClick={onSignOut}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13,
                  color: "var(--brand)", fontWeight: 600, fontFamily: "inherit", padding: 0 }}>
                Sign out and sign in
              </button>
            </div>
          </div>
        )}
        {accountType === "coach" && (
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px", textAlign: "center" }}>
            <Logo />
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 8 }}>🎓 Coach / Club Owner Account</div>
            <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 24, lineHeight: 1.6 }}>
              Coach accounts are set up through the main sign-in screen. Please sign out and sign back in, then choose "Coach / Club Owner" during account creation.
            </p>
            <button className="btn btn-ghost w-full" onClick={() => setAccountType(null)}>← Back</button>
          </div>
        )}

        {/* Family account setup */}
        {accountType === "family" && (
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px" }}>
            <Logo />
            <div className="form-group">
              <label className="label">Parent / Guardian name</label>
              <input className="input" value={form.parentName} onChange={e => f("parentName", e.target.value)} placeholder="Your full name" autoFocus />
            </div>
            <div className="form-group">
              <label className="label">Email address</label>
              <input className="input" type="email" value={form.email}
                readOnly={!!authUser?.email}
                onChange={e => !authUser?.email && f("email", e.target.value)}
                style={{ background: authUser?.email ? "var(--bg)" : "white",
                  color: authUser?.email ? "var(--slate)" : "var(--navy)",
                  cursor: authUser?.email ? "default" : "text" }} />
              {authUser?.email && (
                <div style={{ fontSize: 11, color: "var(--green)", marginTop: 4 }}>
                  ✓ Verified — from your account
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="label">Phone number <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
              <input className="input" type="tel" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="(555) 555-5555" />
            </div>
            <div className="form-group">
              <label className="label">State <span style={{ color: "var(--muted)", fontWeight: 400 }}>(used to filter upcoming competitions)</span></label>
              <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
                <option value="">Select your state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              <Icon name="info" size={16} color="var(--brand)" />
              <span>Your account is secured with Supabase. Your competition data is currently saved on this device — cloud sync across all your devices is coming soon.</span>
            </div>
            <button className="btn btn-primary w-full" disabled={!form.parentName} onClick={() => onComplete(form)}>
              Get Started
            </button>
            <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => setAccountType(null)}>
              ← Back
            </button>
          </div>
        )}

        {/* Director login / access */}
        {accountType === "host" && (
          <HostAccessPanel
            competitionHosts={competitionHosts}
            registerHost={registerHost}
            onHostPath={onHostPath}
            onBack={() => setAccountType(null)}
          />
        )}

      </div>
    </>
  );
}

// ─── HOST ACCESS PANEL ───────────────────────────────────────────────────────
// Shown on the setup screen when user selects "Competition Director".
// Handles both returning host login (email lookup) and new host registration,
// with no family account required.

function HostAccessPanel({ competitionHosts, registerHost, onHostPath, onBack }) {
  const [step, setStep] = useState("lookup"); // "lookup" | "register"
  const [email, setEmail] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ name: "", organization: "", email: "", phone: "", state: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function lookup() {
    const found = competitionHosts.find(h => h.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      onHostPath(found);
    } else {
      setNotFound(true);
    }
  }

  function submitRegistration() {
    registerHost({ ...form });
    setSubmitted(true);
  }

  // ── Returning host lookup ──
  if (step === "lookup") {
    return (
      <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 4 }}>
            Competition Director Access
          </div>
          <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}>
            Return to your host dashboard, or register as a new host.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <div className="card-sm" style={{ background: "#f8fafc" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 10 }}>
              Already registered? Sign in with your email
            </div>
            <div className="flex gap-2">
              <input className="input" type="email" value={email}
                onChange={e => { setEmail(e.target.value); setNotFound(false); }}
                placeholder="your@email.com"
                onKeyDown={e => e.key === "Enter" && email && lookup()} />
              <button className="btn btn-primary btn-sm" disabled={!email} onClick={lookup}>
                Go
              </button>
            </div>
            {notFound && (
              <div style={{ fontSize: 12, color: "var(--red)", marginTop: 8 }}>
                No host account found for that email. Register below.
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", fontSize: 12, color: "var(--muted)" }}>— or —</div>

          <button className="btn btn-secondary w-full" onClick={() => setStep("register")}>
            Register as a new Competition Director
          </button>
        </div>

        <button className="btn btn-ghost w-full" onClick={onBack}>← Back</button>
      </div>
    );
  }

  // ── New host registration ──
  if (step === "register") {
    if (submitted) {
      return (
        <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 36px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>
            Registration submitted
          </h2>
          <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 20 }}>
            A TwirlPower admin will review your registration and approve your account. This is a one-time process — once approved you can post competitions anytime.
          </p>
          <div className="alert alert-info" style={{ textAlign: "left", marginBottom: 20 }}>
            <Icon name="info" size={15} color="var(--brand)" />
            <span style={{ fontSize: 13 }}>
              <strong>Phase 2:</strong> You'll receive an email confirmation and approval notification. The admin can reach out to verify credentials before approving.
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Come back and sign in with <strong>{form.email}</strong> once your account is approved.
          </p>
          <button className="btn btn-ghost w-full" style={{ marginTop: 16 }} onClick={onBack}>← Back to start</button>
        </div>
      );
    }

    return (
      <div className="card" style={{ maxWidth: 480, width: "100%", padding: "36px" }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setStep("lookup")}>
          ← Back
        </button>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--navy)", marginBottom: 4 }}>
          Register as a Competition Director
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20, lineHeight: 1.6 }}>
          No family account needed. Fill in your details and a TwirlPower admin will review and approve your account before it goes live.
        </p>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Your name</label>
            <input className="input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" autoFocus />
          </div>
          <div className="form-group">
            <label className="label">State</label>
            <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="label">Phone</label>
            <input className="input" type="tel" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="(555) 555-5555" />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Organization / affiliation <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" value={form.organization} onChange={e => f("organization", e.target.value)} placeholder="e.g. USTA Ohio Regional Council, ABC Twirling Club" />
        </div>
        <div className="form-group">
          <label className="label">Notes for admin <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <textarea className="textarea" rows={2} value={form.notes} onChange={e => f("notes", e.target.value)}
            placeholder="Any context about your role or why you're registering..." />
        </div>
        <div className="form-group">
          <label className="label">Supporting document <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={e => f("file", e.target.files?.[0])}
            style={{ fontSize: 12, color: "var(--slate)" }} />
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Organization credentials, event flyer, or other supporting documentation</div>
        </div>
        <div className="alert alert-info mb-4">
          <Icon name="info" size={15} color="var(--brand)" />
          <div style={{ fontSize: 12 }}>
            Your registration is reviewed by a TwirlPower admin before activation. Once approved, your access is permanent — no need to re-register.
          </div>
        </div>
        <button className="btn btn-primary w-full"
          disabled={!form.name || !form.email}
          onClick={submitRegistration}>
          Submit Registration
        </button>
      </div>
    );
  }

  return null;
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

function Sidebar({ page, setPage, twirlers, activeTwirlerId, setActiveTwirlerId, openModal, familyAccount, progress, sidebarOpen, setSidebarOpen, pendingInvites, onSignOut, darkMode, setDarkMode, isAdmin, previewRole, setPreviewRole, allNotifications, canShowInstall, onInstallClick, competitionHosts, pendingClubClaims }) {
  const pendingDirectors = (competitionHosts || []).filter(h => !h.approved).length;
  const adminTaskCount = pendingDirectors + (pendingClubClaims || 0);
  const navItems = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "competitions", label: "Competitions", icon: "trophy" },
    { id: "progress", label: "Progress Tracker", icon: "progress" },
    { id: "timeline", label: "Classification Timeline", icon: "history" },
    { id: "orgs", label: "Organizations", icon: "star" },
  ];
  const accountItems = [
    { id: "profile", label: "Family Profile", icon: "user" },
    { id: "coaches", label: "Coaches", icon: "users" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "settings", admin: true }] : []),
  ];
  const legalItems = [
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" },
  ];

  const anyAdvanceable = Object.values(progress).some(org => Object.values(org).some(e => e.shouldAdvance));

  return (
    <div className={`sidebar${sidebarOpen ? " open" : ""}`}>
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BatonIcon size={36} />
            <h1>Twirl<span style={{ color: "#e11d6a" }}>Power</span></h1>
          </div>
          <button onClick={() => setPage("notifications")}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer",
              padding: 4, color: allNotifications?.length > 0 ? "white" : "var(--slate)", display: "flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {allNotifications?.length > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14,
                background: "#e11d6a", borderRadius: "50%", fontSize: 8, fontWeight: 700,
                color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {allNotifications.length}
              </span>
            )}
          </button>
        </div>
        <p>TRACK · COMPETE · ADVANCE</p>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Twirlers</div>
        {twirlers.map(t => (
          <div key={t.id} className={`sidebar-twirler ${t.id === activeTwirlerId ? "active" : ""}`} onClick={() => { setActiveTwirlerId(t.id); setPage("home"); }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="name">{t.firstName}</div>
              {t.id === activeTwirlerId && (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
                  onClick={e => { e.stopPropagation(); setPage("profile"); }}>
                  edit
                </span>
              )}
            </div>
            <div className="sub">{t.organizations?.join(" · ") || "No orgs"}</div>
          </div>
        ))}
        <div style={{ padding: "6px 12px 8px" }}>
          <button
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", background: "rgba(59,130,246,0.2)", border: "1px dashed rgba(59,130,246,0.5)", borderRadius: 8, color: "#93c5fd", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
            onClick={() => openModal("addTwirler")}>
            <Icon name="plus" size={13} color="#93c5fd" /> Add Twirler Profile
          </button>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation</div>
        {navItems.map(item => (
          <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
            <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
            <span>{item.label}</span>
            {item.id === "home" && (anyAdvanceable || (pendingInvites && pendingInvites.length > 0)) && (
              <span className="badge badge-amber" style={{ marginLeft: "auto", fontSize: 10 }}>
                {pendingInvites && pendingInvites.length > 0 ? pendingInvites.length : "!"}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Account</div>
        {accountItems.map(item => (
          <div key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
            style={item.admin ? { borderLeft: page === item.id ? "3px solid #818cf8" : "3px solid transparent" } : {}}>
            <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
            <span style={item.admin ? { color: page === item.id ? "#a5b4fc" : "#818cf8" } : {}}>{item.label}</span>
            {item.admin && (
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                {adminTaskCount > 0 && (
                  <span style={{ background: "#ef4444", color: "white", borderRadius: 10,
                    fontSize: 9, fontWeight: 700, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>
                    {adminTaskCount}
                  </span>
                )}
                <span className="badge" style={{ fontSize: 9, background: "#312e81", color: "#a5b4fc" }}>Admin</span>
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 2 }}>{familyAccount?.parentName}</div>
        <div style={{ fontSize: 11, color: "var(--navy3)", marginBottom: 10 }}>Family Account</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {legalItems.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                  fontSize: 10, color: "var(--navy3)", textDecoration: "underline", fontFamily: "inherit" }}>
                {item.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--slate)" }}>{darkMode ? "Dark mode" : "Light mode"}</span>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, color: "var(--muted)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        {canShowInstall && (
          <button onClick={onInstallClick}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
              background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.3)",
              borderRadius: 8, color: "#5eead4", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s", marginBottom: 6 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(13,148,136,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(13,148,136,0.15)"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v13M8 11l4 4 4-4M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"/>
            </svg>
            Add to home screen
          </button>
        )}
        <button onClick={onSignOut}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "var(--muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--muted)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

function HomePage({ activeTwirler, twirlerResults, twirlerComps, progress, openModal, competitions, results, invites, coachCompetitions, coaches, respondToInvite, twirlers, familyAccount, setPage, setActiveTwirlerId, pendingCoachLinks, respondToCoachLink, guardianMode }) {
  if (!activeTwirler) return <div className="empty-state"><h3>No twirler selected</h3></div>;

  const [classifOrgFilter, setClassifOrgFilter] = useState("all");

  // Competitor's Edge — detect today's competition
  const today = new Date().toISOString().slice(0, 10);
  const todayComp = twirlerComps.find(c => c.date === today);

  // Persist edge view preference per competition so nav doesn't reset it
  const edgeKey = todayComp ? `tp_edge_view_${todayComp.id}` : null;
  const [edgeView, setEdgeView] = useState(() => {
    if (!edgeKey) return false;
    const stored = localStorage.getItem(edgeKey);
    return stored === null ? true : stored === 'true'; // default true on first visit
  });

  // When todayComp first appears (async load), set edge view from stored pref
  useEffect(() => {
    if (!todayComp || !edgeKey) return;
    const stored = localStorage.getItem(edgeKey);
    setEdgeView(stored === null ? true : stored === 'true');
  }, [todayComp?.id]);

  // Persist toggle choice
  function toggleEdgeView() {
    const next = !edgeView;
    setEdgeView(next);
    if (edgeKey) localStorage.setItem(edgeKey, String(next));
  }

  const lastComp = twirlerComps.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const lastResults = lastComp ? twirlerResults.filter(r => r.competitionId === lastComp.id) : [];
  const totalWins = twirlerResults.filter(r => r.placement === 1).length;
  const totalComps = twirlerComps.length;

  const advanceAlerts = [];
  for (const orgId of activeTwirler.organizations || []) {
    for (const [event, prog] of Object.entries(progress[orgId] || {})) {
      if (prog.shouldAdvance) advanceAlerts.push({ orgId, event, prog });
    }
  }

  const unknownFlags = [];
  for (const orgId of activeTwirler.organizations || []) {
    for (const [event, prog] of Object.entries(progress[orgId] || {})) {
      for (const w of prog.winDetails || []) {
        if (w.unknown) unknownFlags.push({ orgId, event, ...w });
      }
    }
  }

  // Onboarding checklist — shown until all steps done
  // Only show to primary family account or co-guardians (not viewers, not other account types)
  const canSeeOnboarding = !guardianMode || guardianMode === 'co-guardian';
  const mostRecentComp = twirlerComps.length > 0
    ? [...twirlerComps].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  const onboardingSteps = [
    {
      id: "orgs",
      label: "Add organizations",
      detail: "Select which orgs your twirler competes in",
      done: (activeTwirler.organizations?.length || 0) > 0,
      action: () => openModal("editTwirler"),
      actionLabel: "Edit profile",
    },
    {
      id: "comp",
      label: "Add your first competition",
      detail: "Record a competition you've attended",
      done: twirlerComps.length > 0,
      action: () => openModal("addCompetition"),
      actionLabel: "Add competition",
    },
    {
      id: "results",
      label: "Enter results",
      detail: "Add event placements to your most recent competition",
      done: twirlerResults.length > 0,
      action: () => mostRecentComp ? openModal("addResults", { competition: mostRecentComp }) : openModal("addCompetition"),
      actionLabel: mostRecentComp ? "Add results" : "Add competition first",
    },
    {
      id: "state",
      label: "Set your home state",
      detail: "Helps filter upcoming competitions near you",
      done: !!familyAccount?.state,
      action: () => setPage("profile"),
      actionLabel: "Go to profile",
    },
  ];
  const onboardingDone = onboardingSteps.filter(s => s.done).length;
  const showOnboarding = canSeeOnboarding && onboardingDone < onboardingSteps.length;

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title"><span style={{ color: "var(--brand)" }}>{activeTwirler.firstName}</span>'s {edgeView ? "Competitor's Edge" : "Dashboard"}</h1>
          <p className="page-sub">Age {getAge(activeTwirler.dob)} · {activeTwirler.organizations?.join(", ")} · {activeTwirler.club || "No club listed"}</p>
        </div>
        <div className="flex items-center gap-3">
          {todayComp && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
              background: edgeView ? "var(--brand)" : "var(--bg)",
              border: `1px solid ${edgeView ? "var(--brand)" : "var(--border)"}`,
              borderRadius: 20, cursor: "pointer", transition: "all 0.2s" }}
              onClick={() => toggleEdgeView()}>
              <span style={{ fontSize: 12, fontWeight: 600, color: edgeView ? "white" : "var(--slate)" }}>
                {edgeView ? "⚡ Competitor's Edge" : "My Dashboard"}
              </span>
              <div style={{ width: 32, height: 18, background: edgeView ? "rgba(255,255,255,0.3)" : "var(--border)",
                borderRadius: 999, position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 14, height: 14, background: "white", borderRadius: "50%",
                  position: "absolute", top: 2, left: edgeView ? 16 : 2, transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => openModal("addCompetition")}>
            <Icon name="plus" size={15} /> Add Competition
          </button>
        </div>
      </div>

      {/* ── COMPETITOR'S EDGE VIEW ── */}
      {edgeView && todayComp && (() => {
        const org = ORGS[todayComp.orgId];
        const compResults = twirlerResults.filter(r => r.competitionId === todayComp.id);
        const regularEvents = new Set(activeTwirler.regularEvents || []);
        const leveledEvents = org?.leveledEvents || [];
        const allOrgEvents = (org?.eventCategories || []).flatMap(c => c.events);

        // Events to show: regular events for this org + any other org events in profile
        const eventsToShow = [
          ...leveledEvents.filter(e => regularEvents.has(e)),
          ...allOrgEvents.filter(e => !leveledEvents.includes(e) && regularEvents.has(e)),
        ];

        // Partition into done / pending
        const doneEvents = eventsToShow.filter(e => compResults.some(r => r.event === e));
        const pendingEvents = eventsToShow.filter(e => !compResults.some(r => r.event === e));
        const orderedEvents = [...pendingEvents, ...doneEvents];

        return (
          <div>
            {/* Competition header */}
            <div className="card mb-4" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%)", border: "none" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>⚡ Competition Day</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{todayComp.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                    {fmtDate(todayComp.date)}{todayComp.location ? ` · ${todayComp.location}` : ""}
                    <span className="badge" style={{ marginLeft: 8, background: "rgba(255,255,255,0.15)", color: "white", fontSize: 10 }}>{todayComp.orgId}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: doneEvents.length === eventsToShow.length ? "var(--brand)" : "white" }}>
                    {doneEvents.length}/{eventsToShow.length}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>events logged</div>
                </div>
              </div>
              {eventsToShow.length > 0 && (
                <div style={{ marginTop: 12, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 999 }}>
                  <div style={{ height: "100%", borderRadius: 999, background: "var(--brand)",
                    width: `${Math.round((doneEvents.length / eventsToShow.length) * 100)}%`,
                    transition: "width 0.4s" }} />
                </div>
              )}
            </div>

            {/* Event cards */}
            {orderedEvents.length === 0 ? (
              <div className="card mb-4">
                <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "16px 0" }}>
                  No regular events set for {todayComp.orgId}. Add events to your profile or use the button below.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {orderedEvents.map(event => {
                  const isDone = compResults.some(r => r.event === event);
                  const result = compResults.find(r => r.event === event);
                  const prog = progress?.[todayComp.orgId]?.[event];
                  const level = prog?.currentLevel || (activeTwirler.classificationState?.[`${todayComp.orgId}__${event}`]?.level) || "Novice";

                  return (
                    <div key={event} onClick={() => !isDone && openModal("addResults", { competitionId: todayComp.id, prefillEvent: event, prefillLevel: level })}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                        background: isDone ? "#f0fdf4" : "var(--card)",
                        border: `1px solid ${isDone ? "#86efac" : "var(--border)"}`,
                        borderRadius: 10, cursor: isDone ? "default" : "pointer",
                        opacity: isDone ? 0.85 : 1, transition: "all 0.15s" }}
                      onMouseEnter={e => { if (!isDone) e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                        background: isDone ? "#dcfce7" : "var(--brand-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: isDone ? 20 : 14, fontWeight: 700,
                        color: isDone ? "#16a34a" : "var(--brand)" }}>
                        {isDone ? "✓" : event.slice(0, 2)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: isDone ? "#166534" : "var(--navy)" }}>{event}</div>
                        <div style={{ fontSize: 12, color: isDone ? "#16a34a" : "var(--slate)", marginTop: 2 }}>
                          {isDone
                            ? `${result.placement ? `${result.placement}${["st","nd","rd"][result.placement-1]||"th"} place` : "Logged"} · ${level}`
                            : `${level} · tap to log result`}
                        </div>
                      </div>
                      {!isDone && (
                        <div style={{ width: 32, height: 32, borderRadius: "50%",
                          background: "var(--brand)", display: "flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0 }}>
                          <Icon name="plus" size={14} color="white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add extra event */}
            <button className="btn btn-secondary w-full mb-6"
              onClick={() => openModal("addResults", { competitionId: todayComp.id })}>
              <Icon name="plus" size={13} /> Add Another Event
            </button>
          </div>
        );
      })()}

      {/* ── STANDARD DASHBOARD (hidden on competition day when in edge view) ── */}
      {!edgeView && <div>

      {/* ── ONBOARDING CHECKLIST ── */}
      {showOnboarding && (
        <div className="card mb-4" style={{ borderLeft: "4px solid var(--brand)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)" }}>Getting started</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>{onboardingDone} of {onboardingSteps.length} steps complete</div>
            </div>
            <div style={{ width: 80, height: 6, background: "var(--border)", borderRadius: 999 }}>
              <div style={{ width: `${(onboardingDone / onboardingSteps.length) * 100}%`, height: "100%", background: "var(--brand)", borderRadius: 999, transition: "width 0.3s" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {onboardingSteps.map(step => (
              <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                background: step.done ? "#f0fdf4" : "#f8fafc", borderRadius: 8,
                border: `1px solid ${step.done ? "#bbf7d0" : "var(--border)"}` }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: step.done ? "var(--green)" : "var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step.done
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: step.done ? 400 : 600, color: step.done ? "var(--slate)" : "var(--navy)",
                    textDecoration: step.done ? "line-through" : "none" }}>{step.label}</div>
                  {!step.done && <div style={{ fontSize: 12, color: "var(--muted)" }}>{step.detail}</div>}
                </div>
                {!step.done && (
                  <button className="btn btn-primary btn-sm" style={{ fontSize: 11, flexShrink: 0 }} onClick={step.action}>
                    {step.actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {advanceAlerts.map((a, i) => (
        <div key={i} className="alert alert-success mb-3">
          <Icon name="trophy" size={16} color="var(--green)" />
          <div>
            <strong>{a.orgId} {a.event}:</strong> {activeTwirler.firstName} has reached {a.prog.winsNeeded} wins at {a.prog.currentLevel}!
            &nbsp;<span style={{ color: "var(--slate)", fontSize: 13 }}>Eligible to advance to {a.prog.nextLevel}.</span>
            &nbsp;<button className="btn btn-sm btn-secondary" style={{ marginTop: 4 }} onClick={() => openModal("override", { twirlerId: activeTwirler.id, orgId: a.orgId, event: a.event, currentLevel: a.prog.currentLevel, nextLevel: a.prog.nextLevel })}>Advance Now</button>
          </div>
        </div>
      ))}

      {unknownFlags.slice(0, 1).map((f, i) => (
        <div key={i} className="alert alert-warn mb-3">
          <Icon name="alert" size={16} color="var(--amber)" />
          <span>Some cross-org win recognition rules are unknown. Wins are being counted by default. See Open Questions for details.</span>
        </div>
      ))}

      {/* ── PENDING COACH LINK REQUESTS ── */}
      {(pendingCoachLinks || []).filter(l => l.twirlerId === activeTwirler?.id || l.twirler_id === activeTwirler?.id).map(link => (
        <div key={link.id} className="card mb-3" style={{ borderLeft: "4px solid #818cf8", padding: "16px 20px" }}>
          <div className="flex items-start gap-3">
            <div style={{ width: 36, height: 36, background: "#e0e7ff", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
              🎓
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                Coach link request for {twirlers.find(t => t.id === link.twirlerId)?.firstName}
              </div>
              <div style={{ fontSize: 14, color: "var(--navy)", marginBottom: 2 }}>
                {link.coachName || "A coach"}{link.coachStudio ? ` · ${link.coachStudio}` : ""}
              </div>
              {link.coachOrgs?.length > 0 && (
                <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>
                  Coaches: {link.coachOrgs.join(", ")}
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={() => respondToCoachLink(link.id, true)}>
                  ✓ Accept
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => respondToCoachLink(link.id, false)}>
                  Decline
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage("notifications")}>
                  View all notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── PENDING INVITES ── */}
      {(invites || []).filter(i => i.twirlerId === activeTwirler.id && i.status === "pending").map(invite => {
        const coachComp = (coachCompetitions || []).find(c => c.id === invite.competitionId);
        const coach = (coaches || []).find(c => c.id === invite.coachId);
        if (!coachComp) return null;
        return (
          <div key={invite.id} className="card mb-3" style={{ borderLeft: "4px solid var(--purple)", padding: "16px 20px" }}>
            <div className="flex items-start gap-3">
              <div style={{ width: 36, height: 36, background: "#ede9fe", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="users" size={18} color="var(--purple)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                  Competition invite from {coach?.name || "your coach"}
                </div>
                <div style={{ fontSize: 14, color: "var(--navy)", marginBottom: 2 }}>{coachComp.name}</div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 10 }}>
                  {fmtDate(coachComp.date)}{coachComp.location ? ` · ${coachComp.location}` : ""}
                  {coachComp.orgId && <span className="badge" style={{ marginLeft: 8, background: orgColor(coachComp.orgId) + "15", color: orgColor(coachComp.orgId) }}>{coachComp.orgId}</span>}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => respondToInvite(invite.id, true)}>
                    ✓ Accept — add to my competitions
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => respondToInvite(invite.id, false)}>
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="grid-3 mb-6">
        <div className="stat-card">
          <div className="stat-label">Total Competitions</div>
          <div className="stat-value">{totalComps}</div>
          <div className="stat-sub">all time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">First Place Wins</div>
          <div className="stat-value">{totalWins}</div>
          <div className="stat-sub">across all events</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Organizations</div>
          <div className="stat-value">{activeTwirler.organizations?.length || 0}</div>
          <div className="stat-sub">{activeTwirler.organizations?.join(", ")}</div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        <div className="card">
          <div className="section-header">
            <span className="section-title">Current Classifications</span>
            {(activeTwirler.organizations || []).length > 1 && (
              <select className="select" style={{ width: "auto", fontSize: 12, padding: "4px 8px" }}
                value={classifOrgFilter} onChange={e => setClassifOrgFilter(e.target.value)}>
                <option value="all">All orgs</option>
                {(activeTwirler.organizations || []).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            )}
          </div>
          {(() => {
            const orgsToShow = (activeTwirler.organizations || [])
              .filter(o => classifOrgFilter === "all" || o === classifOrgFilter);
            const hasAnyEvents = orgsToShow.some(orgId =>
              Object.keys(progress?.[orgId] || {}).length > 0 ||
              (orgId === "USTA" && twirlerResults.some(r => CAS_EVENTS.has(r.event) && r.orgId === "USTA" && r.casPassed === true))
            );
            if (!hasAnyEvents) return (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>
                No events tracked yet. Add regular events in your twirler's profile or log a competition to see classifications here.
              </p>
            );
            return orgsToShow.map(orgId => {
              const orgEvents = Object.keys(progress?.[orgId] || {});
              const casResults = orgId === "USTA"
                ? twirlerResults.filter(r => CAS_EVENTS.has(r.event) && r.orgId === "USTA" && r.casPassed === true)
                : [];
              const hasCas = casResults.length > 0;
              if (orgEvents.length === 0 && !hasCas) return null;
              return (
                <div key={orgId} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge" style={{ background: orgColor(orgId) + "20", color: orgColor(orgId) }}>{orgId}</span>
                  </div>
                  {orgEvents.map(event => {
                    const prog = progress?.[orgId]?.[event];
                    if (!prog) return null;
                    const pct = prog.winsNeeded ? Math.min(100, Math.round((prog.winsCount / prog.winsNeeded) * 100)) : 100;
                    return (
                      <div key={event} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span style={{ fontSize: 13 }}>{event}</span>
                          <span className="badge badge-gray" style={{ fontSize: 10 }}>{prog.currentLevel}</span>
                        </div>
                        {prog.nextLevel && (
                          <>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: pct + "%", background: prog.shouldAdvance ? "var(--green)" : "var(--brand)" }} />
                            </div>
                            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{prog.winsCount}/{prog.winsNeeded} wins toward {prog.nextLevel}</div>
                          </>
                        )}
                        {!prog.nextLevel && <div style={{ fontSize: 11, color: "var(--green)" }}>Advanced level — no further advancement</div>}
                      </div>
                    );
                  })}
                  {/* CAS tracks for USTA */}
                  {hasCas && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>CAS Progress</div>
                      {["Compulsories", "Movement Technique"].map(track => {
                        const passed = casResults.filter(r => r.event === track);
                        const highestIdx = passed.reduce((max, r) => {
                          const idx = CAS_LEVELS.indexOf(r.casLevel);
                          return idx > max ? idx : max;
                        }, -1);
                        if (highestIdx < 0) return null;
                        return (
                          <div key={track} className="flex justify-between items-center mb-2">
                            <span style={{ fontSize: 13 }}>{track}</span>
                            <span className="badge badge-blue" style={{ fontSize: 10 }}>Through {CAS_LEVELS[highestIdx]}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Non-leveled regular events — shown as simple list */}
                  {(() => {
                    const leveledSet = new Set(ORGS[orgId]?.leveledEvents || []);
                    const nonLeveled = (activeTwirler.regularEvents || []).filter(e => {
                      const orgEvents = (ORGS[orgId]?.eventCategories || []).flatMap(c => c.events);
                      return orgEvents.includes(e) && !leveledSet.has(e) && !CAS_EVENTS.has(e);
                    });
                    if (nonLeveled.length === 0) return null;
                    return (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Other Regular Events</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {nonLeveled.map(e => (
                            <span key={e} className="badge badge-gray" style={{ fontSize: 11 }}>{e}</span>
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>These events don't have win-based classification levels.</div>
                      </div>
                    );
                  })()}
                </div>
              );
            });
          })()}
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">Last Competition</span>
          </div>
          {lastComp ? (
            <>
              <div className="mb-3">
                <div style={{ fontWeight: 600, fontSize: 15 }}>{lastComp.name}</div>
                <div style={{ color: "var(--slate)", fontSize: 13 }}>{fmtDate(lastComp.date)} · {lastComp.location}</div>
                <span className="badge badge-gray" style={{ marginTop: 6 }}>{lastComp.orgId}</span>
              </div>
              <div className="divider" />
              {lastResults.length === 0 ? <p style={{ color: "var(--muted)", fontSize: 13 }}>No results recorded</p> : (
                <table className="table">
                  <thead><tr><th>Event</th><th>Level</th><th>Place</th><th>Score</th></tr></thead>
                  <tbody>
                    {lastResults.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontSize: 13 }}>
                          {r.event}
                          {r.allCatch && <span className="badge badge-green" style={{ fontSize: 9, marginLeft: 4 }}>All Catch</span>}
                        </td>
                        <td><span className="badge badge-gray">{r.classificationLevelEntered}</span></td>
                        <td>
                          {CAS_EVENTS.has(r.event) ? (
                            <span className="badge" style={{
                              background: r.casPassed === true ? "#f0fdf4" : r.casPassed === false ? "#fef2f2" : "#f1f5f9",
                              color: r.casPassed === true ? "#16a34a" : r.casPassed === false ? "#dc2626" : "var(--slate)"
                            }}>
                              {r.casLevel} {r.casPassed === true ? "✓" : r.casPassed === false ? "✗" : "—"}
                            </span>
                          ) : (
                          <span className="badge" style={{ background: r.placement === 1 ? "#fef9c3" : "#f1f5f9", color: r.placement === 1 ? "#854d0e" : "var(--slate)" }}>
                            {r.placement === 1 ? "🥇" : r.placement === 2 ? "🥈" : r.placement === 3 ? "🥉" : `${r.placement}th`}
                          </span>
                          )}
                        </td>
                        <td style={{ fontSize: 12, color: "var(--slate)" }}>{r.score ? r.score.toFixed(1) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <p>No competitions yet.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => openModal("addCompetition")}>Add first competition</button>
            </div>
          )}
        </div>
      </div>

      {/* ── FAMILY SNAPSHOT — shown only when 2+ twirlers ── */}
      {twirlers.length > 1 && (
        <div className="card">
          <div className="section-header">
            <span className="section-title">Family Snapshot</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{twirlers.length} athletes</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {twirlers.map(twirler => {
              const tResults = results.filter(r => r.twirlerId === twirler.id);
              const tComps = competitions.filter(c => tResults.some(r => r.competitionId === c.id));
              const tWins = tResults.filter(r => r.placement === 1).length;
              const tProgress = calculateProgress(twirler, results);
              const isActive = twirler.id === activeTwirler.id;

              return (
                <div key={twirler.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                    borderRadius: 10, cursor: "pointer", transition: "background 0.15s",
                    background: isActive ? "var(--brand-light)" : "#f8fafc",
                    border: `1px solid ${isActive ? "rgba(13,148,136,0.3)" : "var(--border)"}` }}
                  onClick={() => setActiveTwirlerId(twirler.id)}>

                  {/* Avatar */}
                  <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? "var(--brand)" : "var(--navy3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 700, fontSize: 14 }}>
                    {initials(twirler.firstName)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)" }}>
                      {twirler.firstName}
                      {isActive && <span style={{ fontSize: 11, color: "var(--brand)", marginLeft: 8, fontWeight: 400 }}>viewing</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 1 }}>
                      Age {getAge(twirler.dob) ?? "—"}
                      {twirler.organizations?.length > 0 && <span style={{ marginLeft: 8 }}>{twirler.organizations.join(" · ")}</span>}
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "var(--navy)" }}>{tComps.length}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.3px" }}>comps</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: tWins > 0 ? "var(--amber)" : "var(--navy)" }}>{tWins}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.3px" }}>wins</div>
                    </div>
                  </div>

                  {/* Current levels mini-chips */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, maxWidth: 140 }}>
                    {(twirler.organizations || []).flatMap(orgId =>
                      (ORGS[orgId]?.leveledEvents || []).slice(0, 2).map(event => {
                        const prog = tProgress?.[orgId]?.[event];
                        if (!prog) return null;
                        return (
                          <div key={`${orgId}-${event}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 8,
                              background: orgColor(orgId) + "15", color: orgColor(orgId), fontWeight: 600 }}>{orgId}</span>
                            <span style={{ fontSize: 11, color: "var(--slate)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {event}: {prog.currentLevel}
                            </span>
                          </div>
                        );
                      }).filter(Boolean)
                    ).slice(0, 3)}
                    {(twirler.organizations || []).flatMap(o => ORGS[o]?.leveledEvents || []).length > 3 && (
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>+more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>} {/* end !edgeView */}
    </div>
  );
}

// ─── HISTORY PAGE ────────────────────────────────────────────────────────────

function CompetitionsPage(props) {
  const [tab, setTab] = useState(props.initialTab || 'history');

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid var(--border)" }}>
        {[
          { id: 'history', label: '📋 My History' },
          { id: 'upcoming', label: '📅 Upcoming' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              border: "none", background: "none", fontFamily: "inherit",
              color: tab === t.id ? "var(--brand)" : "var(--slate)",
              borderBottom: tab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
              marginBottom: -2 }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'history' && (
        <HistoryPage {...props} />
      )}
      {tab === 'upcoming' && (
        <UpcomingCompetitionsPage {...props} />
      )}
    </div>
  );
}

function HistoryPage({ activeTwirler, twirlerResults, twirlerComps, results, openModal, deleteResult, deleteCompetition, updateResult, updateCompetition, competitions, addResultsToComp }) {
  const [filterOrg, setFilterOrg] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [filterSeason, setFilterSeason] = useState("");
  const [searchText, setSearchText] = useState("");
  const [expandedComp, setExpandedComp] = useState(null);
  const [editingComp, setEditingComp] = useState(null);
  const [editingResult, setEditingResult] = useState(null);
  const [editCompForm, setEditCompForm] = useState({});
  const [editResultForm, setEditResultForm] = useState({});

  if (!activeTwirler) return <div className="empty-state"><h3>No twirler selected</h3></div>;

  function getSeason(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = d.getMonth();
    return m >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
  }

  const today = new Date().toISOString().slice(0, 10);

  const allEvents = [...new Set(twirlerResults.map(r => r.event))];
  const allSeasons = [...new Set(twirlerComps.map(c => getSeason(c.date)))].sort().reverse();
  const allOrgs = [...new Set(twirlerComps.map(c => c.orgId))];

  const applyFilters = (list) => list
    .filter(c => !filterOrg || c.orgId === filterOrg)
    .filter(c => !filterSeason || getSeason(c.date) === filterSeason)
    .filter(c => !searchText || c.name?.toLowerCase().includes(searchText.toLowerCase()) || c.location?.toLowerCase().includes(searchText.toLowerCase()));

  const upcomingComps = applyFilters(
    twirlerComps.filter(c => c.date >= today)
  ).sort((a, b) => new Date(a.date) - new Date(b.date)); // soonest first

  const pastComps = applyFilters(
    twirlerComps.filter(c => !c.date || c.date < today)
  ).sort((a, b) => new Date(b.date) - new Date(a.date)); // most recent first

  const filtered = [...upcomingComps, ...pastComps]; // for empty state check

  function renderCompCard(comp, compResults, expanded, wins, isEditingThisComp) {
    return (
      <div key={comp.id} className="card" style={{ padding: 0, overflow: "hidden",
        borderLeft: comp.date >= today && !compResults.length ? "3px solid var(--brand)" : undefined }}>

        {/* ── Competition header / edit ── */}
        {isEditingThisComp ? (
          <div style={{ padding: "16px 20px", background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>Edit Competition</div>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Name</label>
                <input className="input" value={editCompForm.name} onChange={e => setEditCompForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Date</label>
                <input className="input" type="date" value={editCompForm.date} onChange={e => setEditCompForm(p => ({ ...p, date: e.target.value }))} />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">State</label>
                <select className="select" value={editCompForm.state || ""} onChange={e => setEditCompForm(p => ({ ...p, state: e.target.value }))}>
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Start time</label>
                <input className="input" type="time" value={editCompForm.startTime || ""} onChange={e => setEditCompForm(p => ({ ...p, startTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="label">Venue name</label>
              <input className="input" value={editCompForm.venue || ""} onChange={e => setEditCompForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g. Denver Coliseum" />
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="label">Address</label>
              <input className="input" value={editCompForm.location} onChange={e => setEditCompForm(p => ({ ...p, location: e.target.value }))} placeholder="Street address" />
            </div>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Organization</label>
                <select className="select" value={editCompForm.orgId} onChange={e => setEditCompForm(p => ({ ...p, orgId: e.target.value }))}>
                  {Object.values(ORGS).map(o => <option key={o.id} value={o.id}>{o.id} — {o.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Notes</label>
                <input className="input" value={editCompForm.notes} onChange={e => setEditCompForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." />
              </div>
              <div className="form-group" style={{ marginBottom: 0, display: "flex", alignItems: "flex-end", gap: 8 }}>
                <label className="toggle" style={{ paddingBottom: 6 }}>
                  <Toggle on={editCompForm.sanctioned} onChange={v => setEditCompForm(p => ({ ...p, sanctioned: v }))} />
                  <span style={{ fontSize: 13 }}>Sanctioned</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={saveEditComp}>Save</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingComp(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between" style={{ padding: "16px 20px", cursor: "pointer" }} onClick={() => setExpandedComp(expanded ? null : comp.id)}>
            <div className="flex items-center gap-3">
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{comp.name}</div>
                <div style={{ color: "var(--slate)", fontSize: 13 }}>
                  {fmtDate(comp.date)}{comp.start_time ? ` · ${comp.start_time}` : ""}{comp.state ? ` · ${comp.state}` : ""}{comp.venue ? ` · ${comp.venue}` : ""}{comp.location ? ` · ${comp.location}` : ""}
                  {comp.notes && <span style={{ color: "var(--muted)", marginLeft: 8 }}>📝 {comp.notes}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge" style={{ background: orgColor(comp.orgId) + "15", color: orgColor(comp.orgId) }}>{comp.orgId}</span>
              {comp.sanctioned === false
                ? <span className="badge badge-warn" title="Wins may not count toward advancement">Unsanctioned ⚠</span>
                : <span className="badge badge-green" style={{ fontSize: 10 }}>Sanctioned</span>}
              {wins > 0 && <span className="badge badge-amber">{wins} win{wins !== 1 ? "s" : ""}</span>}
              <span className="badge badge-gray">{compResults.length} event{compResults.length !== 1 ? "s" : ""}</span>
              <button className="btn btn-ghost btn-sm" title="Edit competition"
                onClick={e => { e.stopPropagation(); startEditComp(comp); setExpandedComp(comp.id); }}>
                <Icon name="edit" size={13} color="var(--slate)" />
              </button>
              <button className="btn btn-ghost btn-sm" title="Delete competition"
                onClick={e => {
                  e.stopPropagation();
                  const hasResults = compResults.length > 0;
                  const msg = hasResults
                    ? `Delete "${comp.name}" and all ${compResults.length} result${compResults.length !== 1 ? "s" : ""}? This cannot be undone.`
                    : `Delete "${comp.name}"? This cannot be undone.`;
                  if (window.confirm(msg)) deleteCompetition(comp.id);
                }}>
                <Icon name="trash" size={13} color="var(--red)" />
              </button>
              <Icon name={expanded ? "chevron_down" : "chevron_right"} size={16} color="var(--muted)" />
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {expanded && !isEditingThisComp && (
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {compResults.length === 0 ? (
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>No results recorded yet.</span>
                <button className="btn btn-primary btn-sm" onClick={() => openModal("addResults", { competition: comp })}>
                  <Icon name="plus" size={13} /> Add Results
                </button>
              </div>
            ) : (
              <>
                <table className="table">
                  <thead><tr><th>Event</th><th>Level</th><th>Place</th><th>Score</th><th>Contested</th><th>Flags</th><th>Notes</th><th></th></tr></thead>
                  <tbody>
                    {compResults.map(r => {
                      const isEditingThisResult = editingResult === r.id;
                      const org = ORGS[comp.orgId];
                      const orgLevels = org?.levels || ["Novice","Beginner","Intermediate","Advanced"];
                      const flags = [];
                      if (!r.contested) flags.push({ label: "Uncontested", color: "warn" });
                      if (r.protectionRule) flags.push({ label: "Protection rule", color: "warn" });
                      if (r.isFinalRound === false) flags.push({ label: "Prelim round", color: "gray" });
                      if (r.isPageant) flags.push({ label: "Pageant", color: "gray" });
                      if (r.isTwirlOff) flags.push({ label: "Twirl-off", color: "gray" });
                      if (isEditingThisResult) {
                        return (
                          <tr key={r.id} style={{ background: "#f8fafc" }}>
                            <td colSpan={7} style={{ padding: "12px 16px" }}>
                              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Editing: {r.event}</div>
                              <div className="form-row" style={{ marginBottom: 8 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="label">Level entered</label>
                                  <select className="select" value={editResultForm.classificationLevelEntered}
                                    onChange={e => setEditResultForm(p => ({ ...p, classificationLevelEntered: e.target.value }))}>
                                    {orgLevels.map(l => <option key={l}>{l}</option>)}
                                  </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label className="label">Placement</label>
                                  <input className="input" type="number" min="1" max="99"
                                    value={editResultForm.placement}
                                    onChange={e => setEditResultForm(p => ({ ...p, placement: e.target.value }))} />
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                                <label className="toggle"><Toggle on={editResultForm.contested} onChange={v => setEditResultForm(p => ({ ...p, contested: v }))} /><span style={{ fontSize: 12 }}>Contested</span></label>
                                {!(['Strut','Super-X Strut','Fancy Strut','Basic X Strut','Box Strut','T Strut','Basic March','Military March','Parade March'].includes(editResultForm.event)) && (
                                  <label className="toggle"><Toggle on={!!editResultForm.allCatch} onChange={v => setEditResultForm(p => ({ ...p, allCatch: v }))} /><span style={{ fontSize: 12 }}>All Catch</span></label>
                                )}
                                {org?.rules?.protectionRule && <label className="toggle"><Toggle on={editResultForm.protectionRule} onChange={v => setEditResultForm(p => ({ ...p, protectionRule: v }))} /><span style={{ fontSize: 12 }}>Protection rule</span></label>}
                                {org?.rules?.finalRoundOnly && <label className="toggle"><Toggle on={editResultForm.isFinalRound !== false} onChange={v => setEditResultForm(p => ({ ...p, isFinalRound: v ? true : false }))} /><span style={{ fontSize: 12 }}>Final round</span></label>}
                                {comp.orgId === "TU" && <label className="toggle"><Toggle on={!!editResultForm.isPageant} onChange={v => setEditResultForm(p => ({ ...p, isPageant: v }))} /><span style={{ fontSize: 12 }}>Pageant</span></label>}
                                {comp.orgId === "TU" && <label className="toggle"><Toggle on={!!editResultForm.isTwirlOff} onChange={v => setEditResultForm(p => ({ ...p, isTwirlOff: v }))} /><span style={{ fontSize: 12 }}>Twirl-off</span></label>}
                              </div>
                              <div className="form-row" style={{ marginBottom: 10 }}>
                                <div className="form-group">
                                  <label className="label">Score (optional)</label>
                                  <input className="input" type="number" min="0" max="100" step="0.1"
                                    value={editResultForm.score || ""}
                                    onChange={e => setEditResultForm(p => ({ ...p, score: e.target.value }))}
                                    placeholder="e.g. 87.4" />
                                </div>
                                <div className="form-group">
                                  <label className="label">Notes</label>
                                  <input className="input" value={editResultForm.notes}
                                    onChange={e => setEditResultForm(p => ({ ...p, notes: e.target.value }))}
                                    placeholder="Optional notes..." />
                                </div>
                                <div className="form-group">
                                  <label className="label">Judge name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
                                  <input className="input" type="text" value={editResultForm.judgeNote || ""}
                                    onChange={e => setEditResultForm(p => ({ ...p, judgeNote: e.target.value }))}
                                    placeholder="e.g. Jane Smith" />
                                </div>
                              </div>
                              <div className="form-group" style={{ marginBottom: 10 }}>
                                <label className="label">Scorecard photo <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
                                {editResultForm.scorecardUrl && !editResultForm.scorecardFile ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <img src={editResultForm.scorecardUrl} alt="Scorecard"
                                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                                    <a href={editResultForm.scorecardUrl} target="_blank" rel="noopener noreferrer"
                                      style={{ fontSize: 12, color: "var(--brand)", fontWeight: 600 }}>View full size ↗</a>
                                    <button type="button" className="btn btn-ghost btn-sm"
                                      onClick={() => setEditResultForm(p => ({ ...p, scorecardUrl: null }))}>
                                      <Icon name="trash" size={12} color="var(--red)" /> Remove
                                    </button>
                                  </div>
                                ) : editResultForm.scorecardFile ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <img src={URL.createObjectURL(editResultForm.scorecardFile)} alt="New scorecard"
                                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                                    <span style={{ fontSize: 12, color: "var(--slate)" }}>{editResultForm.scorecardFile.name}</span>
                                    <button type="button" className="btn btn-ghost btn-sm"
                                      onClick={() => setEditResultForm(p => ({ ...p, scorecardFile: null }))}>
                                      <Icon name="trash" size={12} color="var(--red)" /> Remove
                                    </button>
                                  </div>
                                ) : (
                                  <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
                                    border: "1px dashed var(--border)", borderRadius: 8, cursor: "pointer",
                                    fontSize: 13, color: "var(--slate)", background: "#f8fafc", width: "fit-content" }}>
                                    <Icon name="image" size={14} color="var(--slate)" />
                                    Add scorecard photo
                                    <input type="file" accept="image/*" style={{ display: "none" }}
                                      onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) setEditResultForm(p => ({ ...p, scorecardFile: file }));
                                      }} />
                                  </label>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={saveEditResult}>Save</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditingResult(null)}>Cancel</button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={r.id}>
                          <td style={{ fontSize: 13 }}>
                            {r.event}
                            {r.allCatch && <span className="badge badge-green" style={{ fontSize: 9, marginLeft: 4 }}>All Catch</span>}
                          </td>
                          <td><span className="badge badge-gray">{r.classificationLevelEntered}</span></td>
                          <td>
                            {CAS_EVENTS.has(r.event) ? (
                              <span className="badge" style={{
                                background: r.casPassed === true ? "#f0fdf4" : r.casPassed === false ? "#fef2f2" : "#f1f5f9",
                                color: r.casPassed === true ? "#16a34a" : r.casPassed === false ? "#dc2626" : "var(--slate)"
                              }}>
                                {r.casLevel} {r.casPassed === true ? "✓" : r.casPassed === false ? "✗" : "—"}
                              </span>
                            ) : (
                            <span className="badge" style={{ background: r.placement === 1 ? "#fef9c3" : "#f1f5f9", color: r.placement === 1 ? "#854d0e" : "var(--slate)" }}>
                              {r.placement === 1 ? "1st 🥇" : r.placement === 2 ? "2nd" : r.placement === 3 ? "3rd" : `${r.placement}th`}
                            </span>
                            )}
                          </td>
                          <td style={{ fontSize: 12, color: "var(--slate)" }}>{r.score != null ? r.score.toFixed(1) : "—"}</td>
                          <td style={{ fontSize: 13 }}>{r.contested ? "Yes" : "No"}</td>
                          <td>{flags.map((f, i) => <span key={i} className={`badge badge-${f.color === "warn" ? "warn" : "gray"}`} style={{ marginRight: 4, fontSize: 10 }}>{f.label}</span>)}</td>
                          <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>
                            {r.notes ? <span title={r.notes}>📝 {r.notes.length > 30 ? r.notes.slice(0, 30) + "…" : r.notes}</span> : null}
                            {r.scorecardUrl && (
                              <a href={r.scorecardUrl} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: r.notes ? 4 : 0,
                                  fontSize: 11, color: "var(--brand)", fontWeight: 600, textDecoration: "none" }}>
                                <Icon name="image" size={11} color="var(--brand)" /> Scorecard
                              </a>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <button className="btn btn-ghost btn-sm" onClick={() => startEditResult(r)} title="Edit result">
                                <Icon name="edit" size={13} color="var(--slate)" />
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => deleteResult(r.id)} title="Remove result">
                                <Icon name="trash" size={13} color="var(--red)" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding: "10px 14px", borderTop: "1px solid #f1f5f9" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openModal("addResults", { competition: comp })}>
                    <Icon name="plus" size={13} /> Add more results to this competition
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  function startEditComp(comp) {
    setEditingComp(comp.id);
    setEditCompForm({ name: comp.name, date: comp.date, location: comp.location || "", venue: comp.venue || "", state: comp.state || "", startTime: comp.start_time || "", orgId: comp.orgId, sanctioned: comp.sanctioned !== false, notes: comp.notes || "" });
  }

  function saveEditComp() {
    updateCompetition(editingComp, { ...editCompForm, sanctioned: editCompForm.sanctioned });
    setEditingComp(null);
  }

  function startEditResult(r) {
    setEditingResult(r.id);
    setEditResultForm({
      placement: r.placement,
      classificationLevelEntered: r.classificationLevelEntered,
      contested: r.contested,
      protectionRule: !!r.protectionRule,
      isFinalRound: r.isFinalRound,
      isPageant: !!r.isPageant,
      isTwirlOff: !!r.isTwirlOff,
      notes: r.notes || "",
      score: r.score != null ? r.score : "",
      allCatch: !!r.allCatch,
      event: r.event,
      scorecardUrl: r.scorecardUrl || null,
      scorecardFile: null,
      judgeNote: r.judgeNote || "",
    });
  }

  async function saveEditResult() {
    let scorecardUrl = editResultForm.scorecardUrl;
    if (editResultForm.scorecardFile) {
      const file = editResultForm.scorecardFile;
      const ext = file.name.split('.').pop();
      const path = `scorecards/${activeTwirler.id}/${editingResult}_${Date.now()}.${ext}`;
      const { data: up } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
      if (up) {
        scorecardUrl = supabase.storage.from('documents').getPublicUrl(path).data.publicUrl;
      }
    }
    updateResult(editingResult, { ...editResultForm, placement: parseInt(editResultForm.placement), scorecardUrl });
    setEditingResult(null);
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Competition History</h1>
          <p className="page-sub">{activeTwirler.firstName} · {twirlerComps.length} competitions · {twirlerResults.filter(r => r.placement === 1).length} wins</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => exportCSV(activeTwirler, twirlerComps, twirlerResults)}>
            <Icon name="export" size={15} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => openModal("addCompetition")}>
            <Icon name="plus" size={15} /> Add Competition
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <select className="select" value={filterOrg} onChange={e => setFilterOrg(e.target.value)}>
          <option value="">All Organizations</option>
          {allOrgs.map(o => <option key={o}>{o}</option>)}
        </select>
        <select className="select" value={filterSeason} onChange={e => setFilterSeason(e.target.value)}>
          <option value="">All Seasons</option>
          {allSeasons.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="select" value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
          <option value="">All Events</option>
          {allEvents.map(e => <option key={e}>{e}</option>)}
        </select>
        <div style={{ position: "relative", flex: "1 1 140px", minWidth: 0 }}>
          <input className="input" value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search competitions..." style={{ paddingLeft: 32 }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          {searchText && (
            <button onClick={() => setSearchText("")} style={{ position: "absolute", right: 8, top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No competitions found</h3>
            <p>Add your first competition to get started.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => openModal("addCompetition")}>Add Competition</button>
          </div>
        </div>
      ) : (
        <div className="flex-col gap-3">
          {/* ── Upcoming competitions ── */}
          {upcomingComps.length > 0 && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4, marginTop: 4 }}>
              🗓 Upcoming ({upcomingComps.length})
            </div>
          )}
          {upcomingComps.map(comp => {
            const compResults = twirlerResults.filter(r => r.competitionId === comp.id).filter(r => !filterEvent || r.event === filterEvent);
            const expanded = expandedComp === comp.id;
            const wins = compResults.filter(r => r.placement === 1).length;
            const isEditingThisComp = editingComp === comp.id;
            return renderCompCard(comp, compResults, expanded, wins, isEditingThisComp);
          })}
          {/* ── Past competitions ── */}
          {pastComps.length > 0 && upcomingComps.length > 0 && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 8, marginBottom: 4 }}>
              Past competitions ({pastComps.length})
            </div>
          )}
          {pastComps.map(comp => {
            const compResults = twirlerResults.filter(r => r.competitionId === comp.id).filter(r => !filterEvent || r.event === filterEvent);
            const expanded = expandedComp === comp.id;
            const wins = compResults.filter(r => r.placement === 1).length;
            const isEditingThisComp = editingComp === comp.id;
            return renderCompCard(comp, compResults, expanded, wins, isEditingThisComp);
          })}
        </div>
      )}
    </div>
  );
}

// ── Email helper ─────────────────────────────────────────────────────────────
async function sendEmail(type, to, data) {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, data }),
    });
    if (!res.ok) console.warn('Email send failed:', await res.text());
  } catch (err) {
    console.warn('Email error:', err);
  }
}

function exportAccountBackup(familyAccount, twirlers, competitions, results, coaches) {
  const data = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    familyAccount,
    twirlers,
    competitions,
    results,
    coaches,
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TwirlPower_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAccountBackup(file, setFamilyAccount, setTwirlers, setCompetitions, setResults, setCoaches, onDone) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.version || !data.familyAccount) {
        alert("Invalid backup file. Please select a TwirlPower backup (.json) file.");
        return;
      }
      if (window.confirm("This will replace all current data with the backup. Continue?")) {
        if (data.familyAccount) setFamilyAccount(data.familyAccount);
        if (data.twirlers) setTwirlers(data.twirlers);
        if (data.competitions) setCompetitions(data.competitions);
        if (data.results) setResults(data.results);
        if (data.coaches) setCoaches(data.coaches);
        onDone();
      }
    } catch(err) {
      alert("Could not read backup file. Make sure it is a valid TwirlPower backup.");
    }
  };
  reader.readAsText(file);
}

function exportCSV(twirler, comps, results) {
  const rows = [["Competition", "Date", "Location", "Org", "Event", "Level", "Placement", "Contested", "Protection Rule"]];
  for (const comp of comps) {
    const compResults = results.filter(r => r.competitionId === comp.id);
    for (const r of compResults) {
      rows.push([comp.name, comp.date, comp.location, comp.orgId, r.event, r.classificationLevelEntered, r.placement, r.contested ? "Yes" : "No", r.protectionRule ? "Yes" : "No"]);
    }
  }
  const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${twirler.firstName}_TwirlPower_history.csv`; a.click();
}

// ─── PROGRESS PAGE ───────────────────────────────────────────────────────────

function ProgressPage({ activeTwirler, progress, openModal, updateTwirler, results, competitions }) {
  const [selectedOrg, setSelectedOrg] = useState(null);

  if (!activeTwirler) return <div className="empty-state"><h3>No twirler selected</h3></div>;

  const displayOrg = selectedOrg || activeTwirler.organizations?.[0];

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Progress Tracker</h1>
          <p className="page-sub">{activeTwirler.firstName} · Classification progress by organization and event</p>
        </div>
        <button className="btn btn-secondary btn-sm"
          onClick={() => printClassificationRecord(activeTwirler, progress, results, competitions)}>
          <Icon name="export" size={14} /> Print Record
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {activeTwirler.organizations?.map(orgId => (
          <button key={orgId} className={`btn ${displayOrg === orgId ? "btn-primary" : "btn-secondary"}`} onClick={() => setSelectedOrg(orgId)}>{orgId}</button>
        ))}
      </div>

      {displayOrg && (
        <div>
          {Object.keys(progress?.[displayOrg] || {}).length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 0" }}>
              <h3>No events tracked for {displayOrg} yet</h3>
              <p>Add regular events to {activeTwirler.firstName}'s profile or log a competition to see progress here.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => openModal("editTwirler")}>Edit Profile</button>
            </div>
          ) : Object.keys(progress?.[displayOrg] || {}).map(event => {
            const prog = progress?.[displayOrg]?.[event];
            if (!prog) return null;
            const pct = prog.winsNeeded ? Math.min(100, Math.round((prog.winsCount / prog.winsNeeded) * 100)) : 100;
            const levels = ORGS[displayOrg].levels;
            const history = (activeTwirler.classificationHistory || []).filter(h => h.orgId === displayOrg && h.event === event);

            return (
              <div key={event} className="card mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{event}</div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="badge" style={{ background: orgColor(displayOrg) + "15", color: orgColor(displayOrg) }}>{displayOrg}</span>
                        <span className="badge badge-gray">{prog.currentLevel}</span>
                        {getAgeDivision(activeTwirler.dob, displayOrg) && (
                          <span className="badge" style={{ background: "#f0fdf4", color: "#166534", fontSize: 10 }}>
                            Age div: {getAgeDivision(activeTwirler.dob, displayOrg)}
                          </span>
                        )}
                        {prog.shouldAdvance && <span className="badge badge-green">Ready to advance!</span>}
                        {prog.manualOverride && <span className="badge badge-amber">Manual override</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => openModal("override", {
                      twirlerId: activeTwirler.id, orgId: displayOrg, event, currentLevel: prog.currentLevel, nextLevel: prog.nextLevel
                    })}>
                      <Icon name="edit" size={13} /> Override
                    </button>
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <div className="level-timeline">
                      {levels.map((level, idx) => {
                        const levelIdx = levels.indexOf(prog.currentLevel);
                        const isDone = idx < levelIdx;
                        const isCurrent = idx === levelIdx;
                        const isFuture = idx > levelIdx;
                        return (
                          <div key={level} className="level-step">
                            <div className={`level-dot ${isDone ? "done" : isCurrent ? "current" : "future"}`}>
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <div style={{ paddingTop: 2 }}>
                              <div style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 400, color: isFuture ? "var(--muted)" : "var(--navy)" }}>{level}</div>
                              {isCurrent && prog.nextLevel && (
                                <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
                                  {prog.winsCount} / {prog.winsNeeded} wins · {prog.winsRemaining} remaining
                                </div>
                              )}
                              {isCurrent && !prog.nextLevel && (
                                <div style={{ fontSize: 12, color: "var(--green)", marginTop: 2 }}>Highest level achieved</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    {prog.nextLevel && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: 13, color: "var(--slate)" }}>Progress to {prog.nextLevel}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{pct}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 10 }}>
                          <div className="progress-fill" style={{ width: pct + "%", background: prog.shouldAdvance ? "var(--green)" : "var(--brand)" }} />
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                          {prog.winsCount} wins at this level · {prog.winsRemaining} more needed
                          {prog.isCumulative && (
                            <span style={{ marginLeft: 8, color: "var(--slate)" }}>
                              · {prog.totalCumulativeWins} total cumulative wins
                            </span>
                          )}
                        </div>
                        {prog.isCumulative && !prog.isSpecialAdvancement && (
                          <div className="alert alert-info" style={{ marginTop: 8, fontSize: 12, padding: "8px 12px" }}>
                            <Icon name="info" size={13} color="var(--brand)" />
                            <span>{displayOrg === "TU" ? "TU" : "DMA"} tracks cumulative wins across all levels. Wins from any organization count{displayOrg === "TU" ? ", except pageant and twirl-off wins" : ""}.</span>
                          </div>
                        )}
                        {prog.isSpecialAdvancement && (
                          <div className="alert alert-warn" style={{ marginTop: 8, fontSize: 12, padding: "8px 12px" }}>
                            <Icon name="alert" size={13} color="var(--amber)" />
                            <span>DMA Elite designation is not based on win count — it requires placing top 3 at Nationals or Mini-Nationals 4 times. Use the Override button to set this level manually.</span>
                          </div>
                        )}
                        {prog.priorWins > 0 && (
                          <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 4, display: "flex", gap: 12 }}>
                            <span>📋 {prog.priorWins} prior wins (entered at setup)</span>
                            <span>🏆 {prog.trackedWins} tracked in this app</span>
                          </div>
                        )}
                      </div>
                    )}

                    {history.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>Advancement History</div>
                        {history.map((h, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13 }}>
                            <span style={{ color: "var(--muted)", fontSize: 12 }}>{fmtDate(h.date)}</span>
                            <span className="badge badge-gray">{h.from}</span>
                            <span style={{ color: "var(--muted)" }}>→</span>
                            <span className="badge" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>{h.to}</span>
                            {h.method === "manual" && <span className="badge badge-warn" style={{ fontSize: 10 }}>manual</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {prog.winDetails?.filter(w => w.unknown).map((w, i) => (
                      <div key={i} className="alert alert-warn" style={{ marginTop: 8, fontSize: 12 }}>
                        <Icon name="alert" size={14} color="var(--amber)" />
                        <span>{w.unknownNote}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ────────────────────────────────────────────────────────────

function ProfilePage({ activeTwirler, twirlers, updateTwirler, deleteTwirler, familyAccount, setFamilyAccount, coaches, setCoaches, openModal, competitionHosts, approveHost, competitions, results, setTwirlers, setCompetitions, setResults, isAdmin, setPage, coachLinks, respondToCoachLink, authUser, supabase }) {
  const [editFamily, setEditFamily] = useState(false);
  const [editTwirler, setEditTwirler] = useState(false);
  const [fForm, setFF] = useState(familyAccount);
  const [tForm, setTF] = useState(activeTwirler || {});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [guardianForm, setGF] = useState({ name: "", email: "", phone: "", relationship: "Parent" });
  const [linkedClub, setLinkedClub] = useState(null); // club record if found in TwirlPower

  useEffect(() => { setTF(activeTwirler || {}); }, [activeTwirler]);
  useEffect(() => { setFF(familyAccount); }, [familyAccount]);

  // Look up club in TwirlPower when twirler's club name changes
  useEffect(() => {
    if (!activeTwirler?.club || !supabase) { setLinkedClub(null); return; }
    supabase.from('clubs').select('id, name, city, state, status')
      .ilike('name', activeTwirler.club)
      .neq('status', 'archived')
      .limit(1)
      .then(({ data }) => setLinkedClub(data?.[0] || null));
  }, [activeTwirler?.club]);

  // Coaches linked via new coach_athlete_links (real coach accounts)
  const linkedCoachLinks = (coachLinks || []).filter(l =>
    (l.twirlerId === activeTwirler?.id || l.twirler_id === activeTwirler?.id) && l.status === 'accepted'
  );
  // Also show old-style coaches from coaches table for backward compat
  const legacyCoaches = coaches.filter(c => c.linkedTwirlers?.includes(activeTwirler?.id));
  const additionalGuardians = familyAccount?.additionalGuardians || [];

  async function saveGuardian() {
    const newGuardian = { id: uid(), ...guardianForm };
    const updated = { ...familyAccount, additionalGuardians: [...additionalGuardians, newGuardian] };
    setFamilyAccount(updated);

    // Persist to Supabase — use family account id, not authUser id (works for co-guardians too)
    const { error } = await supabase.from('family_accounts')
      .update({ additional_guardians: updated.additionalGuardians })
      .eq('id', familyAccount.id);
    if (error) console.error('saveGuardian error:', error);

    // Create invite token in family_invites table
    if (guardianForm.email) {
      const { data: invite } = await supabase.from('family_invites').insert({
        family_id: familyAccount.id,
        guardian_name: guardianForm.name,
        guardian_email: guardianForm.email,
        guardian_phone: guardianForm.phone || null,
        relationship: guardianForm.relationship,
      }).select('token').single();

      const inviteUrl = invite?.token
        ? `https://app.twirlpower.com?invite=${invite.token}`
        : 'https://app.twirlpower.com';

      await sendEmail('family_invite', guardianForm.email, {
        inviterName: familyAccount.parentName || 'Your family',
        guardianName: guardianForm.name,
        relationship: guardianForm.relationship,
        athleteNames: twirlers.map(t => t.firstName).join(', '),
        inviteUrl,
      });
    }

    setGF({ name: "", email: "", phone: "", relationship: "Parent" });
    setShowAddGuardian(false);
  }

  async function removeGuardian(id) {
    const updated = { ...familyAccount, additionalGuardians: additionalGuardians.filter(g => g.id !== id) };
    setFamilyAccount(updated);
    const { error } = await supabase.from('family_accounts')
      .update({ additional_guardians: updated.additionalGuardians })
      .eq('user_id', authUser?.id);
    if (error) console.error('removeGuardian error:', error);
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Family Profile</h1>
        <p className="page-sub">Manage account info, twirler details, and access</p>
      </div>

      {/* ── TWIRLER SECTION ── */}
      {activeTwirler && (
        <div className="card mb-4">
          <div className="section-header">
            <span className="section-title">Twirler Profile — {activeTwirler.firstName}</span>
            {!editTwirler
              ? <button className="btn btn-ghost btn-sm" onClick={() => setEditTwirler(true)}><Icon name="edit" size={13} /> Edit</button>
              : <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={async () => {
            updateTwirler(activeTwirler.id, tForm);
            setEditTwirler(false);
            // If club changed, check if it exists as a claimed club and request membership
            if (tForm.club && tForm.club !== activeTwirler.club) {
              const { data: matchedClub } = await supabase
                .from("clubs").select("id, status, owner_coach_id")
                .eq("name", tForm.club).single();
              if (matchedClub) {
                await supabase.from("club_members").upsert({
                  club_id: matchedClub.id,
                  twirler_id: activeTwirler.id,
                  status: matchedClub.status === "claimed" ? "pending" : "active",
                }, { onConflict: "club_id,twirler_id" });
                // Notify coach if claimed
                if (matchedClub.status === "claimed" && matchedClub.owner_coach_id) {
                  const { data: coachAcc } = await supabase
                    .from("coach_accounts").select("email, name")
                    .eq("id", matchedClub.owner_coach_id).single();
                  if (coachAcc?.email) {
                    await sendEmail("club_join_request", coachAcc.email, {
                      coachName: coachAcc.name,
                      twirlerName: activeTwirler.firstName,
                      clubName: tForm.club,
                    });
                  }
                }
              }
            }
          }}>Save changes</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setTF(activeTwirler); setEditTwirler(false); }}>Cancel</button>
                </div>
            }
          </div>

          {editTwirler ? (
            <div>
              <div className="form-row">
                <div className="form-group"><label className="label">First name only</label><input className="input" value={tForm.firstName || ""} onChange={e => setTF(p => ({ ...p, firstName: e.target.value }))} /></div>
                <div className="form-group"><label className="label">Date of birth</label><input className="input" type="date" value={tForm.dob || ""} onChange={e => setTF(p => ({ ...p, dob: e.target.value }))} /></div>
              </div>
              <div className="form-group">
                <label className="label">Club</label>
                <ClubSelector value={tForm.club || ""} onChange={v => setTF(p => ({ ...p, club: v }))} supabase={supabase} />
              </div>

              <div className="form-group">
                <label className="label">Organizations</label>
                <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 6 }}>Select all organizations this athlete is a member of. This affects which classification rules apply.</div>
                <div className="chip-group">
                  {Object.values(ORGS).map(org => {
                    const selected = (tForm.organizations || []).includes(org.id);
                    return (
                      <div key={org.id} className={`chip ${selected ? "selected" : ""}`}
                        onClick={() => setTF(p => ({ ...p, organizations: selected ? (p.organizations||[]).filter(o => o !== org.id) : [...(p.organizations||[]), org.id] }))}>
                        <span style={{ fontWeight: 600 }}>{org.id}</span>
                        <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>{org.name.split(" ").slice(2).join(" ")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="label">Regular events <span style={{ fontWeight: 400, color: "var(--muted)" }}>(pre-fills result entry)</span></label>
                <GroupedEventPicker
                  orgIds={tForm.organizations || []}
                  selected={tForm.regularEvents || []}
                  onToggle={event => setTF(p => ({
                    ...p,
                    regularEvents: (p.regularEvents||[]).includes(event)
                      ? (p.regularEvents||[]).filter(e => e !== event)
                      : [...(p.regularEvents||[]), event]
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="grid-2">
              <div style={{ fontSize: 14 }}>
                <div style={{ marginBottom: 8 }}><span style={{ color: "var(--slate)" }}>Age:</span> {getAge(activeTwirler.dob) ?? "—"} <span style={{ color: "var(--muted)", fontSize: 12 }}>({fmtDate(activeTwirler.dob)})</span></div>
                {(activeTwirler.organizations || []).length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: "var(--slate)" }}>Age divisions:</span>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {(activeTwirler.organizations || []).map(orgId => {
                        const div = getAgeDivision(activeTwirler.dob, orgId);
                        if (!div) return null;
                        return (
                          <span key={orgId} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 12,
                            background: orgColor(orgId) + "15", color: orgColor(orgId) }}>
                            {orgId}: {div}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "var(--slate)" }}>Club:</span>{" "}
                  {activeTwirler.club ? (
                    linkedClub ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 500, color: "var(--navy)" }}>{activeTwirler.club}</span>
                        <span className="badge badge-green" style={{ fontSize: 9 }}>In TwirlPower</span>
                        {linkedClub.city && (
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>
                            {[linkedClub.city, linkedClub.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: "var(--navy)" }}>{activeTwirler.club}</span>
                    )
                  ) : (
                    <span style={{ color: "var(--muted)" }}>Not set</span>
                  )}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "var(--slate)" }}>Organizations:</span>
                  <div className="flex gap-2 mt-1">
                    {activeTwirler.organizations?.length
                      ? activeTwirler.organizations.map(o => <span key={o} className="badge" style={{ background: orgColor(o) + "15", color: orgColor(o) }}>{o}</span>)
                      : <span style={{ color: "var(--red)", fontSize: 13 }}>⚠ No organizations set — click Edit to add</span>}
                  </div>
                </div>
                <div>
                  <span style={{ color: "var(--slate)" }}>Regular events:</span>
                  <div className="chip-group mt-1">
                    {activeTwirler.regularEvents?.length
                      ? activeTwirler.regularEvents.map(e => <span key={e} className="badge badge-gray">{e}</span>)
                      : <span style={{ color: "var(--muted)", fontSize: 13 }}>None set</span>}
                  </div>
                </div>
              </div>
              <div>
                {(linkedCoachLinks.length > 0 || legacyCoaches.length > 0) ? (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coaches with access</div>
                    {linkedCoachLinks.map(l => (
                      <div key={l.id} className="flex items-center gap-2 mb-2">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "#ede9fe", color: "#6d28d9" }}>{initials(l.coachName || "?")}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{l.coachName}</div>
                          {l.coachEmail && <div style={{ fontSize: 11, color: "var(--slate)" }}>{l.coachEmail}</div>}
                          {l.coachStudio && <div style={{ fontSize: 11, color: "var(--muted)" }}>{l.coachStudio}</div>}
                        </div>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => { if (window.confirm(`Remove ${l.coachName} as a coach for ${activeTwirler?.firstName}?`)) respondToCoachLink(l.id, false); }}
                          style={{ fontSize: 11, padding: "3px 8px" }}>
                          Remove
                        </button>
                      </div>
                    ))}
                    {legacyCoaches.map(c => (
                      <div key={c.id} className="flex items-center gap-2 mb-2">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "#ede9fe", color: "#6d28d9" }}>{initials(c.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                          {c.email && <div style={{ fontSize: 11, color: "var(--slate)" }}>{c.email}</div>}
                        </div>
                        <span className="badge badge-gray" style={{ fontSize: 10 }}>Legacy</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>No coaches linked yet.</div>
                )}
              </div>
            </div>
          )}

          <div className="divider" />
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-secondary btn-sm" onClick={() => openModal("historicalData", { twirler: activeTwirler })}>
              <Icon name="history" size={13} /> Set starting classifications
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={13} /> Delete this twirler profile
            </button>
          </div>
        </div>
      )}

      {/* ── FAMILY ACCOUNT ── */}
      <div className="card mb-4">
        <div className="section-header">
          <span className="section-title">Parents & Guardians</span>
          {!editFamily
            ? <button className="btn btn-ghost btn-sm" onClick={() => setEditFamily(true)}><Icon name="edit" size={13} /> Edit</button>
            : <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={async () => {
                  setFamilyAccount(fForm); // optimistic
                  setEditFamily(false);
                  await supabase.from('family_accounts').update({
                    parent_name: fForm.parentName,
                    email: fForm.email,
                    phone: fForm.phone || null,
                    state: fForm.state || null,
                    relationship: fForm.relationship || 'Parent',
                  }).eq('id', fForm.id);
                }}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setFF(familyAccount); setEditFamily(false); }}>Cancel</button>
              </div>
          }
        </div>

        {/* Primary guardian */}
        <div className="flex items-start gap-3 mb-4">
          <div className="avatar avatar-lg" style={{ background: "#dbeafe", color: "#1d4ed8" }}>{initials(familyAccount.parentName)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Primary Parent or Guardian</div>
            {editFamily ? (
              <>
                <div className="form-row">
                  <div className="form-group"><label className="label">Name</label><input className="input" value={fForm.parentName||""} onChange={e => setFF(p => ({...p, parentName: e.target.value}))} /></div>
                  <div className="form-group"><label className="label">Relationship</label>
                    <select className="select" value={fForm.relationship||"Parent"} onChange={e => setFF(p => ({...p, relationship: e.target.value}))}>
                      <option>Parent</option><option>Guardian</option><option>Grandparent</option><option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={fForm.email||""} onChange={e => setFF(p => ({...p, email: e.target.value}))} /></div>
                  <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" value={fForm.phone||""} onChange={e => setFF(p => ({...p, phone: e.target.value}))} /></div>
                </div>
                <div className="form-group">
                  <label className="label">State <span style={{ fontWeight: 400, color: "var(--muted)" }}>(used to filter upcoming competitions)</span></label>
                  <select className="select" value={fForm.state||""} onChange={e => setFF(p => ({...p, state: e.target.value}))}>
                    <option value="">Select state</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{familyAccount.parentName} <span style={{ fontWeight: 400, color: "var(--slate)", fontSize: 12 }}>({familyAccount.relationship || "Parent"})</span></div>
                {familyAccount.email && <div style={{ color: "var(--slate)", fontSize: 13 }}>📧 {familyAccount.email}</div>}
                {familyAccount.phone && <div style={{ color: "var(--slate)", fontSize: 13 }}>📞 {familyAccount.phone}</div>}
                {familyAccount.state && <div style={{ color: "var(--slate)", fontSize: 13 }}>📍 {familyAccount.state}</div>}
                {!familyAccount.state && <div style={{ color: "var(--red)", fontSize: 13 }}>⚠ No state set — click Edit to add (helps filter upcoming competitions)</div>}
              </div>
            )}
          </div>
        </div>

        {/* Additional guardians */}
        {additionalGuardians.map(g => (
          <div key={g.id} className="flex items-start gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="avatar" style={{ background: "#f0fdf4", color: "#166534" }}>{initials(g.name)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{g.relationship}</div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{g.name}</div>
              {g.email && <div style={{ color: "var(--slate)", fontSize: 13 }}>📧 {g.email}</div>}
              {g.phone && <div style={{ color: "var(--slate)", fontSize: 13 }}>📞 {g.phone}</div>}
            </div>
            <div className="flex gap-2" style={{ flexShrink: 0 }}>
              {g.email && (
                g.confirmed ? (
                  <span className="badge badge-green" style={{ fontSize: 10, alignSelf: "center" }}>✓ Joined</span>
                ) : (
                  <button className="btn btn-secondary btn-sm"
                    onClick={async () => {
                      // Create a fresh invite token
                      const { data: invite } = await supabase.from('family_invites').insert({
                        family_id: familyAccount.id,
                        guardian_name: g.name,
                        guardian_email: g.email,
                        guardian_phone: g.phone || null,
                        relationship: g.relationship,
                      }).select('token').single();
                      const inviteUrl = invite?.token
                        ? `https://app.twirlpower.com?invite=${invite.token}`
                        : 'https://app.twirlpower.com';
                      await sendEmail("family_invite", g.email, {
                        inviterName: familyAccount?.parentName || "Your family",
                        guardianName: g.name,
                        relationship: g.relationship,
                        athleteNames: twirlers.map(t => t.firstName).join(", "),
                        inviteUrl,
                      });
                      alert(`Invite resent to ${g.email}`);
                    }}
                    style={{ fontSize: 11, padding: "4px 10px" }}>
                    Re-invite
                  </button>
                )
              )}
              <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm(`Remove ${g.name} from this family account?`)) removeGuardian(g.id); }}
                style={{ fontSize: 11, padding: "4px 10px" }}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Add guardian form */}
        {showAddGuardian ? (
          <div className="card-sm" style={{ background: "#f8fafc", marginTop: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Add another guardian</div>
            <div className="form-row">
              <div className="form-group"><label className="label">Name</label><input className="input" value={guardianForm.name} onChange={e => setGF(p => ({...p, name: e.target.value}))} placeholder="Full name" /></div>
              <div className="form-group"><label className="label">Relationship</label>
                <select className="select" value={guardianForm.relationship} onChange={e => setGF(p => ({...p, relationship: e.target.value}))}>
                  <option>Parent</option><option>Guardian</option><option>Grandparent</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={guardianForm.email} onChange={e => setGF(p => ({...p, email: e.target.value}))} placeholder="guardian@email.com" />
                {guardianForm.email && !guardianForm.email.includes('@') && (
                  <div style={{ fontSize: 11, color: "var(--red)", marginTop: 3 }}>Please enter a valid email address</div>
                )}
              </div>
              <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" value={guardianForm.phone} onChange={e => setGF(p => ({...p, phone: e.target.value}))} /></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" disabled={!guardianForm.name || (guardianForm.email && !guardianForm.email.includes('@'))} onClick={saveGuardian}>Add Guardian</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddGuardian(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 4 }} onClick={() => setShowAddGuardian(true)}>
            <Icon name="plus" size={13} /> Add another parent / guardian
          </button>
        )}
      </div>

      {/* ── COACH CONTACT VISIBILITY NOTE ── */}
      {(linkedCoachLinks.length > 0 || legacyCoaches.length > 0) && (
        <div className="alert alert-info mb-4">
          <Icon name="info" size={16} color="var(--blue)" />
          <div>
            <strong>Contact visibility:</strong> Coaches linked to {activeTwirler?.firstName + "'s"} profile can see your guardian contact information. You can see their contact info on the <strong>Coaches</strong> page.
          </div>
        </div>
      )}

      <ConfirmModal open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={() => deleteTwirler(activeTwirler?.id)} title="Delete Twirler Profile"
        message={`Are you sure you want to delete ${activeTwirler?.firstName}'s profile? All competition history and progress data will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Profile" danger />

      {/* ── BACKUP & RESTORE ── */}
      <BackupSection familyAccount={familyAccount} twirlers={twirlers} competitions={competitions} results={results} coaches={coaches} setFamilyAccount={setFamilyAccount} setTwirlers={setTwirlers} setCompetitions={setCompetitions} setResults={setResults} setCoaches={setCoaches} />

      {/* ── ADMIN SECTION ── */}
      {isAdmin && (
        <div className="card mt-4" style={{ borderTop: "3px solid #818cf8" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#4338ca" }}>TwirlPower Admin</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>You have admin access to this account.</div>
            </div>
            <button className="btn btn-sm" onClick={() => setPage("admin")}
              style={{ background: "#e0e7ff", color: "#4338ca", border: "none" }}>
              Go to Admin Panel →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BACKUP SECTION ──────────────────────────────────────────────────────────

function BackupSection({ familyAccount, twirlers, competitions, results, coaches, setFamilyAccount, setTwirlers, setCompetitions, setResults, setCoaches }) {
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef();

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    importAccountBackup(file, setFamilyAccount, setTwirlers, setCompetitions, setResults, setCoaches, () => {
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    });
    e.target.value = "";
  }

  const totalItems = twirlers.length + competitions.length + results.length;

  return (
    <div className="card mt-4">
      <div className="section-header">
        <span className="section-title">Backup & Restore</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16, lineHeight: 1.6 }}>
        Export all your data as a JSON file you can keep as a backup or restore on another device. Includes all twirlers, competition history, results, and coaches.
      </p>
      <div style={{ background: "var(--bg)", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "var(--slate)" }}>
        📦 {twirlers.length} twirler{twirlers.length !== 1 ? "s" : ""} · {competitions.length} competition{competitions.length !== 1 ? "s" : ""} · {results.length} result{results.length !== 1 ? "s" : ""} · {coaches.length} coach{coaches.length !== 1 ? "es" : ""}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary btn-sm"
          onClick={() => exportAccountBackup(familyAccount, twirlers, competitions, results, coaches)}>
          <Icon name="export" size={14} /> Export Backup
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
          📂 Restore from Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />
      </div>
      {importSuccess && (
        <div className="alert alert-success" style={{ marginTop: 12 }}>
          <Icon name="check" size={14} color="var(--green)" />
          <span>Backup restored successfully.</span>
        </div>
      )}
      <div className="alert alert-warn" style={{ marginTop: 12 }}>
        <Icon name="alert" size={14} color="var(--amber)" />
        <span style={{ fontSize: 12 }}>Restoring a backup replaces all current data. Export a fresh backup first if you want to keep your current data.</span>
      </div>
    </div>
  );
}

// ─── CLASSIFICATION TIMELINE PAGE ─────────────────────────────────────────────

function ClassificationTimelinePage({ activeTwirler, twirlers, progress, results, competitions }) {
  const [selectedTwirler, setSelectedTwirler] = useState(activeTwirler?.id);

  const twirler = twirlers.find(t => t.id === selectedTwirler) || activeTwirler;
  if (!twirler) return <div className="empty-state"><h3>No twirler selected</h3></div>;

  // Build a unified chronological timeline from classificationHistory
  const history = (twirler.classificationHistory || [])
    .map(h => ({ ...h, type: "advancement" }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Also pull first-place wins for context
  const wins = results
    .filter(r => r.twirlerId === twirler.id && r.placement === 1)
    .map(r => {
      const comp = competitions.find(c => c.id === r.competitionId);
      return { ...r, compName: comp?.name, compDate: comp?.date, type: "win" };
    })
    .sort((a, b) => new Date(b.compDate) - new Date(a.compDate));

  // Current classifications snapshot
  const orgs = twirler.organizations || [];

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Classification Timeline</h1>
          <p className="page-sub">Complete history of level advancements across all organizations</p>
        </div>
        {twirlers.length > 1 && (
          <div className="flex gap-2">
            {twirlers.map(t => (
              <button key={t.id}
                className={`btn btn-sm ${selectedTwirler === t.id ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSelectedTwirler(t.id)}>
                {t.firstName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current classification snapshot */}
      <div className="card mb-4">
        <div className="section-header">
          <span className="section-title">Current Classifications — {twirler.firstName}</span>
        </div>
        {orgs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>No organizations on profile yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orgs.map(orgId => (
              <div key={orgId}>
                <div style={{ fontSize: 11, fontWeight: 700, color: orgColor(orgId), textTransform: "uppercase",
                  letterSpacing: "0.5px", marginBottom: 6 }}>{orgId} — {ORGS[orgId]?.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(ORGS[orgId]?.leveledEvents || []).map(event => {
                    const prog = progress?.[orgId]?.[event];
                    if (!prog) return null;
                    return (
                      <div key={event} style={{ padding: "6px 12px", borderRadius: 8,
                        background: prog.shouldAdvance ? "#dcfce7" : "var(--bg)",
                        border: `1px solid ${prog.shouldAdvance ? "#86efac" : "var(--border)"}` }}>
                        <div style={{ fontSize: 12, color: "var(--slate)" }}>{event}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: prog.shouldAdvance ? "var(--green)" : "var(--navy)" }}>
                          {prog.currentLevel}
                          {prog.shouldAdvance && <span style={{ fontSize: 11, marginLeft: 4 }}>→ {prog.nextLevel}</span>}
                        </div>
                        {prog.nextLevel && (
                          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                            {prog.winsCount}/{prog.winsNeeded} wins
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* CAS tracks for USTA */}
                  {orgId === "USTA" && (() => {
                    const casResults = (results || []).filter(r => r.twirlerId === twirler.id && CAS_EVENTS.has(r.event) && r.orgId === "USTA" && r.casPassed === true);
                    return ["Compulsories", "Movement Technique"].map(track => {
                      const passed = casResults.filter(r => r.event === track);
                      const highestIdx = passed.reduce((max, r) => {
                        const idx = CAS_LEVELS.indexOf(r.casLevel);
                        return idx > max ? idx : max;
                      }, -1);
                      if (highestIdx < 0) return null;
                      return (
                        <div key={track} style={{ padding: "6px 12px", borderRadius: 8,
                          background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                          <div style={{ fontSize: 12, color: "var(--slate)" }}>{track}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8" }}>
                            Through {CAS_LEVELS[highestIdx]}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>CAS evaluation</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="card mb-4">
        <div className="section-header">
          <span className="section-title">Advancement History</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{history.length} level change{history.length !== 1 ? "s" : ""}</span>
        </div>
        {history.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <h3>No advancements recorded yet</h3>
            <p>Level changes will appear here as wins are tracked and classifications are updated.</p>
          </div>
        ) : (
          <div className="level-timeline">
            {history.map((h, i) => (
              <div key={i} className="level-step">
                <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: orgColor(h.orgId), display: "flex", alignItems: "center",
                  justifyContent: "center", border: `2px solid ${orgColor(h.orgId)}` }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)" }}>
                      {h.event} — {h.orgId}
                    </span>
                    <span className="badge badge-gray" style={{ fontSize: 10 }}>{h.from}</span>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>→</span>
                    <span className="badge" style={{ fontSize: 10, background: orgColor(h.orgId) + "15", color: orgColor(h.orgId) }}>{h.to}</span>
                    {h.method === "manual" && (
                      <span className="badge badge-warn" style={{ fontSize: 10 }}>manual override</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {fmtDate(h.date)}
                    {h.reason && <span style={{ marginLeft: 8, fontStyle: "italic" }}>{h.reason}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent wins */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Recent First-Place Wins</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{wins.length} total</span>
        </div>
        {wins.length === 0 ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <h3>No wins recorded yet</h3>
            <p>First-place results will appear here as you enter competition results.</p>
          </div>
        ) : (
          <div>
            {wins.slice(0, 20).map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: i < Math.min(wins.length, 20) - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fef9c3",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  🥇
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--navy)" }}>
                    {w.event}
                    <span className="badge badge-gray" style={{ marginLeft: 8, fontSize: 10 }}>{w.classificationLevelEntered}</span>
                    <span className="badge" style={{ marginLeft: 4, fontSize: 10, background: orgColor(w.orgId || "") + "15", color: orgColor(w.orgId || "") }}>{w.orgId}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {w.compName} · {fmtDate(w.compDate)}
                  </div>
                </div>
              </div>
            ))}
            {wins.length > 20 && (
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, textAlign: "center" }}>
                Showing 20 of {wins.length} wins — use Competition History for full view
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ──────────────────────────────────────────────────────────────

function AdminPage({ activeTwirler, twirlers, competitions, results, coaches, familyAccount, competitionHosts, approveHost, supabase, isAdmin, setPage, previewRole, setPreviewRole }) {
  const [tab, setTab] = useState("hosts");

  const pendingHosts = (competitionHosts || []).filter(h => !h.approved);
  const approvedHosts = (competitionHosts || []).filter(h => h.approved);

  const tabs = [
    { id: "hosts", label: `Director Approvals${pendingHosts.length > 0 ? ` (${pendingHosts.length})` : ""}` },
    { id: "clubs", label: "Clubs" },
    { id: "accounts", label: "Accounts" },
    { id: "data", label: "Data Overview" },
  ];

  const roles = [
    { id: "family", label: "👨‍👩‍👧 Family", desc: "Standard family account view" },
    { id: "coach", label: "🎓 Coach", desc: "Coach account view (Phase 2)" },
    { id: "host", label: "📅 Director", desc: "Competition Director view" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="page-sub">Manage accounts, hosts, and app settings</p>
          </div>
          <span className="badge" style={{ background: "#e0e7ff", color: "#4338ca", fontSize: 11 }}>Admin</span>
        </div>
      </div>

      {/* ── ROLE PREVIEW ── */}
      <div className="card mb-4">
        <div className="section-header" style={{ marginBottom: 12 }}>
          <span className="section-title">Preview as Role</span>
          {previewRole && (
            <button className="btn btn-sm btn-secondary" onClick={() => setPreviewRole(null)}>
              ✕ Exit preview
            </button>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14, lineHeight: 1.6 }}>
          Switch to a different role view to see what families, coaches, and hosts experience. Your admin access is always one click away.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {roles.map(r => (
            <div key={r.id}
              onClick={() => { setPreviewRole(previewRole === r.id ? null : r.id); setPage("home"); }}
              style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", border: "2px solid",
                borderColor: previewRole === r.id ? "var(--brand)" : "var(--border)",
                background: previewRole === r.id ? "var(--brand-light)" : "var(--bg)",
                transition: "all 0.15s", minWidth: 140 }}>
              <div style={{ fontSize: 15, marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontSize: 11, color: "var(--slate)" }}>{r.desc}</div>
              {previewRole === r.id && (
                <div style={{ fontSize: 10, color: "var(--brand)", fontWeight: 700, marginTop: 4 }}>● ACTIVE PREVIEW</div>
              )}
            </div>
          ))}
        </div>
        {previewRole && (
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            <Icon name="info" size={14} color="var(--brand)" />
            <span style={{ fontSize: 12 }}>
              You're previewing the <strong>{previewRole}</strong> view. Navigate the sidebar to see what {previewRole}s experience.
              Click "Exit preview" above or visit Admin again to return to your normal view.
            </span>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="card">
        <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                background: "none", fontFamily: "inherit",
                color: tab === t.id ? "var(--brand)" : "var(--slate)",
                borderBottom: tab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
                marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* HOST APPROVALS */}
        {tab === "hosts" && (
          <div>
            <div className="alert alert-info mb-4">
              <Icon name="info" size={14} color="var(--brand)" />
              <span style={{ fontSize: 12 }}>Once approved, directors retain access permanently. Phase 2: approval notifications via email.</span>
            </div>
            {pendingHosts.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>✓ No pending director approvals.</div>
            )}
            {pendingHosts.length > 0 && (
              <div className="mb-4">
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  ⏳ Pending ({pendingHosts.length})
                </div>
                {pendingHosts.map(h => (
                  <div key={h.id} className="card-sm mb-2" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <div className="flex items-start gap-3">
                      <div className="avatar" style={{ background: "#fef3c7", color: "#92400e" }}>{initials(h.name)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{h.name}</div>
                        {h.organization && <div style={{ fontSize: 12, color: "var(--slate)" }}>🏆 {h.organization}</div>}
                        {h.email && <div style={{ fontSize: 12, color: "var(--slate)" }}>📧 {h.email}</div>}
                        {h.phone && <div style={{ fontSize: 12, color: "var(--slate)" }}>📞 {h.phone}</div>}
                        {h.state && <div style={{ fontSize: 12, color: "var(--slate)" }}>📍 {h.state}</div>}
                        {h.notes && <div style={{ fontSize: 12, color: "var(--slate)", fontStyle: "italic", marginTop: 4 }}>"{h.notes}"</div>}
                        {h.document_url && (
                          <a href={h.document_url} target="_blank" rel="noreferrer"
                            style={{ fontSize: 12, color: "var(--brand)", display: "inline-block", marginTop: 4 }}>
                            📎 View attached document
                          </a>
                        )}
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Registered {fmtDate(h.createdAt)}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => approveHost(h.id)}>✓ Approve</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Delete director registration for ${h.name}?`)) {
                              supabase.from("competition_hosts").delete().eq("id", h.id);
                            }
                          }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {approvedHosts.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  ✓ Approved Directors ({approvedHosts.length})
                </div>
                {approvedHosts.map(h => (
                  <div key={h.id} className="flex items-center gap-3 mb-2" style={{ padding: "10px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: "#bbf7d0", color: "#166534" }}>{initials(h.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{[h.organization, h.email, h.state].filter(Boolean).join(" · ")}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="badge badge-green" style={{ fontSize: 10 }}>Approved</span>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (window.confirm(`Revoke director access for ${h.name}?`)) {
                            supabase.from("competition_hosts").update({ approved: false }).eq("id", h.id);
                          }
                        }}
                        style={{ fontSize: 10, padding: "2px 8px" }}>Revoke</button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`Delete director registration for ${h.name}? This cannot be undone.`)) {
                            supabase.from("competition_hosts").delete().eq("id", h.id);
                          }
                        }}
                        style={{ fontSize: 10, padding: "2px 8px" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STUDIOS */}
        {tab === "clubs" && (
          <ClubAdminTab supabase={supabase} />
        )}

        {/* ACCOUNTS */}
        {tab === "accounts" && (
          <AccountsTab supabase={supabase} currentFamilyAccount={familyAccount} twirlers={twirlers} />
        )}

        {/* DATA OVERVIEW */}
        {tab === "data" && (
          <DataOverviewTab supabase={supabase} competitionHosts={competitionHosts} pendingHosts={pendingHosts} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

// ─── STUDIO ADMIN TAB ────────────────────────────────────────────────────────

function ClubAdminTab({ supabase }) {
  const [claims, setClaims] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null); // club object
  const [deleteInput, setDeleteInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | claimed | unclaimed | archived

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("club_claim_requests")
          .select("*, clubs(name, city, state, status), coach_accounts(name, email)")
          .order("created_at", { ascending: false }),
        supabase.from("clubs").select("*").order("created_at", { ascending: false }),
      ]);
      setClaims(c || []);
      setClubs(s || []);
      setLoading(false);
    }
    load();
  }, []);

  async function approveClaim(claim) {
    setWorking(p => ({ ...p, [claim.id]: true }));
    await supabase.from("club_claim_requests").update({ status: "approved" }).eq("id", claim.id);
    await supabase.from("clubs").update({
      status: "claimed", owner_coach_id: claim.coach_id,
    }).eq("id", claim.club_id);
    await supabase.from("club_coaches").upsert({
      club_id: claim.club_id, coach_id: claim.coach_id,
      role: "owner", status: "active",
    }, { onConflict: "club_id,coach_id" });
    await sendEmail("club_claim_approved", claim.coach_accounts?.email, {
      coachName: claim.coach_accounts?.name, clubName: claim.clubs?.name,
    });
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: "approved" } : c));
    setClubs(prev => prev.map(s => s.id === claim.club_id ? { ...s, status: "claimed" } : s));
    setWorking(p => ({ ...p, [claim.id]: false }));
  }

  async function denyClaim(claim) {
    if (!window.confirm(`Deny claim request from ${claim.coach_accounts?.name}?`)) return;
    setWorking(p => ({ ...p, [claim.id]: true }));
    await supabase.from("club_claim_requests").update({ status: "denied" }).eq("id", claim.id);
    await sendEmail("club_claim_denied", claim.coach_accounts?.email, {
      coachName: claim.coach_accounts?.name, clubName: claim.clubs?.name,
    });
    setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: "denied" } : c));
    setWorking(p => ({ ...p, [claim.id]: false }));
  }

  async function archiveClub(club) {
    if (!window.confirm(`Archive "${club.name}"? It will be hidden from all users but data will be preserved.`)) return;
    setWorking(p => ({ ...p, [club.id]: "archiving" }));
    await supabase.from("clubs").update({ status: "archived" }).eq("id", club.id);
    setClubs(prev => prev.map(c => c.id === club.id ? { ...c, status: "archived" } : c));
    setWorking(p => ({ ...p, [club.id]: false }));
  }

  async function reactivateClub(club) {
    if (!window.confirm(`Reactivate "${club.name}"? It will become visible and claimable again.`)) return;
    setWorking(p => ({ ...p, [club.id]: "reactivating" }));
    await supabase.from("clubs").update({ status: "claimed" }).eq("id", club.id);
    setClubs(prev => prev.map(c => c.id === club.id ? { ...c, status: "claimed" } : c));
    setWorking(p => ({ ...p, [club.id]: false }));
  }

  async function deleteClub() {
    if (!confirmDelete || deleteInput !== confirmDelete.name) return;
    setWorking(p => ({ ...p, [confirmDelete.id]: "deleting" }));
    await supabase.from("clubs").delete().eq("id", confirmDelete.id);
    setClubs(prev => prev.filter(c => c.id !== confirmDelete.id));
    setConfirmDelete(null);
    setDeleteInput("");
    setWorking(p => ({ ...p, [confirmDelete?.id]: false }));
  }

  if (loading) return <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>Loading...</div>;

  const pending = claims.filter(c => c.status === "pending");
  const resolved = claims.filter(c => c.status !== "pending");

  const statusColor = { claimed: "var(--green)", unclaimed: "var(--slate)", pending_claim: "var(--amber)", archived: "var(--muted)" };
  const statusBadge = s => {
    const colors = { claimed: "badge-green", unclaimed: "badge-gray", pending_claim: "badge-amber", archived: "badge-gray" };
    return <span className={`badge ${colors[s] || "badge-gray"}`} style={{ fontSize: 10 }}>{s}</span>;
  };

  const filteredClubs = clubs.filter(c => filter === "all" || c.status === filter);

  return (
    <div>
      {/* Pending claims */}
      {pending.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
            ⏳ Pending Claims ({pending.length})
          </div>
          {pending.map(c => (
            <div key={c.id} className="card-sm mb-2" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <div className="flex items-start gap-3">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.clubs?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                    {[c.clubs?.city, c.clubs?.state].filter(Boolean).join(", ")}
                    <span style={{ marginLeft: 6 }}>{statusBadge(c.clubs?.status)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 4 }}>
                    Claimed by: <strong>{c.coach_accounts?.name}</strong> · {c.coach_accounts?.email}
                  </div>
                  {c.message && (
                    <div style={{ fontSize: 12, color: "var(--slate)", fontStyle: "italic", marginTop: 4 }}>"{c.message}"</div>
                  )}
                  {c.document_url && (
                    <a href={c.document_url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: "var(--brand)", display: "inline-block", marginTop: 4 }}>
                      📎 View attached document
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{fmtDate(c.created_at)}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" disabled={working[c.id]} onClick={() => approveClaim(c)}>
                    {working[c.id] ? "..." : "✓ Approve"}
                  </button>
                  <button className="btn btn-danger btn-sm" disabled={working[c.id]} onClick={() => denyClaim(c)}>
                    Deny
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && clubs.filter(c => c.status === "pending_claim").length === 0 && (
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>✓ No pending club claims.</div>
      )}

      {/* All clubs with filter */}
      <div className="flex items-center justify-between mb-3">
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          All Clubs ({clubs.length})
        </div>
        <div className="flex gap-2">
          {["all", "claimed", "pending_claim", "unclaimed", "archived"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "3px 10px", fontSize: 11, borderRadius: 20, cursor: "pointer",
                border: "1px solid", fontFamily: "inherit",
                borderColor: filter === f ? "var(--brand)" : "var(--border)",
                background: filter === f ? "var(--brand)" : "transparent",
                color: filter === f ? "white" : "var(--slate)" }}>
              {f === "pending_claim" ? "pending" : f}
            </button>
          ))}
        </div>
      </div>

      {filteredClubs.length === 0 && (
        <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>No clubs match this filter.</div>
      )}

      {filteredClubs.map(c => (
        <div key={c.id} className="flex items-center gap-3 mb-2"
          style={{ padding: "10px 14px", background: c.status === "archived" ? "#f8fafc" : "var(--bg)",
            borderRadius: 8, opacity: c.status === "archived" ? 0.7 : 1,
            border: "1px solid var(--border)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: c.status === "archived" ? "var(--muted)" : "var(--navy)" }}>
              {c.name}
              {c.status === "archived" && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--muted)" }}>ARCHIVED</span>}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{[c.city, c.state].filter(Boolean).join(", ")}</div>
          </div>
          {statusBadge(c.status)}
          <div className="flex gap-2">
            {c.status === "pending_claim" && (() => {
              const matchingClaim = claims.find(cl => cl.club_id === c.id && cl.status === "pending");
              if (matchingClaim) {
                return (
                  <button className="btn btn-primary btn-sm"
                    disabled={!!working[matchingClaim.id]}
                    onClick={() => approveClaim(matchingClaim)}
                    style={{ fontSize: 11 }}>
                    {working[matchingClaim.id] ? "..." : "✓ Approve"}
                  </button>
                );
              }
              // Fallback: approve directly on the club row (no claim request found)
              return (
                <button className="btn btn-primary btn-sm"
                  disabled={working[c.id] === "approving"}
                  onClick={async () => {
                    setWorking(p => ({ ...p, [c.id]: "approving" }));
                    await supabase.from("clubs").update({ status: "claimed" }).eq("id", c.id);
                    setClubs(prev => prev.map(cl => cl.id === c.id ? { ...cl, status: "claimed" } : cl));
                    setWorking(p => ({ ...p, [c.id]: false }));
                  }}
                  style={{ fontSize: 11 }}>
                  {working[c.id] === "approving" ? "..." : "✓ Approve"}
                </button>
              );
            })()}
            {c.status === "archived" ? (
              <button className="btn btn-secondary btn-sm"
                disabled={working[c.id] === "reactivating"}
                onClick={() => reactivateClub(c)}
                style={{ fontSize: 11 }}>
                {working[c.id] === "reactivating" ? "..." : "Reactivate"}
              </button>
            ) : (
              <button className="btn btn-secondary btn-sm"
                disabled={!!working[c.id]}
                onClick={() => archiveClub(c)}
                style={{ fontSize: 11 }}>
                {working[c.id] === "archiving" ? "..." : "Archive"}
              </button>
            )}
            <button className="btn btn-danger btn-sm"
              disabled={!!working[c.id]}
              onClick={() => { setConfirmDelete(c); setDeleteInput(""); }}
              style={{ fontSize: 11 }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Resolved claims */}
      {resolved.length > 0 && (
        <div className="mt-4">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
            Resolved ({resolved.length})
          </div>
          {resolved.map(c => (
            <div key={c.id} className="flex items-center gap-3 mb-2"
              style={{ padding: "8px 12px", background: "var(--bg)", borderRadius: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}>{c.clubs?.name} — {c.coach_accounts?.name}</div>
              </div>
              <span className={`badge ${c.status === "approved" ? "badge-green" : "badge-red"}`}
                style={{ fontSize: 10 }}>{c.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 600,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: "28px 24px" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--red)", marginBottom: 8 }}>
              ⚠️ Delete Club
            </div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 16 }}>
              This will permanently delete <strong>{confirmDelete.name}</strong> and all associated membership and coach records.
              Coach and family accounts will not be deleted.
              <br /><br />
              This action <strong>cannot be undone</strong>.
            </p>
            <div className="form-group">
              <label className="label">Type <strong>{confirmDelete.name}</strong> to confirm</label>
              <input className="input" value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                placeholder={confirmDelete.name} autoFocus />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-danger" disabled={deleteInput !== confirmDelete.name}
                onClick={deleteClub}>
                Permanently Delete
              </button>
              <button className="btn btn-ghost" onClick={() => { setConfirmDelete(null); setDeleteInput(""); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── DATA OVERVIEW TAB ───────────────────────────────────────────────────────

function DataOverviewTab({ supabase, competitionHosts, pendingHosts, setPage }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: families },
        { count: coaches },
        { count: twirlers },
        { count: competitions },
        { count: results },
        { count: bugReports },
        { count: feedback },
      ] = await Promise.all([
        supabase.from('family_accounts').select('*', { count: 'exact', head: true }),
        supabase.from('coach_accounts').select('*', { count: 'exact', head: true }),
        supabase.from('twirlers').select('*', { count: 'exact', head: true }),
        supabase.from('competitions').select('*', { count: 'exact', head: true }),
        supabase.from('results').select('*', { count: 'exact', head: true }),
        supabase.from('bug_reports').select('*', { count: 'exact', head: true }),
        supabase.from('beta_feedback').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ families, coaches, twirlers, competitions, results, bugReports, feedback });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>Loading stats...</div>;

  const statCards = [
    { label: "Family Accounts", value: stats.families, icon: "👨‍👩‍👧" },
    { label: "Coach Accounts", value: stats.coaches, icon: "🎓" },
    { label: "Twirlers", value: stats.twirlers, icon: "👤" },
    { label: "Competitions", value: stats.competitions, icon: "🏆" },
    { label: "Results", value: stats.results, icon: "📋" },
    { label: "Hosts (total)", value: (competitionHosts || []).length, icon: "📅" },
    { label: "Hosts (pending)", value: (pendingHosts || []).length, icon: "⏳", warn: (pendingHosts || []).length > 0 },
    { label: "Bug Reports", value: stats.bugReports, icon: "🐛", warn: stats.bugReports > 0 },
    { label: "Beta Feedback", value: stats.feedback, icon: "⭐" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {statCards.map(stat => (
          <div key={stat.label} className="stat-card"
            style={stat.warn && stat.value > 0 ? { border: "1px solid #fed7aa", background: "#fff7ed" } : {}}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div className="stat-value" style={{ fontSize: 22, color: stat.warn && stat.value > 0 ? "var(--red)" : "var(--navy)" }}>
              {stat.value ?? "—"}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage("openqs")}>
          View Open Questions →
        </button>
      </div>
    </div>
  );
}

// ─── ACCOUNTS TAB (ADMIN) ─────────────────────────────────────────────────────

function AccountsTab({ supabase, currentFamilyAccount, twirlers }) {
  const [accountType, setAccountType] = useState("family"); // "family" | "coach" | "host" | "twirlers"
  const [accounts, setAccounts] = useState([]);
  const [coachAccounts, setCoachAccounts] = useState([]);
  const [hostAccounts, setHostAccounts] = useState([]);
  const [allTwirlers, setAllTwirlers] = useState([]);
  const [clubOwnerIds, setClubOwnerIds] = useState(new Set());
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [accountTwirlers, setAccountTwirlers] = useState({});
  const [adminWorking, setAdminWorking] = useState({});
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "family" });
  const [inviteSent, setInviteSent] = useState(false);
  const [sentInvites, setSentInvites] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: accts, error: e1 }, { data: coaches }, { data: adms, error: e3 },
               { data: hosts }, { data: owners }, { data: tw }] = await Promise.all([
          supabase.from('family_accounts').select('*').order('created_at', { ascending: false }),
          supabase.from('coach_accounts').select('*').order('created_at', { ascending: false }),
          supabase.from('admins').select('user_id'),
          supabase.from('competition_hosts').select('*').order('created_at', { ascending: false }),
          supabase.from('club_coaches').select('coach_id').eq('role', 'owner').eq('status', 'active'),
          supabase.from('twirlers').select('id, first_name, dob, organizations, family_id').order('created_at', { ascending: false }),
        ]);
        if (e1) throw e1;
        if (e3) throw e3;
        setAccounts(accts || []);
        setCoachAccounts(coaches || []);
        setHostAccounts(hosts || []);
        setAllTwirlers((tw || []).map(t => ({ ...t, firstName: t.first_name })));
        setClubOwnerIds(new Set((owners || []).map(o => o.coach_id)));
        setAdmins((adms || []).map(a => a.user_id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function sendInvite(email, name, role) {
    const e = email || inviteForm.email;
    const n = name || inviteForm.name || "there";
    const r = role || inviteForm.role;
    if (!e) return;
    await sendEmail("admin_invite", e, { name: n, role: r });
    if (!email) {
      // New invite
      setSentInvites(prev => {
        const exists = prev.find(i => i.email === e);
        if (exists) return prev.map(i => i.email === e ? { ...i, sentAt: new Date().toISOString() } : i);
        return [...prev, { email: e, name: n, role: r, sentAt: new Date().toISOString() }];
      });
      setInviteSent(true);
      setInviteForm({ name: "", email: "", role: "family" });
      setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 2000);
    }
  }

  async function loadTwirlersForAccount(familyId) {
    if (accountTwirlers[familyId]) return;
    const { data } = await supabase
      .from('twirlers')
      .select('id, first_name, dob, organizations')
      .eq('family_id', familyId);
    setAccountTwirlers(prev => ({ ...prev, [familyId]: data || [] }));
  }

  function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      loadTwirlersForAccount(id);
    }
  }

  async function grantAdmin(account) {
    if (!account.user_id) {
      alert("This account doesn't have a linked auth user ID. They need to sign in at least once before admin can be granted.");
      return;
    }
    if (!window.confirm(`Grant admin access to ${account.parent_name || account.email}? They will be able to approve hosts and manage accounts.`)) return;
    setAdminWorking(p => ({ ...p, [account.id]: true }));
    try {
      const { error } = await supabase.from('admins').insert({ user_id: account.user_id });
      if (error) throw error;
      setAdmins(prev => [...prev, account.user_id]);
    } catch (err) {
      alert("Failed to grant admin: " + err.message);
    } finally {
      setAdminWorking(p => ({ ...p, [account.id]: false }));
    }
  }

  async function revokeAdmin(account) {
    if (account.email === currentFamilyAccount?.email) {
      alert("You can't revoke your own admin access.");
      return;
    }
    if (!window.confirm(`Revoke admin access from ${account.parent_name || account.email}?`)) return;
    setAdminWorking(p => ({ ...p, [account.id]: true }));
    try {
      const { error } = await supabase.from('admins').delete().eq('user_id', account.user_id);
      if (error) throw error;
      setAdmins(prev => prev.filter(id => id !== account.user_id));
    } catch (err) {
      alert("Failed to revoke admin: " + err.message);
    } finally {
      setAdminWorking(p => ({ ...p, [account.id]: false }));
    }
  }

  const filtered = accounts.filter(a =>
    !search ||
    a.parent_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.state?.toLowerCase().includes(search.toLowerCase())
  );

  const isCurrent = (a) => a.email === currentFamilyAccount?.email;
  const isAdmin = (a) => a.user_id && admins.includes(a.user_id);

  if (loading) return <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>Loading accounts...</div>;
  if (error) return (
    <div className="alert alert-warn">
      <Icon name="alert" size={14} color="var(--amber)" />
      <span style={{ fontSize: 12 }}>Error loading accounts: {error}. Check your Supabase RLS policies allow admins to read all rows.</span>
    </div>
  );

  return (
    <div>
      {/* Account type switcher + invite */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "family", label: `Families (${accounts.length})` },
            { id: "coach", label: `Coaches (${coachAccounts.length})` },
            { id: "host", label: `Directors (${hostAccounts.length})` },
            { id: "twirlers", label: `Twirlers (${allTwirlers.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => { setAccountType(t.id); setSearch(""); setExpandedId(null); }}
              style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
                background: "none", fontFamily: "inherit",
                color: accountType === t.id ? "var(--brand)" : "var(--slate)",
                borderBottom: accountType === t.id ? "2px solid var(--brand)" : "2px solid transparent",
                marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowInvite(v => !v)}>
          + Invite
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card-sm mb-4" style={{ background: "var(--bg)", border: "1px solid var(--brand)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Invite someone to TwirlPower</div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Name (optional)</label>
              <input className="input" value={inviteForm.name}
                onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Their name" />
            </div>
            <div className="form-group">
              <label className="label">Email *</label>
              <input className="input" type="email" value={inviteForm.email}
                onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com" autoFocus />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <select className="select" value={inviteForm.role}
              onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}>
              <option value="family">Family</option>
              <option value="coach">Coach</option>
              <option value="host">Competition Director</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={!inviteForm.email || inviteSent}
              onClick={sendInvite}>
              {inviteSent ? "✓ Sent!" : "Send Invitation"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowInvite(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Previously sent invites */}
      {sentInvites.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase",
            letterSpacing: "0.5px", marginBottom: 8 }}>
            Sent Invites ({sentInvites.length})
          </div>
          {sentInvites.map(i => (
            <div key={i.email} className="flex items-center gap-3 mb-2"
              style={{ padding: "8px 12px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{i.name !== "there" ? i.name : i.email}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>
                  {i.email} · {i.role} · Sent {fmtDate(i.sentAt)}
                </div>
              </div>
              <button className="btn btn-secondary btn-sm"
                onClick={() => sendInvite(i.email, i.name, i.role)}
                style={{ fontSize: 11 }}>
                Resend
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coach accounts list */}
      {accountType === "coach" && (
        <div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input className="input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, club..." style={{ paddingLeft: 30, fontSize: 12 }} />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
              style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          {coachAccounts.filter(c =>
            !search ||
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.club?.toLowerCase().includes(search.toLowerCase())
          ).length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <h3>No coach accounts yet</h3>
              <p>Coach accounts appear here once a coach signs up.</p>
            </div>
          ) : coachAccounts.filter(c =>
            !search ||
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.club?.toLowerCase().includes(search.toLowerCase())
          ).map(c => (
            <div key={c.id} style={{ border: "1px solid var(--border)", borderRadius: 8, marginBottom: 6,
              background: "var(--card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0,
                  background: clubOwnerIds.has(c.id) ? "#fef3c7" : "#ede9fe",
                  color: clubOwnerIds.has(c.id) ? "#92400e" : "#6d28d9" }}>
                  {initials(c.name || c.email || "?")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", display: "flex", alignItems: "center", gap: 6 }}>
                    {c.name || "—"}
                    {clubOwnerIds.has(c.id) && (
                      <span className="badge badge-amber" style={{ fontSize: 9 }}>👑 Club Owner</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.email}{c.club ? ` · ${c.club}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {c.organizations?.length > 0 && c.organizations.map(o => (
                    <span key={o} className="badge" style={{ fontSize: 9, background: orgColor(o) + "15", color: orgColor(o) }}>{o}</span>
                  ))}
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDate(c.created_at)}</span>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete coach account for ${c.name || c.email}? This cannot be undone.`)) {
                        supabase.from("coach_accounts").delete().eq("id", c.id).then(() => {
                          setCoachAccounts(prev => prev.filter(x => x.id !== c.id));
                        });
                      }
                    }}
                    style={{ fontSize: 10, padding: "2px 8px" }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Host accounts list */}
      {accountType === "host" && (
        <div>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input className="input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, organization..." style={{ paddingLeft: 30, fontSize: 12 }} />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
              style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          {hostAccounts.filter(h =>
            !search ||
            h.name?.toLowerCase().includes(search.toLowerCase()) ||
            h.email?.toLowerCase().includes(search.toLowerCase()) ||
            h.organization?.toLowerCase().includes(search.toLowerCase())
          ).length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <h3>No host accounts yet</h3>
              <p>Host accounts appear here once someone registers.</p>
            </div>
          ) : hostAccounts.filter(h =>
            !search ||
            h.name?.toLowerCase().includes(search.toLowerCase()) ||
            h.email?.toLowerCase().includes(search.toLowerCase()) ||
            h.organization?.toLowerCase().includes(search.toLowerCase())
          ).map(h => (
            <div key={h.id} style={{ border: "1px solid var(--border)", borderRadius: 8, marginBottom: 6,
              background: "var(--card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0,
                  background: h.approved ? "#dcfce7" : "#fef9c3", color: h.approved ? "#166534" : "#854d0e" }}>
                  {initials(h.name || "?")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", display: "flex", alignItems: "center", gap: 6 }}>
                    {h.name || "—"}
                    <span className={`badge ${h.approved ? "badge-green" : "badge-amber"}`} style={{ fontSize: 9 }}>
                      {h.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {[h.email, h.organization, h.state].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDate(h.created_at)}</span>
                  {h.approved ? (
                    <button className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (window.confirm(`Revoke director access for ${h.name}?`)) {
                          supabase.from("competition_hosts").update({ approved: false }).eq("id", h.id).then(() => {
                            setHostAccounts(prev => prev.map(x => x.id === h.id ? { ...x, approved: false } : x));
                          });
                        }
                      }}
                      style={{ fontSize: 10, padding: "2px 8px" }}>Revoke</button>
                  ) : (
                    <button className="btn btn-primary btn-sm"
                      onClick={() => {
                        supabase.from("competition_hosts").update({ approved: true }).eq("id", h.id).then(() => {
                          setHostAccounts(prev => prev.map(x => x.id === h.id ? { ...x, approved: true } : x));
                        });
                      }}
                      style={{ fontSize: 10, padding: "2px 8px" }}>✓ Approve</button>
                  )}
                  <button className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete director registration for ${h.name}? This cannot be undone.`)) {
                        supabase.from("competition_hosts").delete().eq("id", h.id).then(() => {
                          setHostAccounts(prev => prev.filter(x => x.id !== h.id));
                        });
                      }
                    }}
                    style={{ fontSize: 10, padding: "2px 8px" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Twirlers list */}
      {accountType === "twirlers" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "var(--slate)" }}>{allTwirlers.length} twirler{allTwirlers.length !== 1 ? "s" : ""}</span>
            <div style={{ position: "relative" }}>
              <input className="input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search name or org..." style={{ paddingLeft: 30, width: 220, fontSize: 12 }} />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
                style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
          {allTwirlers.filter(t =>
            !search ||
            t.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            (t.organizations || []).some(o => o.toLowerCase().includes(search.toLowerCase()))
          ).map(t => {
            const family = accounts.find(a => a.id === t.family_id);
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                border: "1px solid var(--border)", borderRadius: 8, marginBottom: 6, background: "var(--card)" }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0,
                  background: "var(--brand-light)", color: "var(--brand)" }}>
                  {initials(t.first_name || "?")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{t.first_name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {family ? `${family.parent_name || family.email}` : "Unknown family"}
                    {t.dob ? ` · Age ${getAge(t.dob)}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  {(t.organizations || []).map(o => (
                    <span key={o} className="badge" style={{ fontSize: 9, background: orgColor(o) + "15", color: orgColor(o) }}>{o}</span>
                  ))}
                  <button className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete twirler "${t.first_name}"? This will also delete all their competitions and results. This cannot be undone.`)) {
                        Promise.all([
                          supabase.from("results").delete().eq("twirler_id", t.id),
                          supabase.from("competitions").delete().eq("twirler_id", t.id),
                        ]).then(() => supabase.from("twirlers").delete().eq("id", t.id)).then(() => {
                          setAllTwirlers(prev => prev.filter(x => x.id !== t.id));
                        });
                      }
                    }}
                    style={{ fontSize: 10, padding: "2px 8px" }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Family accounts list */}
      {accountType === "family" && <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "var(--slate)" }}>
          {accounts.length} account{accounts.length !== 1 ? "s" : ""}
          {admins.length > 0 && <span style={{ marginLeft: 8, color: "var(--muted)" }}>· {admins.length} admin{admins.length !== 1 ? "s" : ""}</span>}
        </span>
        <div style={{ position: "relative" }}>
          <input className="input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, state..." style={{ paddingLeft: 30, width: 220, fontSize: 12 }} />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ padding: "24px 0" }}>
          <h3>No accounts found</h3>
          <p>{search ? "Try a different search" : "No family accounts registered yet"}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map(a => (
          <div key={a.id} style={{ border: "1px solid", borderRadius: 8,
            background: isCurrent(a) ? "rgba(13,148,136,0.05)" : "var(--card)",
            borderColor: isAdmin(a) ? "#818cf8" : isCurrent(a) ? "var(--brand)" : "var(--border)" }}>

            {/* Row header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer" }}
              onClick={() => toggleExpand(a.id)}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0,
                background: isAdmin(a) ? "#6366f1" : isCurrent(a) ? "var(--brand)" : "var(--navy2)", color: "white" }}>
                {initials(a.parent_name || a.email || "?")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                  {a.parent_name || "—"}
                  {isCurrent(a) && <span className="badge badge-green" style={{ fontSize: 9 }}>You</span>}
                  {isAdmin(a) && <span className="badge" style={{ fontSize: 9, background: "#e0e7ff", color: "#4338ca" }}>Admin</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.email}{a.state ? ` · ${a.state}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                {a.club && <span className="badge badge-gray" style={{ fontSize: 10 }}>{a.club}</span>}
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{fmtDate(a.created_at)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"
                  style={{ transform: expandedId === a.id ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {/* Expanded detail */}
            {expandedId === a.id && (
              <div style={{ padding: "10px 14px 14px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  {[
                    ["Email", a.email],
                    ["Phone", a.phone || "—"],
                    ["State", a.state || "—"],
                    ["Club", a.club || "—"],
                    ["Registered", fmtDate(a.created_at)],
                    ["Account ID", a.id?.slice(0, 8) + "..."],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--navy)", marginTop: 1 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Twirlers */}
                {accountTwirlers[a.id] ? (
                  accountTwirlers[a.id].length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                        Twirlers ({accountTwirlers[a.id].length})
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {accountTwirlers[a.id].map(t => (
                          <div key={t.id} style={{ padding: "3px 10px", background: "var(--bg)", borderRadius: 20,
                            border: "1px solid var(--border)", fontSize: 12 }}>
                            {t.first_name}
                            {t.organizations?.length > 0 && (
                              <span style={{ color: "var(--muted)", fontSize: 10, marginLeft: 4 }}>{t.organizations.join(", ")}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (() => {
                    // Check if this person is a co-guardian on another family account
                    const linkedFamily = accounts.find(other =>
                      other.id !== a.id &&
                      (other.additional_guardians || []).some(g =>
                        g.email?.toLowerCase() === a.email?.toLowerCase()
                      )
                    );
                    const guardianEntry = linkedFamily
                      ? (linkedFamily.additional_guardians || []).find(g =>
                          g.email?.toLowerCase() === a.email?.toLowerCase()
                        )
                      : null;
                    return (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>No twirlers on this account</div>
                        {linkedFamily && (
                          <div className="alert alert-info" style={{ marginTop: 6, padding: "8px 12px" }}>
                            <Icon name="info" size={13} color="var(--brand)" />
                            <div style={{ fontSize: 12 }}>
                              Parent/Guardian on <strong>{linkedFamily.parent_name || linkedFamily.email}</strong>'s account
                              {guardianEntry?.relationship ? ` (${guardianEntry.relationship})` : ""}
                              . Twirlers and data are managed there.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Loading twirlers...</div>
                )}

                {/* Co-guardians */}
                {(a.additional_guardians || []).length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                      Parents & Guardians ({a.additional_guardians.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {a.additional_guardians.map((g, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                          <span style={{ color: "var(--navy)", fontWeight: 500 }}>{g.name || g.email}</span>
                          <span style={{ color: "var(--muted)", fontSize: 11 }}>{g.email}</span>
                          <span className="badge badge-gray" style={{ fontSize: 9 }}>{g.relationship}</span>
                          {g.confirmed && <span className="badge badge-green" style={{ fontSize: 9 }}>confirmed</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>
                      Additional parents and guardians log in with their own email and have full access to this family's twirlers.
                    </div>
                  </div>
                )}

                {/* Admin access control */}
                <div style={{ paddingTop: 10, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>Admin Access</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      {isAdmin(a) ? "This account has full admin access." : "No admin access."}
                    </div>
                  </div>
                  {isCurrent(a) ? (
                    <span style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>Can't change your own</span>
                  ) : isAdmin(a) ? (
                    <button className="btn btn-danger btn-sm" disabled={adminWorking[a.id]}
                      onClick={() => revokeAdmin(a)}>
                      {adminWorking[a.id] ? "Revoking..." : "Revoke Admin"}
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled={adminWorking[a.id]}
                      onClick={() => grantAdmin(a)}
                      style={{ borderColor: "#818cf8", color: "#4338ca" }}>
                      {adminWorking[a.id] ? "Granting..." : "⭐ Grant Admin"}
                    </button>
                  )}
                </div>

                {/* Account actions */}
                {!isCurrent(a) && (
                  <div style={{ paddingTop: 10, marginTop: 10, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Permanently delete account for ${a.parent_name}? This will delete all their twirlers, competitions, and results. This cannot be undone.`)) {
                          supabase.from("family_accounts").delete().eq("id", a.id).then(() => {
                            setAccounts(prev => prev.filter(x => x.id !== a.id));
                          });
                        }
                      }}
                      style={{ fontSize: 11 }}>
                      🗑 Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      </>}
    </div>
  );
}

function CoachesPage({ coaches, twirlers, activeTwirler, familyAccount, coachLinks, respondToCoachLink, supabase }) {
  const [tab, setTab] = useState('linked'); // 'linked' | 'find' | 'invite'
  // Find tab
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [requestSent, setRequestSent] = useState({}); // coachId -> true
  const [requesting, setRequesting] = useState({});
  // Invite tab
  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [inviteSent, setInviteSent] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  const realCoachLinks = (coachLinks || []).filter(l => l.status === 'accepted');
  const pendingCoachLinks = (coachLinks || []).filter(l => l.status === 'pending');

  async function doSearch() {
    if (search.length < 2) return;
    setSearching(true);
    const { data } = await supabase
      .from('coach_accounts')
      .select('id, name, studio, state, organizations, bio')
      .or(`name.ilike.%${search}%,studio.ilike.%${search}%,state.ilike.%${search}%`)
      .limit(10);
    setSearchResults(data || []);
    setSearching(false);
  }

  async function requestCoach(coach) {
    setRequesting(p => ({ ...p, [coach.id]: true }));
    // Create pending link for all twirlers
    const links = (activeTwirler ? [activeTwirler] : twirlers).map(t => ({
      coach_id: coach.id,
      twirler_id: t.id,
      family_id: familyAccount?.id,
      status: 'pending',
      invited_by: 'family',
    }));
    await supabase.from('coach_athlete_links').upsert(links, { onConflict: 'coach_id,twirler_id', ignoreDuplicates: true });
    // Email the coach
    await sendEmail('coach_link_request', coach.email, {
      coachName: coach.name,
      familyName: familyAccount?.parentName,
      athleteName: (activeTwirler ? [activeTwirler] : twirlers).map(t => t.firstName).join(', '),
    });
    setRequestSent(p => ({ ...p, [coach.id]: true }));
    setRequesting(p => ({ ...p, [coach.id]: false }));
  }

  async function sendInvite() {
    if (!inviteForm.email) return;
    setSendingInvite(true);
    await sendEmail('coach_invite_new_family', inviteForm.email, {
      coachName: inviteForm.name || 'there',
      familyName: familyAccount?.parentName,
      athleteName: (activeTwirler ? [activeTwirler] : twirlers).map(t => t.firstName).join(', '),
    });
    setInviteSent(true);
    setSendingInvite(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Coaches</h1>
        <p className="page-sub">Manage coaches and their access to your twirlers</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'linked', label: `My Coaches${realCoachLinks.length ? ` (${realCoachLinks.length})` : ''}` },
          { id: 'find', label: '🔍 Find a Coach' },
          { id: 'invite', label: '✉️ Invite a Coach' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-secondary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MY COACHES TAB ── */}
      {tab === 'linked' && (
        <div>
          {/* Pending requests */}
          {pendingCoachLinks.length > 0 && (
            <div className="mb-4">
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                Pending Requests ({pendingCoachLinks.length})
              </div>
              {pendingCoachLinks.map(l => (
                <div key={l.id} className="card-sm mb-2" style={{ border: "1px solid #fed7aa", background: "#fff7ed" }}>
                  <div className="flex items-center gap-3">
                    <div className="avatar" style={{ background: "#fef3c7", color: "#92400e" }}>{initials(l.coachName || "?")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{l.coachName || "Coach"}</div>
                      <div style={{ fontSize: 12, color: "var(--slate)" }}>{l.coachEmail}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {l.invitedBy === 'family' ? 'Request sent — awaiting coach approval' : 'Coach requested to link — awaiting your approval'}
                      </div>
                    </div>
                    {l.invitedBy !== 'family' && (
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={() => respondToCoachLink(l.id, true)}>✓ Accept</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => respondToCoachLink(l.id, false)}>Decline</button>
                      </div>
                    )}
                    {l.invitedBy === 'family' && (
                      <span className="badge badge-amber" style={{ fontSize: 10 }}>Awaiting coach</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Linked coaches */}
          {realCoachLinks.length > 0 ? (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                Linked Coaches ({realCoachLinks.length})
              </div>
              {realCoachLinks.map(l => {
                const twirler = twirlers.find(t => t.id === l.twirlerId);
                return (
                  <div key={l.id} className="card mb-3">
                    <div className="flex items-start gap-4">
                      <div className="avatar avatar-lg" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                        {initials(l.coachName || "?")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{l.coachName || "—"}</div>
                        {l.coachEmail && <div style={{ fontSize: 13, color: "var(--slate)" }}>📧 {l.coachEmail}</div>}
                        {l.coachStudio && <div style={{ fontSize: 13, color: "var(--slate)" }}>🏫 {l.coachStudio}</div>}
                        {l.coachOrgs?.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {l.coachOrgs.map(o => (
                              <span key={o} className="badge" style={{ background: orgColor(o) + "15", color: orgColor(o), fontSize: 10 }}>{o}</span>
                            ))}
                          </div>
                        )}
                        {twirler && (
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                            Linked to: <strong>{twirler.firstName}</strong>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2" style={{ alignItems: "flex-end" }}>
                        <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => { if (window.confirm(`Remove ${l.coachName} as coach?`)) respondToCoachLink(l.id, false); }}
                          style={{ fontSize: 11 }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : pendingCoachLinks.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎓</div>
                <h3>No coaches linked yet</h3>
                <p>Search for a coach on TwirlPower or invite one by email.</p>
                <div className="flex gap-2" style={{ justifyContent: "center", marginTop: 16 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setTab('find')}>Find a Coach</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setTab('invite')}>Invite by Email</button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ── FIND A COACH TAB ── */}
      {tab === 'find' && (
        <div>
          <div className="card mb-4">
            <div className="section-header">
              <span className="section-title">Search TwirlPower Coaches</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
              Search by name, studio, or state. View bios and send a link request — the coach will approve before being added.
            </p>
            <div className="flex gap-2">
              <input className="input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Coach name, studio, or state..." autoFocus
                onKeyDown={e => e.key === 'Enter' && doSearch()} />
              <button className="btn btn-primary btn-sm" disabled={search.length < 2 || searching} onClick={doSearch}>
                {searching ? '...' : 'Search'}
              </button>
            </div>
          </div>

          {searchResults.length === 0 && search.length >= 2 && !searching && (
            <div className="card mb-4">
              <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "16px 0" }}>
                No coaches found matching "{search}". Try a different name or state, or invite them by email.
              </p>
              <div style={{ textAlign: "center" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setTab('invite')}>Invite by Email →</button>
              </div>
            </div>
          )}

          {searchResults.map(coach => {
            const alreadyLinked = realCoachLinks.some(l => l.coachId === coach.id) ||
              pendingCoachLinks.some(l => l.coachId === coach.id);
            const sent = requestSent[coach.id];
            return (
              <div key={coach.id} className="card mb-3">
                <div className="flex items-start gap-4">
                  <div className="avatar avatar-lg" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                    {initials(coach.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{coach.name}</div>
                    {coach.studio && <div style={{ fontSize: 13, color: "var(--slate)" }}>🏫 {coach.studio}</div>}
                    {coach.state && <div style={{ fontSize: 13, color: "var(--slate)" }}>📍 {coach.state}</div>}
                    {coach.organizations?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {coach.organizations.map(o => (
                          <span key={o} className="badge" style={{ background: orgColor(o) + "15", color: orgColor(o), fontSize: 10 }}>{o}</span>
                        ))}
                      </div>
                    )}
                    {coach.bio && (
                      <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 8, lineHeight: 1.5, fontStyle: "italic" }}>
                        "{coach.bio}"
                      </p>
                    )}
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {alreadyLinked ? (
                      <span className="badge badge-green" style={{ fontSize: 10 }}>
                        {realCoachLinks.some(l => l.coachId === coach.id) ? 'Linked' : 'Pending'}
                      </span>
                    ) : sent ? (
                      <span className="badge badge-green" style={{ fontSize: 11 }}>✓ Request sent</span>
                    ) : (
                      <button className="btn btn-primary btn-sm"
                        disabled={requesting[coach.id]}
                        onClick={() => requestCoach(coach)}>
                        {requesting[coach.id] ? '...' : 'Request to Link'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── INVITE A COACH TAB ── */}
      {tab === 'invite' && (
        <div>
          {inviteSent ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 32px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>
                Invite sent!
              </h2>
              <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 20 }}>
                {inviteForm.name || inviteForm.email} will receive an email inviting them to join TwirlPower. Once they sign up as a coach, find them using the "Find a Coach" tab and send a link request.
              </p>
              <div className="flex gap-2" style={{ justifyContent: "center" }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setInviteSent(false); setInviteForm({ name: '', email: '' }); }}>
                  Invite Another
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setTab('find')}>Find a Coach</button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="section-header">
                <span className="section-title">Invite a Coach by Email</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20, lineHeight: 1.6 }}>
                Know a coach who isn't on TwirlPower yet? Send them an email invite. Once they create a coach account, use "Find a Coach" to send a link request.
              </p>
              <div className="form-row">
                <div className="form-group">
                  <label className="label">Coach name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
                  <input className="input" value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Coach's full name" />
                </div>
                <div className="form-group">
                  <label className="label">Email address <span style={{ color: "var(--red)" }}>*</span></label>
                  <input className="input" type="email" value={inviteForm.email}
                    onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="coach@email.com" autoFocus />
                </div>
              </div>
              <div className="alert alert-info mb-4">
                <Icon name="info" size={14} color="var(--brand)" />
                <span style={{ fontSize: 12 }}>
                  The email will mention {familyAccount?.parentName || 'your family'} and {(activeTwirler ? [activeTwirler] : twirlers).map(t => t.firstName).join(', ')} so the coach knows who's reaching out.
                </span>
              </div>
              <button className="btn btn-primary" disabled={!inviteForm.email || sendingInvite} onClick={sendInvite}>
                {sendingInvite ? 'Sending...' : 'Send Invite Email'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CoachCreateCompModal({ open, onClose, coach, twirlers, onSave }) {
  const [compForm, setComp] = useState({ name: "", date: "", location: "", venue: "", state: "", startTime: "", orgId: "" });
  const [invitedIds, setInvitedIds] = useState([]);
  const cf = (k, v) => setComp(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (open) {
      setComp({ name: "", date: "", location: "", venue: "", state: "", startTime: "", orgId: "", sanctioned: true });
      setInvitedIds(twirlers.map(t => t.id));
    }
  }, [open]);

  const toggleInvite = (id) => setInvitedIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );

  const valid = compForm.name && compForm.date && compForm.orgId && invitedIds.length > 0;

  const allOrgIds = [...new Set(twirlers.flatMap(t => t.organizations || []))];

  return (
    <Modal open={open} onClose={onClose} title="Create Competition & Invite Twirlers"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!valid}
          onClick={() => onSave(compForm, invitedIds)}>
          Send Invites
        </button>
      </>}>

      <div className="alert alert-info mb-4">
        <Icon name="info" size={15} color="var(--blue)" />
        <span>Create the competition details, then select which athletes to invite. Each family will see the invite on their dashboard and can accept or decline.</span>
      </div>

      <div className="form-group">
        <label className="label">Competition name</label>
        <input className="input" value={compForm.name} onChange={e => cf("name", e.target.value)} placeholder="e.g. 2025 Regional Championships" autoFocus />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="label">Date</label>
          <input className="input" type="date" value={compForm.date} onChange={e => cf("date", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Organization</label>
          <select className="select" value={compForm.orgId} onChange={e => cf("orgId", e.target.value)}>
            <option value="">Select org</option>
            {allOrgIds.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="label">State</label>
          <select className="select" value={compForm.state || ""} onChange={e => cf("state", e.target.value)}>
            <option value="">Select state</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Start time <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" type="time" value={compForm.startTime || ""} onChange={e => cf("startTime", e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="label">Venue name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
        <input className="input" value={compForm.venue || ""} onChange={e => cf("venue", e.target.value)} placeholder="e.g. Denver Coliseum" />
      </div>
      <div className="form-group">
        <label className="label">Address <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
        <input className="input" value={compForm.location} onChange={e => cf("location", e.target.value)} placeholder="Street address" />
      </div>
      <div className="form-group">
        <label className="label">Sanctioned status</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ val: true, label: "Sanctioned" }, { val: false, label: "Unsanctioned" }].map(opt => (
            <div key={String(opt.val)} onClick={() => cf("sanctioned", opt.val)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                border: `2px solid ${compForm.sanctioned === opt.val ? "var(--brand)" : "var(--border)"}`,
                background: compForm.sanctioned === opt.val ? "var(--brand-light)" : "#f8fafc",
                fontSize: 13, fontWeight: compForm.sanctioned === opt.val ? 600 : 400,
                color: compForm.sanctioned === opt.val ? "var(--brand2)" : "var(--navy)" }}>
              {compForm.sanctioned === opt.val ? "✓ " : ""}{opt.label}
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="form-group">
        <label className="label">Invite athletes</label>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>
          Select which athletes to invite. Unselected athletes will not receive this invite.
        </div>
        <div className="flex-col gap-2">
          {twirlers.map(t => {
            const invited = invitedIds.includes(t.id);
            return (
              <div key={t.id}
                onClick={() => toggleInvite(t.id)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: invited ? "#eff6ff" : "#f8fafc",
                  border: `1px solid ${invited ? "#bfdbfe" : "var(--border)"}`,
                  borderRadius: 8, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ width: 20, height: 20, borderRadius: 4,
                  background: invited ? "var(--blue)" : "white",
                  border: `2px solid ${invited ? "var(--blue)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {invited && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "#dbeafe", color: "#1d4ed8" }}>{initials(t.firstName)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{t.firstName}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>{t.organizations?.join(", ")}</div>
                </div>
                <span style={{ fontSize: 12, color: invited ? "var(--blue)" : "var(--muted)", fontWeight: invited ? 600 : 400 }}>
                  {invited ? "Will be invited" : "Not invited"}
                </span>
              </div>
            );
          })}
        </div>
        {invitedIds.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--red)", marginTop: 8 }}>Select at least one athlete to invite.</div>
        )}
      </div>
    </Modal>
  );
}

function OrganizationsPage({ activeTwirler, twirlerResults }) {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const orgIds = Object.keys(ORG_INFO);

  if (selectedOrg) {
    return <OrgDetailPage orgId={selectedOrg} onBack={() => setSelectedOrg(null)} activeTwirler={activeTwirler} twirlerResults={twirlerResults} />;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Organizations</h1>
        <p className="page-sub">Learn about the major baton twirling organizations, their classification systems, and rules</p>
      </div>

      <div className="grid-2">
        {orgIds.map(orgId => {
          const info = ORG_INFO[orgId];
          const org = ORGS[orgId];
          return (
            <div key={orgId} className="card" style={{ cursor: "pointer", transition: "box-shadow 0.15s", borderTop: `3px solid ${info.color}` }}
              onClick={() => setSelectedOrg(orgId)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div className="flex items-start gap-3 mb-3">
                <div style={{ width: 44, height: 44, borderRadius: 10, background: info.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: info.color }}>{orgId}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 2 }}>{info.name}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>Founded {info.founded}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6, marginBottom: 14 }}>
                {info.tagline}
              </p>
              <div className="flex items-center justify-between">
                <div className="chip-group">
                  {org.levels.slice(0, 3).map(l => (
                    <span key={l} className="badge badge-gray" style={{ fontSize: 10 }}>{l}</span>
                  ))}
                  {org.levels.length > 3 && <span style={{ fontSize: 11, color: "var(--muted)" }}>+{org.levels.length - 3} more</span>}
                </div>
                <span style={{ fontSize: 12, color: info.color, fontWeight: 600 }}>Learn more →</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-4" style={{ background: "var(--brand-light)", border: "1px solid rgba(13,148,136,0.2)" }}>
        <div className="flex items-start gap-3">
          <Icon name="info" size={18} color="var(--brand)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--brand2)", marginBottom: 4 }}>You don't need to be a member to compete</div>
            <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.6 }}>
              TwirlPower tracks your results from any organization's competitions. When you add a competition, you can select any org — membership in that org is not required to enter their events. Classification levels are tracked separately per organization so your progress is always accurate regardless of where you compete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CasProgressSection({ activeTwirler, twirlerResults }) {
  if (!activeTwirler) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <Icon name="user" size={28} color="var(--muted)" />
        <p style={{ fontSize: 14, color: "var(--slate)", marginTop: 12 }}>
          Select an athlete on the home screen to view their CAS progress.
        </p>
      </div>
    );
  }

  const casResults = (twirlerResults || []).filter(r => CAS_EVENTS.has(r.event) && r.orgId === "USTA");

  // Build pass map: { "Compulsories__C": { passed, date, judge, compName } }
  const passMap = {};
  casResults.forEach(r => {
    if (r.casLevel && r.casPassed === true) {
      const key = `${r.event}__${r.casLevel}`;
      if (!passMap[key]) passMap[key] = { passed: true, judgeNote: r.judgeNote };
    }
  });

  const tracks = ["Compulsories", "Movement Technique"];
  const levelLabels = { C: "C", B: "B", BI: "BI", BII: "BII", A: "A", AA: "AA", AAA: "AAA", Elite: "Elite" };

  return (
    <div>
      <div className="card mb-4" style={{ borderLeft: "4px solid #2563eb" }}>
        <div className="section-header">
          <span className="section-title">What is CAS?</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.7 }}>
          The <strong>Competitive Achievement System (CAS)</strong> is USTA's progressive skill evaluation program —
          separate from win-based classification. Athletes are evaluated by a certified judge at each level,
          and passes are recorded in their Achievement Book. Passing all CAS levels is required to compete
          in USTA PreTrials and Trials events.
        </p>
        <p style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.7, marginTop: 8 }}>
          There are two tracks: <strong>Compulsories</strong> (specific baton skills at each level) and{" "}
          <strong>Movement Technique</strong> (body/movement skills). Athletes progress through levels
          C → B → BI → BII → A → AA → AAA → Elite on each track independently. USTA limits evaluation
          to 2 levels per meet.
        </p>
      </div>

      {tracks.map(track => {
        const highestPassedIdx = CAS_LEVELS.reduce((max, lvl, idx) =>
          passMap[`${track}__${lvl}`] ? idx : max, -1);
        const nextLevelIdx = highestPassedIdx + 1;

        return (
          <div key={track} className="card mb-4">
            <div className="section-header">
              <span className="section-title">{track}</span>
              {highestPassedIdx >= 0
                ? <span className="badge badge-green" style={{ fontSize: 11 }}>
                    Through {CAS_LEVELS[highestPassedIdx]}
                  </span>
                : <span className="badge badge-gray" style={{ fontSize: 11 }}>Not started</span>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CAS_LEVELS.map((level, idx) => {
                const key = `${track}__${level}`;
                const passed = !!passMap[key];
                const isCurrent = idx === nextLevelIdx;
                const isLocked = idx > nextLevelIdx;
                const judge = passMap[key]?.judgeNote;

                return (
                  <div key={level} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10, border: "1px solid",
                    borderColor: passed ? "#bbf7d0" : isCurrent ? "#bfdbfe" : "var(--border)",
                    background: passed ? "#f0fdf4" : isCurrent ? "#eff6ff" : isLocked ? "#f8fafc" : "white",
                    opacity: isLocked ? 0.6 : 1,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: passed ? "#16a34a" : isCurrent ? "#2563eb" : "#e2e8f0",
                      color: passed || isCurrent ? "white" : "var(--slate)",
                      fontSize: 12, fontWeight: 700,
                    }}>
                      {passed ? "✓" : levelLabels[level]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)" }}>
                        Level {level}
                        {isCurrent && <span style={{ marginLeft: 8, fontSize: 11, color: "#2563eb", fontWeight: 500 }}>← Next</span>}
                      </div>
                      {passed && judge && (
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Judge: {judge}</div>
                      )}
                      {!passed && isCurrent && (
                        <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>
                          Ready to evaluate — log results when adding a competition
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600,
                      color: passed ? "#16a34a" : isCurrent ? "#2563eb" : "var(--muted)" }}>
                      {passed ? "Passed" : isCurrent ? "In progress" : isLocked ? "Locked" : "—"}
                    </div>
                  </div>
                );
              })}
            </div>

            {highestPassedIdx === CAS_LEVELS.length - 1 && (
              <div className="alert alert-info" style={{ marginTop: 12 }}>
                <Icon name="star" size={14} color="var(--brand)" />
                <span style={{ fontSize: 13 }}>All {track} levels completed!</span>
              </div>
            )}
          </div>
        );
      })}

      <div className="card" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="info" size={15} color="#d97706" />
          <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6, margin: 0 }}>
            CAS passes should always be recorded in your official USTA Achievement Book, signed by a
            certified judge. TwirlPower tracks passes from logged competitions but is not a substitute
            for the official Achievement Book record.
          </p>
        </div>
      </div>
    </div>
  );
}

function OrgDetailPage({ orgId, onBack, activeTwirler, twirlerResults }) {
  const info = ORG_INFO[orgId];
  const org = ORGS[orgId];
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "classification", label: "Classification" },
    { id: "events", label: "Events" },
    { id: "rules", label: "Key Rules" },
    ...(info.scoring ? [{ id: "scoring", label: "Scoring" }] : []),
    ...(orgId === "USTA" ? [{ id: "cas", label: "CAS Progress" }] : []),
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={onBack}>
          ← All Organizations
        </button>
        <div className="flex items-start gap-4">
          <div style={{ width: 56, height: 56, borderRadius: 14, background: info.color + "18",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            border: `2px solid ${info.color}30` }}>
            <span style={{ fontWeight: 900, fontSize: 17, color: info.color }}>{orgId}</span>
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="page-title" style={{ marginBottom: 4 }}>{info.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ fontSize: 13, color: "var(--slate)" }}>Founded {info.founded}</span>
              <span style={{ color: "var(--border)" }}>·</span>
              {org.winModel === "cumulative"
                ? <span className="badge badge-green" style={{ fontSize: 11 }}>Cumulative wins</span>
                : <span className="badge badge-blue" style={{ fontSize: 11 }}>Per-level wins</span>}
              <a href={info.website} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13,
                  color: info.color, fontWeight: 600, textDecoration: "none" }}
                onClick={e => e.stopPropagation()}>
                <Icon name="link" size={13} color={info.color} /> Official Website ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, background: "#f1f5f9", borderRadius: 10, padding: 3, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, transition: "all 0.15s",
              background: activeTab === tab.id ? "white" : "transparent",
              color: activeTab === tab.id ? "var(--navy)" : "var(--slate)",
              fontWeight: activeTab === tab.id ? 600 : 400,
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <div>
          {orgId === "USTA" && (
            <div className="alert alert-warn mb-4">
              <Icon name="alert" size={15} color="var(--amber)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>⚡ Rule change coming August 2025</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  USTA is transitioning from a win-count advancement system to a <strong>judge recommendation system</strong>.
                  Under the new model, judges will recommend advancement after an event — three recommendations
                  moves a twirler to the next classification level. TwirlPower is monitoring this change closely
                  and will update tracking accordingly. We'll notify you when the update is live.
                </p>
              </div>
            </div>
          )}
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">About</span></div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.8 }}>{info.history}</p>
          </div>
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">Classification at a glance</span></div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 16 }}>{info.classificationSummary}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {org.levels.map((level, i) => (
                <React.Fragment key={level}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, opacity: 0.3 + (i / org.levels.length) * 0.7 }} />
                    <span style={{ fontSize: 13, color: "var(--navy)", fontWeight: i === org.levels.length - 1 ? 600 : 400 }}>{level}</span>
                  </div>
                  {i < org.levels.length - 1 && <span style={{ color: "var(--muted)", fontSize: 12 }}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="card" style={{ borderLeft: `4px solid ${info.color}` }}>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>Official website</div>
            <a href={info.website} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px",
                background: info.color + "12", borderRadius: 8, color: info.color,
                fontWeight: 600, fontSize: 14, textDecoration: "none",
                border: `1px solid ${info.color}30` }}>
              <Icon name="link" size={15} color={info.color} />
              {info.website.replace("https://", "").replace("www.", "")} ↗
            </a>
          </div>
        </div>
      )}

      {/* Classification tab */}
      {activeTab === "classification" && (
        <div>
          {orgId === "USTA" && (
            <div className="alert alert-warn mb-4">
              <Icon name="alert" size={15} color="var(--amber)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>⚡ Classification system changing August 2025</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  The win-count system below is currently how USTA advancement works. Starting August 2025,
                  USTA will switch to a <strong>judge recommendation model</strong> — judges recommend advancement
                  after an event, and three recommendations trigger a level change. TwirlPower will update
                  to support the new system. Win counts will remain in your history.
                </p>
              </div>
            </div>
          )}
          <div className="card mb-4">
            <div className="section-header">
              <span className="section-title">How {orgId} classification works</span>
              {org.winModel === "cumulative" && <span className="badge badge-green">Cumulative model</span>}
            </div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 20 }}>{info.classificationSummary}</p>

            {/* Level cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {info.levels.map((level, i) => (
                <div key={level.name} style={{ display: "flex", gap: 14, padding: "14px 16px",
                  background: i === info.levels.length - 1 ? info.color + "08" : "#f8fafc",
                  borderRadius: 10, border: `1px solid ${i === info.levels.length - 1 ? info.color + "30" : "var(--border)"}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: info.color,
                    opacity: 0.25 + (i / info.levels.length) * 0.75,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)", marginBottom: 3 }}>{level.name}</div>
                    <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 2 }}>{level.wins}</div>
                    <div style={{ fontSize: 12, color: level.note.includes("⚠") ? "#d97706" : "var(--muted)", fontStyle: "italic" }}>{level.note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* DMA rulebook note */}
            {orgId === "DMA" && (
              <div className="alert alert-warn" style={{ marginTop: 16 }}>
                <Icon name="alert" size={15} color="var(--amber)" />
                <span>Some DMA thresholds are sourced from third-party comparative data. The full DMA rulebook is available at competitions or by emailing <strong>csorvill@tampabay.rr.com</strong> or <strong>dmabonnie577@gmail.com</strong>.</span>
              </div>
            )}
          </div>

          {/* TU content restrictions */}
          {org.contentRestrictions && (
            <div className="card">
              <div className="section-header"><span className="section-title">Skill content restrictions by level</span></div>
              <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>TU restricts the maximum number of turns and continuous elbow rolls per level in solo twirling.</p>
              <table className="table">
                <thead><tr><th>Level</th><th>Max turns</th><th>Max continuous elbows</th></tr></thead>
                <tbody>
                  {Object.entries(org.contentRestrictions).map(([level, r]) => (
                    <tr key={level}>
                      <td style={{ fontWeight: 500 }}>{level}</td>
                      <td>{r.maxTurns ?? "No limit"}</td>
                      <td>{r.maxElbows ?? "No limit"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Events tab */}
      {activeTab === "events" && (
        <div>
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">Events offered by {orgId}</span></div>
            <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
              Leveled events (marked ★) track wins toward classification advancement. Other events are competed but do not affect classification level.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {org.eventCategories.map(cat => (
                <div key={cat.category}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase",
                    letterSpacing: "0.8px", marginBottom: 8 }}>{cat.category}</div>
                  <div className="chip-group">
                    {cat.events.map(ev => {
                      const isLeveled = org.leveledEvents.includes(ev);
                      return (
                        <span key={ev} style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                          background: isLeveled ? info.color + "12" : "#f1f5f9",
                          color: isLeveled ? info.color : "var(--slate)",
                          border: `1px solid ${isLeveled ? info.color + "30" : "var(--border)"}` }}>
                          {isLeveled && <span style={{ fontSize: 10 }}>★</span>}
                          {ev}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rules tab */}
      {activeTab === "rules" && (
        <div>
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">Key rules for {orgId}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {info.keyRules.map((rule, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px",
                  background: rule.includes("⚠") ? "#fff7ed" : "#f8fafc",
                  borderRadius: 8, border: `1px solid ${rule.includes("⚠") ? "#fed7aa" : "var(--border)"}` }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: rule.includes("⚠") ? "#f59e0b20" : info.color + "15",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {rule.includes("⚠") ? <Icon name="alert" size={12} color="var(--amber)" /> : <Icon name="check" size={12} color={info.color} />}
                  </div>
                  <span style={{ fontSize: 14, color: rule.includes("⚠") ? "#92400e" : "var(--navy)", lineHeight: 1.5 }}>
                    {rule.replace("⚠️ ", "")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "#f8fafc" }}>
            <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 10 }}>
              For complete rules and scoring details, refer to the official {orgId} rulebook:
            </div>
            <a href={info.website} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px",
                background: info.color, borderRadius: 8, color: "white",
                fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
              <Icon name="link" size={15} color="white" />
              Visit {info.name} ↗
            </a>
          </div>
        </div>
      )}
      {/* Scoring tab */}
      {activeTab === "scoring" && info.scoring && (
        <div>
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">How {orgId} Scoring Works</span></div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 16 }}>
              {info.scoring.summary}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {info.scoring.categories.map((cat, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "#f8fafc",
                  borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--navy)" }}>{cat.name}</div>
                    <span className="badge" style={{ background: info.color + "15", color: info.color, fontSize: 11 }}>
                      {cat.points}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-4" style={{ borderLeft: "4px solid var(--red)" }}>
            <div className="section-header"><span className="section-title">Common Deductions</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {info.scoring.deductions.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--slate)", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--red)", fontWeight: 700, flexShrink: 0 }}>−</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="alert alert-info">
            <Icon name="info" size={14} color="var(--brand)" />
            <span style={{ fontSize: 13 }}>{info.scoring.note}</span>
          </div>
        </div>
      )}

      {/* CAS Progress tab — USTA only */}
      {activeTab === "cas" && orgId === "USTA" && (
        <CasProgressSection activeTwirler={activeTwirler} twirlerResults={twirlerResults} />
      )}
    </div>
  );
}

function UpcomingCompetitionsPage({ publicCompetitions, attendees, twirlers, activeTwirler, familyAccount, addAttendee, removeAttendee, competitionHosts, setPage, registerHost }) {
  const [directorModal, setDirectorModal] = useState(null); // null | 'confirm' | 'form' | 'done'
  const [filterState, setFilterState] = useState(familyAccount?.state || "");
  const [filterOrg, setFilterOrg] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = publicCompetitions
    .filter(c => c.approved !== false)
    .filter(c => c.date >= today)
    .filter(c => !filterState || c.state === filterState)
    .filter(c => !filterOrg || c.orgId === filterOrg)
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = publicCompetitions
    .filter(c => c.approved !== false && c.date < today)
    .filter(c => !filterState || c.state === filterState)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  function isAttending(compId) {
    return attendees.some(a => a.competitionId === compId && a.twirlerId === activeTwirler?.id);
  }

  function attendeeCount(compId) {
    return attendees.filter(a => a.competitionId === compId).length;
  }

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Upcoming Competitions</h1>
          <p className="page-sub">Competitions posted by verified hosts · {upcoming.length} upcoming</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setDirectorModal('confirm')}>
          <Icon name="plus" size={13} /> I'm a Competition Director
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <select className="select" value={filterState} onChange={e => setFilterState(e.target.value)}>
          <option value="">All states</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="select" value={filterOrg} onChange={e => setFilterOrg(e.target.value)}>
          <option value="">All organizations</option>
          {Object.values(ORGS).map(o => <option key={o.id} value={o.id}>{o.id} — {o.name}</option>)}
        </select>
        {familyAccount?.state && filterState !== familyAccount.state && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilterState(familyAccount.state)}>
            Show my state ({familyAccount.state})
          </button>
        )}
        {filterState && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilterState("")}>
            Show all states
          </button>
        )}
      </div>

      {upcoming.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
            <h3>No upcoming competitions found</h3>
            <p>{filterState ? `No competitions listed in ${filterState}.` : "No competitions have been posted yet."}</p>
            {filterState && <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setFilterState("")}>Show all states</button>}
          </div>
        </div>
      ) : (
        <div className="flex-col gap-3 mb-6">
          {upcoming.map(comp => {
            const attending = isAttending(comp.id);
            const host = competitionHosts.find(h => h.id === comp.hostId);
            const count = attendeeCount(comp.id);
            return (
              <div key={comp.id} className="card" style={{ borderLeft: `4px solid ${orgColor(comp.orgId)}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{comp.name}</span>
                      {comp.sanctioned !== false && <span className="badge badge-green" style={{ fontSize: 10 }}>Sanctioned</span>}
                      {comp.sanctioned === false && <span className="badge badge-warn" style={{ fontSize: 10 }}>Unsanctioned</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span style={{ fontSize: 13, color: "var(--slate)" }}>📅 {fmtDate(comp.date)}</span>
                      {comp.state && <span style={{ fontSize: 13, color: "var(--slate)" }}>📍 {comp.state}</span>}
                      {comp.orgId && <span className="badge" style={{ background: orgColor(comp.orgId) + "15", color: orgColor(comp.orgId) }}>{comp.orgId}</span>}
                    </div>
                    {comp.address && (
                      <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>
                        🏛 {comp.address}
                      </div>
                    )}
                    {comp.info && (
                      <div style={{ fontSize: 13, color: "var(--navy)", lineHeight: 1.6, marginBottom: 8,
                        background: "#f8fafc", padding: "8px 12px", borderRadius: 8 }}>
                        {comp.info}
                      </div>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      {host && <span style={{ fontSize: 12, color: "var(--muted)" }}>Posted by {host.name}{host.organization ? ` · ${host.organization}` : ""}</span>}
                      {count > 0 && <span style={{ fontSize: 12, color: "var(--slate)" }}>👥 {count} attending</span>}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {activeTwirler ? (
                      attending ? (
                        <div style={{ textAlign: "center" }}>
                          <div className="badge badge-green" style={{ marginBottom: 6, display: "block" }}>✓ Added</div>
                          <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}
                            onClick={() => removeAttendee(comp.id, activeTwirler.id)}>
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-primary btn-sm"
                          onClick={() => addAttendee(comp.id, activeTwirler.id)}>
                          + Add to my competitions
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>No twirler selected</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Recent past competitions</div>
          <div className="flex-col gap-2">
            {past.map(comp => (
              <div key={comp.id} className="card-sm" style={{ opacity: 0.6 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{comp.name}</span>
                    <span style={{ color: "var(--slate)", fontSize: 12, marginLeft: 8 }}>{fmtDate(comp.date)}</span>
                    {comp.state && <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 8 }}>· {comp.state}</span>}
                  </div>
                  {comp.orgId && <span className="badge" style={{ background: orgColor(comp.orgId) + "15", color: orgColor(comp.orgId), fontSize: 10 }}>{comp.orgId}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competition Director modals */}
      {directorModal && (
        <DirectorRequestModal
          step={directorModal}
          setStep={setDirectorModal}
          familyAccount={familyAccount}
          registerHost={registerHost}
        />
      )}
    </div>
  );
}

// ─── COMPETITION DIRECTOR REQUEST MODAL ──────────────────────────────────────

function DirectorRequestModal({ step, setStep, familyAccount, registerHost }) {
  const [form, setForm] = useState({
    name: familyAccount?.parentName || "",
    email: familyAccount?.email || "",
    phone: familyAccount?.phone || "",
    organization: "",
    state: familyAccount?.state || "",
    notes: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    setSubmitting(true);
    await registerHost({ ...form });
    setStep('done');
    setSubmitting(false);
  }

  // Confirmation step
  if (step === 'confirm') {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
        <div className="card" style={{ maxWidth: 480, width: "100%", padding: "32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>
              Become a Competition Director
            </h2>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7 }}>
              Competition Director accounts allow you to post public competitions that families can register for through TwirlPower.
            </p>
          </div>
          <div className="alert alert-info mb-4">
            <Icon name="info" size={15} color="var(--brand)" />
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <strong>What happens next:</strong>
              <ul style={{ marginTop: 6, paddingLeft: 16 }}>
                <li>You'll submit documentation confirming your role as a competition director</li>
                <li>A TwirlPower admin will review your request</li>
                <li>Once approved, you can post and manage public competitions</li>
                <li>Your family account remains active — director access is added to it</li>
              </ul>
            </div>
          </div>
          <div className="alert alert-warn mb-4">
            <Icon name="alert" size={14} color="var(--amber)" />
            <span style={{ fontSize: 13 }}>You will be required to submit documentation showing you are the director of a competition (e.g. event flyer, organizational credentials, or letter of authorization).</span>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep('form')}>
              Proceed with request →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration form step
  if (step === 'form') {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
        <div className="card" style={{ maxWidth: 520, width: "100%", padding: "28px" }}>
          <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setStep('confirm')}>← Back</button>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "var(--navy)", marginBottom: 4 }}>
            Competition Director Request
          </h2>
          <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 20, lineHeight: 1.6 }}>
            Fill in your details below. A TwirlPower admin will review your request and reach out if additional information is needed.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Your name</label>
              <input className="input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" />
            </div>
            <div className="form-group">
              <label className="label">State</label>
              <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label className="label">Phone</label>
              <input className="input" type="tel" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="(555) 555-5555" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Organization / affiliation <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" value={form.organization} onChange={e => f("organization", e.target.value)}
              placeholder="e.g. USTA Ohio Regional Council, ABC Twirling Club" />
          </div>
          <div className="form-group">
            <label className="label">Supporting documentation <span style={{ color: "var(--red)" }}>*</span></label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
              border: `1px dashed ${form.file ? "var(--brand)" : "var(--border)"}`,
              borderRadius: 8, cursor: "pointer", fontSize: 13,
              color: form.file ? "var(--brand)" : "var(--slate)", background: "#f8fafc" }}>
              <Icon name="upload" size={14} color={form.file ? "var(--brand)" : "var(--slate)"} />
              {form.file ? form.file.name : "Upload documentation (PDF, JPG, PNG)"}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style={{ display: "none" }}
                onChange={e => f("file", e.target.files?.[0])} />
            </label>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Event flyer, organizational credentials, letter of authorization, or other supporting documentation showing your director role
            </div>
          </div>
          <div className="form-group">
            <label className="label">Additional notes <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <textarea className="textarea" rows={2} value={form.notes} onChange={e => f("notes", e.target.value)}
              placeholder="Any additional context about your role or competitions you direct..." />
          </div>

          <div className="alert alert-info mb-4">
            <Icon name="info" size={14} color="var(--brand)" />
            <span style={{ fontSize: 12 }}>Your family account stays active. Director access will be added once approved — no need to create a separate account.</span>
          </div>

          <button className="btn btn-primary w-full"
            disabled={!form.name || !form.email || submitting}
            onClick={handleSubmit}>
            {submitting ? "Submitting..." : "Submit Director Request"}
          </button>
        </div>
      </div>
    );
  }

  // Success step
  if (step === 'done') {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
        <div className="card" style={{ maxWidth: 440, width: "100%", padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "var(--navy)", marginBottom: 8 }}>
            Request submitted!
          </h2>
          <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 20 }}>
            Your Competition Director request has been sent to TwirlPower for review. A team member will be in touch once your account is approved.
          </p>
          <div className="alert alert-info" style={{ textAlign: "left", marginBottom: 20 }}>
            <Icon name="info" size={14} color="var(--brand)" />
            <span style={{ fontSize: 13 }}>You'll be notified at <strong>{form.email}</strong> when your account is approved. Your family account continues to work normally in the meantime.</span>
          </div>
          <button className="btn btn-primary w-full" onClick={() => setStep(null)}>Done</button>
        </div>
      </div>
    );
  }

  return null;
}

// ─── HOST DASHBOARD PAGE ──────────────────────────────────────────────────────

function HostDashboardPage({ competitionHosts, publicCompetitions, attendees, twirlers, familyAccount, registerHost, createPublicCompetition, deletePublicCompetition }) {
  const [view, setView] = useState("find"); // "find" | "register" | "dashboard"
  const [hostId, setHostId] = useState(null);

  const myHost = competitionHosts.find(h => h.id === hostId) ||
    competitionHosts.find(h => h.email && h.email === familyAccount?.email);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Competition Director</h1>
        <p className="page-sub">Create and manage public competition listings</p>
      </div>

      {!myHost && (
        <HostRegisterView
          onRegister={(data) => {
            const h = registerHost(data);
            setHostId(h.id);
            setView("pending");
          }}
        />
      )}

      {myHost && !myHost.approved && (
        <div>
          <div className="alert alert-warn mb-4">
            <Icon name="alert" size={16} color="var(--amber)" />
            <div>
              <strong>Your account is pending approval.</strong>
              <div style={{ fontSize: 13, marginTop: 4 }}>A TwirlPower admin will review your registration and approve your account. Once approved you can create competition listings. This is a one-time process — once approved you retain host access permanently.</div>
              <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>Phase 2: The admin will receive an email notification and can approve you via the admin dashboard.</div>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Your registration</div>
            <div style={{ fontSize: 13, color: "var(--slate)" }}>Name: {myHost.name}</div>
            {myHost.organization && <div style={{ fontSize: 13, color: "var(--slate)" }}>Organization: {myHost.organization}</div>}
            {myHost.email && <div style={{ fontSize: 13, color: "var(--slate)" }}>Email: {myHost.email}</div>}
            {myHost.state && <div style={{ fontSize: 13, color: "var(--slate)" }}>State: {myHost.state}</div>}
          </div>
        </div>
      )}

      {myHost && myHost.approved && (
        <HostManageView
          host={myHost}
          publicCompetitions={publicCompetitions.filter(c => c.hostId === myHost.id)}
          attendees={attendees}
          twirlers={twirlers}
          onCreateComp={(data) => createPublicCompetition(myHost.id, data)}
          onDeleteComp={deletePublicCompetition}
        />
      )}
    </div>
  );
}

function HostRegisterView({ onRegister }) {
  const [form, setForm] = useState({ name: "", organization: "", email: "", phone: "", state: "", notes: "" });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="card mb-4" style={{ background: "var(--brand-light)", border: "1px solid rgba(13,148,136,0.2)" }}>
        <div className="flex gap-3">
          <Icon name="info" size={18} color="var(--brand)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--brand2)", marginBottom: 4 }}>How Competition Director accounts work</div>
            <ul style={{ fontSize: 13, color: "var(--slate)", lineHeight: 1.8, paddingLeft: 16 }}>
              <li>Register below with your name, affiliation, and contact info</li>
              <li>A TwirlPower admin reviews and approves your account (one-time)</li>
              <li>Once approved, you can post unlimited competition listings</li>
              <li>Twirlers and coaches can see your listings and add them to their schedules</li>
              <li>You can see who plans to attend each competition</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="section-header"><span className="section-title">Register as a Competition Director</span></div>
        <div className="form-row">
          <div className="form-group"><label className="label">Your name</label><input className="input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" /></div>
          <div className="form-group">
            <label className="label">State</label>
            <select className="select" value={form.state} onChange={e => f("state", e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="your@email.com" /></div>
          <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="(555) 555-5555" /></div>
        </div>
        <div className="form-group">
          <label className="label">Organization / affiliation <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" value={form.organization} onChange={e => f("organization", e.target.value)} placeholder="e.g. USTA Ohio Regional Council, ABC Twirling Club" />
        </div>
        <div className="form-group">
          <label className="label">Notes for admin <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <textarea className="textarea" value={form.notes} onChange={e => f("notes", e.target.value)} rows={2} placeholder="Any context about your role or organization..." />
        </div>
        <div className="alert alert-info mb-4">
          <Icon name="info" size={15} color="var(--brand)" />
          <span style={{ fontSize: 13 }}>Your registration will be reviewed by a TwirlPower admin before your account is activated. This helps ensure competition listings are from verified organizers.</span>
        </div>
        <button className="btn btn-primary" disabled={!form.name || !form.email} onClick={() => onRegister(form)}>
          Submit Registration
        </button>
      </div>
    </div>
  );
}

function HostManageView({ host, publicCompetitions, attendees, twirlers, onCreateComp, onDeleteComp }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", orgId: "", state: host.state || "", address: "", info: "", sanctioned: true });
  const cf = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const [expandedComp, setExpandedComp] = useState(null);

  function save() {
    onCreateComp({ ...form, approved: true });
    setForm({ name: "", date: "", orgId: "", state: host.state || "", address: "", info: "", sanctioned: true });
    setShowCreate(false);
  }

  return (
    <div>
      <div className="alert alert-success mb-4">
        <Icon name="check" size={15} color="var(--green)" />
        <span>Your Competition Director account is approved. You can create and manage competition listings below.</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div style={{ fontSize: 15, fontWeight: 600 }}>Your competitions ({publicCompetitions.length})</div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(v => !v)}>
          <Icon name="plus" size={13} /> {showCreate ? "Cancel" : "New Competition"}
        </button>
      </div>

      {showCreate && (
        <div className="card mb-4" style={{ borderTop: "3px solid var(--brand)" }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Create Competition Listing</div>
          <div className="form-group"><label className="label">Competition name</label><input className="input" value={form.name} onChange={e => cf("name", e.target.value)} placeholder="e.g. 2025 Ohio State Championships" autoFocus /></div>
          <div className="form-row">
            <div className="form-group"><label className="label">Date</label><input className="input" type="date" value={form.date} onChange={e => cf("date", e.target.value)} /></div>
            <div className="form-group">
              <label className="label">Organization</label>
              <select className="select" value={form.orgId} onChange={e => cf("orgId", e.target.value)}>
                <option value="">Select org</option>
                {Object.values(ORGS).map(o => <option key={o.id} value={o.id}>{o.id} — {o.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">State</label>
              <select className="select" value={form.state} onChange={e => cf("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Sanctioned status</label>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {[{ val: true, label: "Sanctioned" }, { val: false, label: "Unsanctioned" }].map(opt => (
                  <div key={String(opt.val)} onClick={() => cf("sanctioned", opt.val)}
                    style={{ flex: 1, padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                      border: `2px solid ${form.sanctioned === opt.val ? "var(--brand)" : "var(--border)"}`,
                      background: form.sanctioned === opt.val ? "var(--brand-light)" : "#f8fafc",
                      fontSize: 12, fontWeight: form.sanctioned === opt.val ? 600 : 400,
                      color: form.sanctioned === opt.val ? "var(--brand2)" : "var(--navy)" }}>
                    {form.sanctioned === opt.val ? "✓ " : ""}{opt.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Venue address</label>
            <input className="input" value={form.address} onChange={e => cf("address", e.target.value)} placeholder="123 Main St, City, State 12345" />
          </div>
          <div className="form-group">
            <label className="label">Competition info / description</label>
            <textarea className="textarea" value={form.info} onChange={e => cf("info", e.target.value)} rows={3} placeholder="Entry fees, age divisions, registration deadline, contact info, website, etc." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" disabled={!form.name || !form.date} onClick={save}>Publish Competition</button>
            <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {publicCompetitions.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ padding: "32px 0" }}>
            <h3>No competitions posted yet</h3>
            <p>Create your first competition listing above.</p>
          </div>
        </div>
      ) : (
        <div className="flex-col gap-3">
          {publicCompetitions.sort((a, b) => a.date.localeCompare(b.date)).map(comp => {
            const compAttendees = attendees.filter(a => a.competitionId === comp.id);
            const attendingTwirlers = twirlers.filter(t => compAttendees.some(a => a.twirlerId === t.id));
            const expanded = expandedComp === comp.id;
            return (
              <div key={comp.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="flex items-center justify-between" style={{ padding: "14px 18px", cursor: "pointer" }}
                  onClick={() => setExpandedComp(expanded ? null : comp.id)}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{comp.name}</div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>
                      {fmtDate(comp.date)}{comp.state ? ` · ${comp.state}` : ""}
                      {comp.orgId && <span className="badge" style={{ marginLeft: 8, background: orgColor(comp.orgId) + "15", color: orgColor(comp.orgId), fontSize: 10 }}>{comp.orgId}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-gray">{compAttendees.length} attending</span>
                    <Icon name={expanded ? "chevron_down" : "chevron_right"} size={15} color="var(--muted)" />
                  </div>
                </div>
                {expanded && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px" }}>
                    {comp.address && <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 6 }}>🏛 {comp.address}</div>}
                    {comp.info && <div style={{ fontSize: 13, color: "var(--navy)", marginBottom: 12, lineHeight: 1.6 }}>{comp.info}</div>}
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                      Attendees ({compAttendees.length})
                    </div>
                    {compAttendees.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>No attendees yet</div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {compAttendees.map((a, i) => {
                          const t = twirlers.find(tw => tw.id === a.twirlerId);
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px",
                              background: "#f0fdf4", borderRadius: 20, fontSize: 12 }}>
                              <div className="avatar" style={{ width: 20, height: 20, fontSize: 9, background: "#bbf7d0", color: "#166534" }}>
                                {initials(t?.firstName || "?")}
                              </div>
                              <span style={{ fontWeight: 500 }}>{t?.firstName || "Unknown"}</span>
                              <span style={{ color: "var(--muted)", fontSize: 11 }}>Added {fmtDate(a.addedAt)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <button className="btn btn-danger btn-sm" onClick={() => onDeleteComp(comp.id)}>
                        <Icon name="trash" size={13} /> Delete listing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────

function NotificationsPage({ allNotifications, pendingInvites, pendingCoachLinks, respondToInvite, respondToCoachLink, twirlers, coachCompetitions, setPage }) {

  const notifications = [
    ...(pendingCoachLinks || []).map(l => ({
      id: l.id,
      type: 'coach_link',
      title: `${l.coachName || "A coach"} wants to link with ${twirlers.find(t => t.id === l.twirlerId)?.firstName || "your athlete"}`,
      sub: [l.coachStudio, l.coachOrgs?.join(", ")].filter(Boolean).join(" · "),
      date: l.createdAt,
      coachEmail: l.coachEmail,
      raw: l,
    })),
    ...(pendingInvites || []).map(i => {
      const comp = coachCompetitions?.find(c => c.id === i.competitionId);
      const twirler = twirlers.find(t => t.id === i.twirlerId);
      return {
        id: i.id,
        type: 'competition_invite',
        title: `Competition invite for ${twirler?.firstName || "your athlete"}`,
        sub: comp ? `${comp.name} · ${fmtDate(comp.date)}` : "Competition details unavailable",
        date: i.createdAt,
        raw: i,
      };
    }),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">{notifications.length} pending action{notifications.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
          <h3>All caught up</h3>
          <p>No pending notifications right now.</p>
        </div>
      ) : notifications.map(n => (
        <div key={n.id} className="card mb-3">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: n.type === 'coach_link' ? "#e0e7ff" : "#dbeafe",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {n.type === 'coach_link' ? "🎓" : "🏆"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--navy)", marginBottom: 2 }}>
                {n.title}
              </div>
              {n.sub && <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 4 }}>{n.sub}</div>}
              {n.type === 'coach_link' && n.coachEmail && (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>📧 {n.coachEmail}</div>
              )}
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{fmtDate(n.date)}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            {n.type === 'coach_link' ? (
              <>
                <button className="btn btn-primary btn-sm"
                  onClick={() => respondToCoachLink(n.id, true)}>
                  ✓ Accept
                </button>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => respondToCoachLink(n.id, false)}>
                  Decline
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-sm"
                  onClick={() => respondToInvite(n.id, true)}>
                  ✓ Accept — add to competitions
                </button>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => respondToInvite(n.id, false)}>
                  Decline
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function OpenQuestionsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Open Questions</h1>
        <p className="page-sub">Unresolved rule clarifications — defaults are applied until answers are confirmed</p>
      </div>
      <div className="alert alert-warn mb-4">
        <Icon name="alert" size={16} color="var(--amber)" />
        <span>The classification logic defaults to counting wins in ambiguous cross-org situations. Once these questions are resolved, the rules can be updated to reflect the correct behavior.</span>
      </div>
      <div className="flex-col gap-3">
        {OPEN_QUESTIONS.map(q => {
          const isDMA = q.id.startsWith("Q8") || ["Q9","Q10","Q11","Q12","Q13","Q14"].includes(q.id);
          const isUSTAChange = ["Q15","Q16","Q17"].includes(q.id);
          const isTU = ["Q5","Q6"].includes(q.id);
          const orgTag = isUSTAChange ? "USTA" : isDMA ? "DMA" : isTU ? "TU" : q.id <= "Q4" ? null : null;
          const isRuleChange = isUSTAChange;
          return (
            <div key={q.id} className="card flex gap-3">
              <div style={{ width: 32, height: 32, background: "#fff7ed", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="question" size={16} color="var(--amber)" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-warn" style={{ fontSize: 10 }}>{q.id}</span>
                  {orgTag && (
                    <span className="badge" style={{ fontSize: 10, background: orgColor(orgTag) + "20", color: orgColor(orgTag) }}>{orgTag}</span>
                  )}
                  {isRuleChange && (
                    <span className="badge" style={{ fontSize: 10, background: "#fef3c7", color: "#92400e" }}>⚡ Rule change</span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Pending clarification</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--navy)", lineHeight: 1.5 }}>{q.text}</div>
                <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>
                  Default: <strong>wins counted</strong> until resolved
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GROUPED EVENT PICKER ────────────────────────────────────────────────────
// Shared component: renders event chips organized by category for each org

function GroupedEventPicker({ orgIds, selected, onToggle }) {
  // Build merged category list across selected orgs, deduping events
  const seen = new Set();
  const merged = [];
  for (const orgId of orgIds) {
    const org = ORGS[orgId];
    if (!org) continue;
    for (const cat of org.eventCategories) {
      const newEvts = cat.events.filter(e => !seen.has(e));
      if (newEvts.length === 0) continue;
      const existing = merged.find(m => m.category === cat.category);
      if (existing) {
        newEvts.forEach(e => { existing.events.push(e); seen.add(e); });
      } else {
        merged.push({ category: cat.category, orgId, events: newEvts });
        newEvts.forEach(e => seen.add(e));
      }
    }
  }

  if (merged.length === 0) return null;

  return (
    <div>
      {merged.map(cat => (
        <div key={cat.category} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", letterSpacing: "0.5px",
            textTransform: "uppercase", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            {cat.category}
            {orgIds.length > 1 && (
              <span className="badge" style={{ fontSize: 9, background: orgColor(cat.orgId) + "15", color: orgColor(cat.orgId), padding: "1px 5px" }}>
                {cat.orgId}
              </span>
            )}
          </div>
          <div className="chip-group">
            {cat.events.map(event => (
              <div key={event} className={`chip ${selected.includes(event) ? "selected" : ""}`}
                onClick={() => onToggle(event)}>
                {event}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ADD TWIRLER MODAL ───────────────────────────────────────────────────────

function AddTwirlerModal({ open, onClose, onSave, onOpenHistorical }) {
  const [form, setForm] = useState({ firstName: "", dob: "", club: "", organizations: [], regularEvents: [] });
  const [attempted, setAttempted] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleOrg = (orgId) => setForm(p => ({ ...p, organizations: p.organizations.includes(orgId) ? p.organizations.filter(o => o !== orgId) : [...p.organizations, orgId] }));

  const isValid = form.firstName && form.dob && form.organizations.length > 0;
  const missing = [];
  if (!form.firstName) missing.push("first name");
  if (!form.dob) missing.push("date of birth");
  if (form.organizations.length === 0) missing.push("at least one organization");

  function handleSave(withHistory) {
    if (!isValid) { setAttempted(true); return; }
    const newTwirler = onSave(form);
    setForm({ firstName: "", dob: "", club: "", organizations: [], regularEvents: [] });
    setAttempted(false);
    onClose();
    if (withHistory && newTwirler) {
      setTimeout(() => onOpenHistorical(newTwirler), 100);
    }
  }

  const reqStar = <span style={{ color: "var(--red)", marginLeft: 2 }}>*</span>;
  const fieldErr = (condition) => attempted && condition ? { borderColor: "var(--red)", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {};

  return (
    <Modal open={open} onClose={() => { setAttempted(false); onClose(); }} title="Add Twirler Profile"
      footer={
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={() => { setAttempted(false); onClose(); }}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm"
              onClick={() => handleSave(false)}
              title="Add profile and set classifications later">
              Add — set classifications later
            </button>
            <button className="btn btn-primary"
              onClick={() => handleSave(true)}>
              Add & set starting classifications →
            </button>
          </div>
        </div>
      }>
      <div className="alert alert-info mb-3">
        <Icon name="info" size={15} color="var(--blue)" />
        <span>Only the athlete{"'s"} first name is stored to protect minor privacy.</span>
      </div>
      {attempted && !isValid && (
        <div className="alert alert-warn mb-3">
          <span>Please fill in the required fields: {missing.join(", ")}.</span>
        </div>
      )}
      <div className="form-row">
        <div className="form-group"><label className="label">First name only {reqStar}</label><input className="input" value={form.firstName} onChange={e => f("firstName", e.target.value)} placeholder="e.g. Emma" style={fieldErr(!form.firstName)} /></div>
        <div className="form-group"><label className="label">Date of birth {reqStar}</label><input className="input" type="date" value={form.dob} onChange={e => f("dob", e.target.value)} style={fieldErr(!form.dob)} /></div>
      </div>
      <div className="form-group"><label className="label">Club</label><input className="input" value={form.club} onChange={e => f("club", e.target.value)} placeholder="Club name" /></div>
      <div className="form-group">
        <label className="label">Organizations {reqStar}</label>
        <div className="chip-group" style={attempted && form.organizations.length === 0 ? { padding: 4, borderRadius: 8, border: "1px solid var(--red)", background: "rgba(239,68,68,0.04)" } : {}}>
          {Object.keys(ORGS).map(orgId => (
            <div key={orgId} className={`chip ${form.organizations.includes(orgId) ? "selected" : ""}`} onClick={() => toggleOrg(orgId)}>{orgId}</div>
          ))}
        </div>
      </div>
      {form.organizations.length > 0 && (
        <div className="form-group">
          <label className="label">Events regularly competed in <span style={{ fontWeight: 400, color: "var(--muted)" }}>(select all that apply)</span></label>
          <GroupedEventPicker
            orgIds={form.organizations}
            selected={form.regularEvents}
            onToggle={event => setForm(p => ({
              ...p,
              regularEvents: p.regularEvents.includes(event)
                ? p.regularEvents.filter(e => e !== event)
                : [...p.regularEvents, event]
            }))}
          />
        </div>
      )}
    </Modal>
  );
}

// ─── EVENT RESULT ROWS (shared by add competition modal and add-results-later) ─

function EventResultRows({ eventRows, setEventRows, selectedOrg, activeTwirler }) {
  const orgLevels = selectedOrg?.levels || [];
  const leveledEvents = selectedOrg?.leveledEvents || [];
  const categories = selectedOrg?.eventCategories || [];

  // Events that are strut-type (no baton catches — All Catch doesn't apply)
  const strutEvents = new Set([
    "Strut", "Super-X Strut", "Fancy Strut", "Basic X Strut", "Box Strut", "T Strut",
    "Duet Fancy Strut", "Basic March", "Military March", "Parade March", "Presentation",
    "Strut Line", "Modeling", "Dress Model", "Costume Model",
  ]);

  function addRow() {
    setEventRows(prev => [...prev, {
      event: "", classificationLevelEntered: orgLevels[0] || "Novice",
      placement: "", contested: true, protectionRule: false, isFinalRound: null,
      score: "", allCatch: false, casLevel: "C", casPassed: null, judgeNote: "",
      scorecardFile: null, scorecardPreview: null, subScores: {}, showSubScores: false,
    }]);
  }

  function updateRow(i, k, v) {
    setEventRows(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  }

  function removeRow(i) {
    setEventRows(prev => prev.filter((_, idx) => idx !== i));
  }

  const needsLevel = (event) => leveledEvents.includes(event);
  const isStrut = (event) => strutEvents.has(event);
  const isTU = selectedOrg?.id === "TU";
  const isUsta = selectedOrg?.id === "USTA";
  const isCasEvent = (event) => isUsta && CAS_EVENTS.has(event);

  return (
    <div>
      {eventRows.map((row, i) => (
        <div key={i} className="card-sm mb-2" style={{ background: "#f8fafc" }}>
          <div className="form-row" style={{ marginBottom: 8 }}>
            <div>
              <label className="label">Event</label>
              <select className="select" value={row.event} onChange={e => {
                const evt = e.target.value;
                const classKey = `${selectedOrg?.id}__${evt}`;
                const savedLevel = activeTwirler?.classificationState?.[classKey]?.level;
                updateRow(i, "event", evt);
                if (savedLevel) updateRow(i, "classificationLevelEntered", savedLevel);
                else if (!needsLevel(evt)) updateRow(i, "classificationLevelEntered", "");
              }}>
                <option value="">Select event</option>
                {categories.map(cat => (
                  <optgroup key={cat.category} label={cat.category}>
                    {cat.events.map(ev => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                {needsLevel(row.event)
                  ? "Classification level"
                  : <span style={{ color: "var(--muted)" }}>Level (if applicable)</span>}
              </label>
              <select className="select" value={row.classificationLevelEntered}
                onChange={e => updateRow(i, "classificationLevelEntered", e.target.value)}>
                {!needsLevel(row.event) && <option value="">N/A</option>}
                {orgLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          {isCasEvent(row.event) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
              <div className="form-row">
                <div style={{ flex: 1 }}>
                  <label className="label">CAS Level</label>
                  <select className="select" value={row.casLevel || "C"}
                    onChange={e => updateRow(i, "casLevel", e.target.value)}>
                    {CAS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Result</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => updateRow(i, "casPassed", true)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "2px solid",
                      borderColor: row.casPassed === true ? "#16a34a" : "var(--border)",
                      background: row.casPassed === true ? "#f0fdf4" : "white",
                      color: row.casPassed === true ? "#16a34a" : "var(--slate)",
                      fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    ✓ Passed
                  </button>
                  <button type="button" onClick={() => updateRow(i, "casPassed", false)}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "2px solid",
                      borderColor: row.casPassed === false ? "#dc2626" : "var(--border)",
                      background: row.casPassed === false ? "#fef2f2" : "white",
                      color: row.casPassed === false ? "#dc2626" : "var(--slate)",
                      fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    ✗ Not yet
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Judge name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
                <input className="input" type="text" value={row.judgeNote || ""}
                  onChange={e => updateRow(i, "judgeNote", e.target.value)}
                  placeholder="For your Achievement Book records" />
              </div>
              {/* Optional sub-scores */}
              {row.event && CAS_SUBSCORES[row.event] && (
                <div>
                  <button type="button"
                    onClick={() => updateRow(i, "showSubScores", !row.showSubScores)}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "none",
                      border: "none", cursor: "pointer", fontSize: 12, color: "var(--brand)",
                      fontWeight: 600, fontFamily: "inherit", padding: "4px 0" }}>
                    <span style={{ fontSize: 14 }}>{row.showSubScores ? "▾" : "▸"}</span>
                    {row.showSubScores ? "Hide" : "Add"} sub-scores (optional)
                  </button>
                  {row.showSubScores && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                      {CAS_SUBSCORES[row.event].map(cat => (
                        <div key={cat.key}>
                          <label className="label" style={{ fontSize: 11 }}>{cat.label}</label>
                          <input className="input" type="number" min="0" max="10" step="0.1"
                            value={row.subScores?.[cat.key] || ""}
                            onChange={e => updateRow(i, "subScores", { ...row.subScores, [cat.key]: e.target.value })}
                            placeholder="0–10" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
          <>
          <div className="form-row" style={{ marginBottom: 8 }}>
            <div>
              <label className="label">Placement</label>
              <input className="input" type="number" min="1" max="99" value={row.placement}
                onChange={e => updateRow(i, "placement", e.target.value)} placeholder="1, 2, 3..." />
            </div>
            <div>
              <label className="label">Score <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
              <input className="input" type="number" min="0" max="100" step="0.1"
                value={row.score || ""} onChange={e => updateRow(i, "score", e.target.value)}
                placeholder="e.g. 87.4" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
              <label className="toggle">
                <Toggle on={row.contested} onChange={v => updateRow(i, "contested", v)} />
                <span style={{ fontSize: 13 }}>Contested division</span>
              </label>
              {!isStrut(row.event) && (
                <label className="toggle">
                  <Toggle on={!!row.allCatch} onChange={v => updateRow(i, "allCatch", v)} />
                  <span style={{ fontSize: 13 }}>All catch <span style={{ color: "var(--muted)", fontSize: 11 }}>(no drops)</span></span>
                </label>
              )}
              {selectedOrg?.rules?.protectionRule && parseInt(row.placement) === 1 && (
                <label className="toggle">
                  <Toggle on={row.protectionRule} onChange={v => updateRow(i, "protectionRule", v)} />
                  <span style={{ fontSize: 13 }}>Protection rule applied</span>
                </label>
              )}
              {selectedOrg?.rules?.finalRoundOnly && (
                <label className="toggle">
                  <Toggle on={row.isFinalRound !== false} onChange={v => updateRow(i, "isFinalRound", v ? true : false)} />
                  <span style={{ fontSize: 13 }}>Final round (not prelim)</span>
                </label>
              )}
              {isTU && (
                <label className="toggle">
                  <Toggle on={!!row.isPageant} onChange={v => updateRow(i, "isPageant", v)} />
                  <span style={{ fontSize: 13 }}>Pageant event <span style={{ color: "var(--muted)", fontSize: 11 }}>(won't count toward TU advancement)</span></span>
                </label>
              )}
              {isTU && (
                <label className="toggle">
                  <Toggle on={!!row.isTwirlOff} onChange={v => updateRow(i, "isTwirlOff", v)} />
                  <span style={{ fontSize: 13 }}>Twirl-off win <span style={{ color: "var(--muted)", fontSize: 11 }}>(won't count toward TU advancement)</span></span>
                </label>
              )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="label">Judge name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" type="text" value={row.judgeNote || ""}
              onChange={e => updateRow(i, "judgeNote", e.target.value)}
              placeholder="e.g. Jane Smith" />
          </div>
          </>
          )}
          <div style={{ marginBottom: 8 }}>
            <label className="label">Scorecard photo <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            {row.scorecardPreview ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={row.scorecardPreview} alt="Scorecard preview"
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                <div style={{ flex: 1, fontSize: 12, color: "var(--slate)" }}>{row.scorecardFile?.name}</div>
                <button type="button" className="btn btn-ghost btn-sm"
                  onClick={() => { updateRow(i, "scorecardFile", null); updateRow(i, "scorecardPreview", null); }}>
                  <Icon name="trash" size={12} color="var(--red)" /> Remove
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                border: "1px dashed var(--border)", borderRadius: 8, cursor: "pointer",
                fontSize: 13, color: "var(--slate)", background: "#f8fafc" }}>
                <Icon name="upload" size={14} color="var(--slate)" />
                Tap to add scorecard photo
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const preview = URL.createObjectURL(file);
                    updateRow(i, "scorecardFile", file);
                    updateRow(i, "scorecardPreview", preview);
                  }} />
              </label>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => removeRow(i)}>
            <Icon name="trash" size={13} color="var(--red)" /> Remove
          </button>
        </div>
      ))}
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={addRow}>
        <Icon name="plus" size={13} /> Add Event
      </button>
    </div>
  );
}

// ─── ADD COMPETITION MODAL ───────────────────────────────────────────────────

function AddCompetitionModal({ open, onClose, onSave, activeTwirler, competitions = [] }) {
  const [step, setStep] = useState(1);
  const [compForm, setComp] = useState({ name: "", date: "", location: "", venue: "", state: "", startTime: "", orgId: "", sanctioned: true });
  const [eventRows, setEventRows] = useState([]);
  const cf = (k, v) => setComp(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (open && activeTwirler) {
      setStep(1);
      const firstOrg = activeTwirler.organizations?.[0] || "";
      setComp({ name: "", date: "", location: "", venue: "", state: "", startTime: "", orgId: firstOrg, sanctioned: true });
      const defaultEvents = activeTwirler.regularEvents || [];
      const org = ORGS[firstOrg];
      const levels = activeTwirler.classificationState || {};
      setEventRows(defaultEvents.map(event => {
        const classKey = `${firstOrg}__${event}`;
        return { event, classificationLevelEntered: levels[classKey]?.level || org?.levels?.[0] || "Novice", placement: "", contested: true, protectionRule: false, isFinalRound: null };
      }));
    }
  }, [open]);

  const selectedOrg = ORGS[compForm.orgId];
  const isCasOrg = compForm.orgId === "USTA";
  const validRows = eventRows.filter(r => r.event && (
    (isCasOrg && CAS_EVENTS.has(r.event)) ? r.casPassed !== null : r.placement !== ""
  ));

  // Duplicate detection — same name AND same date
  const duplicateWarning = compForm.name && compForm.date
    ? competitions.find(c =>
        c.name.trim().toLowerCase() === compForm.name.trim().toLowerCase() &&
        c.date === compForm.date
      )
    : null;

  function saveWithResults() {
    onSave(compForm, validRows.map(r => ({
      ...r,
      placement: (isCasOrg && CAS_EVENTS.has(r.event)) ? null : parseInt(r.placement),
      orgId: compForm.orgId
    })));
    onClose();
  }

  function saveWithoutResults() {
    onSave(compForm, []);
    onClose();
  }

  if (!activeTwirler) return null;

  return (
    <Modal open={open} onClose={onClose} title={step === 1 ? "Add Competition" : "Add Results"}
      footer={step === 1 ? (
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={saveWithoutResults} disabled={!compForm.name || !compForm.date || !compForm.orgId}
            title="Save competition now, add results later from Competition History">
            Save without results
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={!compForm.name || !compForm.date || !compForm.orgId} onClick={() => setStep(2)}>
              Add Results →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={saveWithoutResults}>Save without results</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={saveWithResults}>Save Competition</button>
          </div>
        </div>
      )}>

      {step === 1 && (
        <>
          <div className="form-group">
            <label className="label">Competition name</label>
            <input className="input" value={compForm.name} onChange={e => cf("name", e.target.value)} placeholder="e.g. 2024 State Championships" autoFocus />
            {duplicateWarning && (
              <div className="alert alert-warn" style={{ marginTop: 8, fontSize: 12 }}>
                <Icon name="alert" size={13} color="var(--amber)" />
                <span>A competition named <strong>"{duplicateWarning.name}"</strong> on {fmtDate(duplicateWarning.date)} already exists. Are you sure this is a different event?</span>
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Date</label>
              <input className="input" type="date" value={compForm.date} onChange={e => cf("date", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">Organization</label>
              <select className="select" value={compForm.orgId} onChange={e => cf("orgId", e.target.value)}>
                <option value="">Select org</option>
                {Object.values(ORGS).map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.name}{activeTwirler?.organizations?.includes(o.id) ? " ✓" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">State</label>
              <select className="select" value={compForm.state} onChange={e => cf("state", e.target.value)}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Start time <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
              <input className="input" type="time" value={compForm.startTime || ""} onChange={e => cf("startTime", e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Venue name <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" value={compForm.venue || ""} onChange={e => cf("venue", e.target.value)} placeholder="e.g. Denver Coliseum" />
          </div>
          <div className="form-group">
            <label className="label">Address <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" value={compForm.location} onChange={e => cf("location", e.target.value)} placeholder="Street address" />
          </div>
          <div className="form-group">
            <label className="label">Sanctioned status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ val: true, label: "Sanctioned", desc: "Official sanctioned competition" },
                { val: false, label: "Unsanctioned", desc: "Practice meet, invitational, or non-sanctioned" }
              ].map(opt => (
                <div key={String(opt.val)}
                  onClick={() => cf("sanctioned", opt.val)}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                    border: `2px solid ${compForm.sanctioned === opt.val ? "var(--brand)" : "var(--border)"}`,
                    background: compForm.sanctioned === opt.val ? "var(--brand-light)" : "#f8fafc",
                    transition: "all 0.15s" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: compForm.sanctioned === opt.val ? "var(--brand2)" : "var(--navy)" }}>
                    {compForm.sanctioned === opt.val ? "✓ " : ""}{opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--slate)", marginTop: 2 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="label">Notes <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <input className="input" value={compForm.notes||""} onChange={e => cf("notes", e.target.value)} placeholder="e.g. judge names, entry fees paid, notes for next year..." />
          </div>
          <div className="alert alert-info">
            <Icon name="info" size={15} color="var(--brand)" />
            <span>You can save the competition now and add results later from Competition History. Phase 2 will include a searchable competition database.</span>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-3" style={{ padding: "10px 14px", background: "#f1f5f9", borderRadius: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{compForm.name}</span>
            <span style={{ color: "var(--slate)", fontSize: 13, marginLeft: 8 }}>{fmtDate(compForm.date)}</span>
            {compForm.location && <span style={{ color: "var(--slate)", fontSize: 13, marginLeft: 8 }}>· {compForm.location}</span>}
            <span className="badge" style={{ marginLeft: 8, background: orgColor(compForm.orgId) + "20", color: orgColor(compForm.orgId) }}>{compForm.orgId}</span>
          </div>
          <div className="alert alert-info mb-3" style={{ fontSize: 13 }}>
            <Icon name="info" size={14} color="var(--blue)" />
            <span>Events pre-filled from {activeTwirler.firstName + "'s"} regular events. Add, edit, or remove as needed. Events are grouped by type.</span>
          </div>
          <EventResultRows
            eventRows={eventRows}
            setEventRows={setEventRows}
            selectedOrg={selectedOrg}
            activeTwirler={activeTwirler}
          />
        </>
      )}
    </Modal>
  );
}

// ─── ADD RESULTS MODAL (for adding results to an existing competition) ─────────

function AddResultsModal({ open, onClose, competition: competitionProp, activeTwirler, onSave, competitions, prefillCompetitionId, prefillEvent, prefillLevel }) {
  const [eventRows, setEventRows] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState(null);

  // Resolve which competition to use
  const competition = competitionProp || (competitions || []).find(c => c.id === (selectedCompId || prefillCompetitionId));

  useEffect(() => {
    if (open) {
      // If prefill data, start with that event row pre-populated
      if (prefillEvent) {
        setEventRows([{
          id: uid(), event: prefillEvent,
          classificationLevelEntered: prefillLevel || "",
          placement: "", contested: true, protectionRule: false,
          isFinalRound: false, isPageant: false, isTwirlOff: false,
          score: "", allCatch: false, judgeNote: "",
          casPassed: null, casLevel: "", subScores: {},
        }]);
      } else {
        setEventRows([]);
      }
      // Set competition from prefill
      if (prefillCompetitionId && !competitionProp) {
        setSelectedCompId(prefillCompetitionId);
      }
    }
  }, [open, prefillEvent, prefillCompetitionId]);

  const selectedOrg = ORGS[competition?.orgId];
  const isCasOrg2 = competition?.orgId === "USTA";
  const validRows = eventRows.filter(r => r.event && (
    (isCasOrg2 && CAS_EVENTS.has(r.event)) ? r.casPassed !== null : r.placement !== ""
  ));

  function save() {
    onSave(competition.id, validRows.map(r => ({
      ...r,
      placement: (isCasOrg2 && CAS_EVENTS.has(r.event)) ? null : parseInt(r.placement),
      orgId: competition.orgId
    })));
    onClose();
  }

  if (!competition || !activeTwirler) return null;

  return (
    <Modal open={open} onClose={onClose} title="Add Results"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={validRows.length === 0} onClick={save}>Save Results</button>
      </>}>
      <div className="mb-3" style={{ padding: "10px 14px", background: "#f1f5f9", borderRadius: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{competition.name}</span>
        <span style={{ color: "var(--slate)", fontSize: 13, marginLeft: 8 }}>{fmtDate(competition.date)}</span>
        <span className="badge" style={{ marginLeft: 8, background: orgColor(competition.orgId) + "20", color: orgColor(competition.orgId) }}>{competition.orgId}</span>
      </div>
      <EventResultRows
        eventRows={eventRows}
        setEventRows={setEventRows}
        selectedOrg={selectedOrg}
        activeTwirler={activeTwirler}
      />
    </Modal>
  );
}

// ─── HISTORICAL DATA MODAL ────────────────────────────────────────────────────
// Lets users set starting classification levels and/or prior win counts
// for twirlers who are joining the app with an existing competition history.

function HistoricalDataModal({ open, onClose, activeTwirler, onSave }) {
  const [mode, setMode] = useState("quick"); // "quick" | "detailed"
  // entries: { orgId, event, level, priorWins }
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!open || !activeTwirler) return;
    // Pre-populate from twirler's orgs and leveled events
    const initial = [];
    for (const orgId of activeTwirler.organizations || []) {
      const org = ORGS[orgId];
      if (!org) continue;
      for (const event of org.leveledEvents) {
        const classKey = `${orgId}__${event}`;
        const existing = activeTwirler.classificationState?.[classKey];
        initial.push({
          orgId,
          event,
          level: existing?.level || org.levels[0],
          priorWins: existing?.priorWins || 0,
        });
      }
      // Add CAS tracks for USTA
      if (orgId === "USTA") {
        for (const track of ["Compulsories", "Movement Technique"]) {
          const classKey = `${orgId}__${track}`;
          const existing = activeTwirler.classificationState?.[classKey];
          initial.push({
            orgId,
            event: track,
            level: existing?.level || "C",
            priorWins: 0,
            isCas: true,
          });
        }
      }
    }
    setEntries(initial);
    setMode("quick");
  }, [open, activeTwirler]);

  function updateEntry(orgId, event, k, v) {
    setEntries(prev => prev.map(e =>
      e.orgId === orgId && e.event === event ? { ...e, [k]: v } : e
    ));
  }

  function save() {
    onSave(activeTwirler.id, entries);
    onClose();
  }

  if (!activeTwirler) return null;

  const orgGroups = (activeTwirler.organizations || []).map(orgId => ({
    orgId,
    org: ORGS[orgId],
    entries: entries.filter(e => e.orgId === orgId),
  })).filter(g => g.org);

  return (
    <Modal open={open} onClose={onClose} title="Set Starting Classifications"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={save}>Save</button>
      </>}>

      <div className="alert alert-info mb-4">
        <Icon name="info" size={15} color="var(--blue)" />
        <div>
          Use this to set {activeTwirler.firstName}'s classification history before starting to track competitions in the app. Prior wins will be counted toward advancement alongside any new wins entered.
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", background: "#f1f5f9", borderRadius: 8, padding: 3, marginBottom: 20, gap: 3 }}>
        {[
          { id: "quick", label: "Quick — set level only", desc: "I just know their current level" },
          { id: "detailed", label: "Detailed — enter win counts", desc: "I know how many wins they have" },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "inherit",
              background: mode === m.id ? "white" : "transparent",
              color: mode === m.id ? "var(--navy)" : "var(--slate)",
              fontWeight: mode === m.id ? 600 : 400, fontSize: 13,
              boxShadow: mode === m.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s" }}>
            {m.label}
          </button>
        ))}
      </div>

      {orgGroups.map(({ orgId, org, entries: orgEntries }) => (
        <div key={orgId} className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge" style={{ background: orgColor(orgId) + "20", color: orgColor(orgId), fontSize: 12 }}>{orgId}</span>
            <span style={{ fontSize: 13, color: "var(--slate)" }}>{org.name}</span>
          </div>

          {mode === "quick" ? (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Event</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Current level</th>
                </tr>
              </thead>
              <tbody>
                {orgEntries.map(entry => (
                  <tr key={entry.event} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 8px", fontSize: 14 }}>
                      {entry.event}
                      {entry.isCas && <span className="badge badge-blue" style={{ fontSize: 9, marginLeft: 6 }}>CAS</span>}
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <select className="select" style={{ padding: "5px 8px", fontSize: 13 }}
                        value={entry.level}
                        onChange={e => updateEntry(orgId, entry.event, "level", e.target.value)}>
                        {entry.isCas
                          ? CAS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)
                          : org.levels.map(l => <option key={l} value={l}>{l}</option>)
                        }
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              {org.winModel === "cumulative" ? (
                <div className="alert alert-info mb-3" style={{ fontSize: 12 }}>
                  <Icon name="info" size={14} color="var(--brand)" />
                  {orgId === "TU" ? (
                    <span><strong>TU uses cumulative wins.</strong> Enter total qualifying wins across ALL levels (excluding pageant and twirl-off wins). Thresholds: Sp. Beginner→Novice: 2 · Novice→Beginner: 5 · Beginner→Intermediate: 10 · Intermediate→Advanced: 18.</span>
                  ) : orgId === "DMA" ? (
                    <span><strong>DMA uses cumulative wins (trophy count).</strong> Enter total qualifying wins across ALL levels from ANY organization. Thresholds: ⚠️ Sp. Beginner→Beginner: 2 · Beginner→Intermediate: ~10 · Intermediate→Advanced: ~28. <em>Verify against your DMA rulebook — thresholds are from third-party sources.</em></span>
                  ) : (
                    <span><strong>Cumulative wins.</strong> Enter total qualifying wins across all levels.</span>
                  )}
                </div>
              ) : (
                <div className="alert alert-warn mb-3" style={{ fontSize: 12 }}>
                  <Icon name="info" size={14} color="var(--amber)" />
                  <span>Enter wins at the <strong>current level only</strong>. Wins at previous levels have already been accumulated to reach this level — they don't need to be entered.</span>
                </div>
              )}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Event</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Current level</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Wins at this level</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)" }}>Needed to advance</th>
                  </tr>
                </thead>
                <tbody>
                  {orgEntries.map(entry => {
                    if (entry.isCas) {
                      return (
                        <tr key={entry.event} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "8px 8px", fontSize: 14 }}>
                            {entry.event}
                            <span className="badge badge-blue" style={{ fontSize: 9, marginLeft: 6 }}>CAS</span>
                          </td>
                          <td style={{ padding: "6px 8px" }}>
                            <select className="select" style={{ padding: "5px 8px", fontSize: 13 }}
                              value={entry.level}
                              onChange={e => updateEntry(orgId, entry.event, "level", e.target.value)}>
                              {CAS_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                          </td>
                          <td colSpan={2} style={{ padding: "8px 8px", fontSize: 12, color: "var(--muted)" }}>
                            Pass/fail tracked via competition results
                          </td>
                        </tr>
                      );
                    }
                    const needed = getWinsNeeded(orgId, entry.level);
                    const next = getNextLevel(orgId, entry.level);
                    const remaining = needed ? Math.max(0, needed - entry.priorWins) : null;
                    return (
                      <tr key={entry.event} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "8px 8px", fontSize: 14 }}>{entry.event}</td>
                        <td style={{ padding: "6px 8px" }}>
                          <select className="select" style={{ padding: "5px 8px", fontSize: 13 }}
                            value={entry.level}
                            onChange={e => {
                              updateEntry(orgId, entry.event, "level", e.target.value);
                              updateEntry(orgId, entry.event, "priorWins", 0);
                            }}>
                            {org.levels.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {next ? (
                            <input type="number" min="0" max={needed || 99}
                              className="input" style={{ padding: "5px 8px", fontSize: 13, width: 72 }}
                              value={entry.priorWins}
                              onChange={e => updateEntry(orgId, entry.event, "priorWins", Math.max(0, parseInt(e.target.value) || 0))} />
                          ) : (
                            <span style={{ color: "var(--green)", fontSize: 13 }}>Advanced</span>
                          )}
                        </td>
                        <td style={{ padding: "8px 8px", fontSize: 13 }}>
                          {next && needed ? (
                            <span style={{ color: remaining === 0 ? "var(--green)" : "var(--slate)" }}>
                              {remaining === 0
                                ? <span style={{ color: "var(--green)", fontWeight: 600 }}>✓ Ready to advance</span>
                                : <>{remaining} more to reach {next}</>}
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
        These settings can be updated at any time from the Family Profile page.
      </div>
    </Modal>
  );
}

// ─── LEGAL PAGES ─────────────────────────────────────────────────────────────

const EFFECTIVE_DATE = "April 17, 2026";
const LEGAL_COMPANY = "TwirlPower, a dba of OAKRAA, LLC";
const LEGAL_EMAIL = "support@twirlpower.com";

function PrivacyPolicyPage({ onClose }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 48px" }}>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-sub">Effective {EFFECTIVE_DATE}</p>
        </div>
        {onClose && <button className="btn btn-ghost btn-sm" onClick={onClose}>← Back</button>}
      </div>
      <div className="card" style={{ lineHeight: 1.8, fontSize: 14, color: "var(--slate)" }}>
        {[
          { h: "1. Who We Are", body: `TwirlPower is a baton twirling competition tracking and progress management application operated by ${LEGAL_COMPANY} ("TwirlPower," "we," "us," or "our"), based in Colorado. You can contact us at ${LEGAL_EMAIL}.` },
          { h: "2. What Data We Collect", body: `We collect information you provide directly when creating an account or using the app:

Account information: parent or guardian name, email address, phone number, and state of residence.

Athlete information: first name, date of birth, club name, and organization memberships (USTA, NBTA, TU, DMA).

Competition data: competition names, dates, locations, organizations, results, placements, and classification levels.

Coach information: coach name, email, phone, club, and organizational affiliations.

We also collect your date of birth at signup to verify you are 18 or older, as required for account creation.` },
          { h: "3. How We Use Your Data", body: `We use the information we collect to:
- Provide and operate the TwirlPower app
- Track baton twirling classifications and competition history
- Send transactional emails (account confirmation, coach connection requests, competition invites, and advancement notifications)
- Respond to support requests
- Improve the app based on usage patterns

We do not sell your personal data to any third party. We do not use your data for advertising.` },
          { h: "4. Data We Share", body: `We share data only with the following service providers who help us operate TwirlPower:

Supabase (supabase.com) — database hosting and authentication. Your data is stored on Supabase servers.

Resend (resend.com) — transactional email delivery. Email addresses are shared only to send emails you have triggered.

Stripe (stripe.com) — payment processing, once subscription billing is enabled. We never store your full credit card number.

We may also disclose information if required by law or to protect the rights, property, or safety of TwirlPower, our users, or others.

We plan to add Google Analytics in the future. When we do, we will update this policy and provide notice in the app.` },
          { h: "5. Children's Privacy (COPPA)", body: `TwirlPower tracks competition data for twirlers who may be under the age of 13. We comply with the Children's Online Privacy Protection Act (COPPA) as follows:

Account holders must be 18 years of age or older. Athletes under 13 do not create their own accounts. All data for minor athletes is entered by a parent or guardian who holds the account.

We do not knowingly collect personal information directly from children under 13. If you believe we have inadvertently collected such information, please contact us at ${LEGAL_EMAIL} and we will delete it promptly.

The data we collect about minor athletes (first name, date of birth, competition history) is used solely to provide the classification tracking service and is not shared with advertisers or used for any commercial purpose beyond the app.` },
          { h: "6. Data Retention", body: `We retain your account data for as long as your account is active. If you delete your account, we will permanently delete all associated personal data within 30 days. Competition history and athlete data associated with your account will be deleted at the same time.

To request account deletion, email ${LEGAL_EMAIL} with the subject "Delete My Account."` },
          { h: "7. Your Rights", body: `You have the right to:
- Access the personal data we hold about you
- Correct inaccurate data through the app settings
- Request deletion of your account and all associated data
- Opt out of non-transactional emails (transactional emails related to your account activity cannot be opted out while your account is active)

To exercise any of these rights, contact us at ${LEGAL_EMAIL}.` },
          { h: "8. Security", body: `We take reasonable measures to protect your data, including encrypted connections (HTTPS), Supabase row-level security policies that ensure users can only access their own data, and secure authentication through Supabase Auth. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.` },
          { h: "9. Changes to This Policy", body: `We may update this Privacy Policy from time to time. When we do, we will update the effective date above and notify active users by email. Continued use of TwirlPower after changes constitutes acceptance of the updated policy.` },
          { h: "10. Contact Us", body: `If you have questions about this Privacy Policy or your data, contact The TwirlPower Team at ${LEGAL_EMAIL}.` },
        ].map(({ h, body }) => (
          <div key={h} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 8 }}>{h}</div>
            <div style={{ whiteSpace: "pre-line" }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermsOfServicePage({ onClose }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 48px" }}>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Terms of Service</h1>
          <p className="page-sub">Effective {EFFECTIVE_DATE}</p>
        </div>
        {onClose && <button className="btn btn-ghost btn-sm" onClick={onClose}>← Back</button>}
      </div>
      <div className="card" style={{ lineHeight: 1.8, fontSize: 14, color: "var(--slate)" }}>
        {[
          { h: "1. Acceptance of Terms", body: `By creating an account or using TwirlPower, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the app. These terms constitute a binding agreement between you and ${LEGAL_COMPANY}.` },
          { h: "2. Eligibility", body: `You must be at least 18 years old to create a TwirlPower account. By creating an account you represent that you are 18 or older. If you are a parent or guardian creating an account to track a minor athlete's progress, you represent that you have the authority to do so and that you accept these terms on behalf of yourself.` },
          { h: "3. Account Responsibilities", body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at ${LEGAL_EMAIL} if you suspect unauthorized access to your account. TwirlPower is not liable for losses caused by unauthorized use of your account.` },
          { h: "4. Acceptable Use", body: `You agree to use TwirlPower only for lawful purposes and in accordance with these terms. You agree not to:
- Provide false or misleading information
- Attempt to gain unauthorized access to any part of the app or its infrastructure
- Use the app to harass, harm, or discriminate against any person
- Interfere with the proper functioning of the app
- Attempt to reverse engineer, copy, or redistribute the app or its underlying code
- Use the app for any commercial purpose other than as permitted by your subscription` },
          { h: "5. Classification Information — Disclaimer", body: `TwirlPower tracks win counts and competition history to help you understand classification progress under the rules of USTA, NBTA, TU, DMA, and other organizations. However:

The classification levels displayed in TwirlPower are estimates based on the data you enter and our interpretation of each organization's published rules. They are not official determinations by any sanctioning organization.

Classification rules change. We make reasonable efforts to keep our rules current but cannot guarantee accuracy at all times.

TwirlPower is not affiliated with USTA, NBTA, TU, DMA, or any other twirling organization. Official classification determinations are made solely by those organizations according to their current rulebooks.

You should always verify your athlete's classification with the relevant organization before registering for a competition. TwirlPower expressly disclaims liability for any competition entry errors, disqualifications, or other consequences arising from reliance on classification data displayed in the app.` },
          { h: "6. Subscriptions and Refunds", body: `TwirlPower offers free and paid subscription tiers. Paid subscriptions are billed monthly or annually.

Satisfaction Guarantee: If you are not satisfied with your paid subscription for any reason, contact us at ${LEGAL_EMAIL} within 30 days of your initial payment or most recent renewal and we will issue a full refund — no questions asked.

After 30 days: Your subscription remains active until the end of the current billing period. We do not issue partial refunds for unused time after the 30-day window.

Cancellation: You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.

Free tier: The free tier is provided as-is with no guarantee of continued availability of specific features.` },
          { h: "7. Intellectual Property", body: `TwirlPower and all content, features, and functionality of the app — including but not limited to the classification engine, user interface, and branding — are owned by ${LEGAL_COMPANY} and protected by copyright and other intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from any part of the app without our written permission.` },
          { h: "8. Limitation of Liability", body: `To the fullest extent permitted by Colorado law, ${LEGAL_COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of data, competition entry fees, or other losses — arising from your use of TwirlPower, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising from these terms or your use of the app shall not exceed the amount you paid us in the 12 months preceding the claim.` },
          { h: "9. Indemnification", body: `You agree to indemnify and hold harmless ${LEGAL_COMPANY}, its officers, employees, and agents from any claims, damages, or expenses (including reasonable attorneys' fees) arising from your violation of these terms or your use of the app.` },
          { h: "10. Termination", body: `We reserve the right to suspend or terminate your account at any time for violation of these terms, with or without notice. You may delete your account at any time by contacting ${LEGAL_EMAIL}. Upon termination, your data will be deleted within 30 days as described in our Privacy Policy.` },
          { h: "11. Governing Law", body: `These terms are governed by the laws of the State of Colorado, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Colorado.` },
          { h: "12. Changes to Terms", body: `We may update these Terms of Service from time to time. We will notify you of material changes by email and by displaying a notice in the app. Continued use of TwirlPower after changes constitutes acceptance of the updated terms.` },
          { h: "13. Contact", body: `Questions about these Terms of Service? Contact The TwirlPower Team at ${LEGAL_EMAIL}.` },
        ].map(({ h, body }) => (
          <div key={h} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 8 }}>{h}</div>
            <div style={{ whiteSpace: "pre-line" }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PWA INSTALL BANNER ───────────────────────────────────────────────────────

// ─── PWA INSTALL BANNER ───────────────────────────────────────────────────────

function InstallBanner({ show, onInstall, onDismiss, isIos }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 9999,
      background: "white", borderRadius: 14, padding: "14px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 12,
      maxWidth: 480, margin: "0 auto",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: "#0d9488",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ color: "white", fontWeight: 800, fontSize: 13 }}>TP</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)", marginBottom: 2 }}>
          Add TwirlPower to your home screen
        </div>
        <div style={{ fontSize: 12, color: "var(--slate)" }}>
          {isIos ? "Tap below for quick access at competitions" : "Quick access at competitions — no app store needed"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={onDismiss}
          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)",
            background: "white", color: "var(--slate)", fontSize: 13, cursor: "pointer",
            fontFamily: "inherit" }}>
          Later
        </button>
        <button onClick={onInstall}
          style={{ padding: "6px 12px", borderRadius: 8, border: "none",
            background: "#0d9488", color: "white", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit" }}>
          {isIos ? "How?" : "Install"}
        </button>
      </div>
    </div>
  );
}

function IosInstallModal({ show, onDone, onClose }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 24, width: "100%",
        maxWidth: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: "var(--navy)", marginBottom: 16 }}>
          Add TwirlPower to your home screen
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {[
            { step: "1", text: "Tap the Share button at the bottom of Safari", icon: "⬆️" },
            { step: "2", text: "Scroll down and tap \"Add to Home Screen\"", icon: "➕" },
            { step: "3", text: "Tap \"Add\" in the top right corner", icon: "✓" },
          ].map(({ step, text, icon }) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0d9488",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {icon}
              </div>
              <span style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid var(--border)",
              background: "white", color: "var(--slate)", fontSize: 14, cursor: "pointer",
              fontFamily: "inherit" }}>
            Close
          </button>
          <button onClick={onDone}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none",
              background: "#0d9488", color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit" }}>
            Done — I added it!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── REPORT ISSUE BUTTON ──────────────────────────────────────────────────────

function ReportIssueButton({ page, authUser, familyAccount, coachAccount }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ description: "", expected: "", severity: "bug" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit() {
    if (!form.description) return;
    setLoading(true);
    const report = {
      page,
      description: form.description,
      expected: form.expected,
      severity: form.severity,
      user_email: authUser?.email || familyAccount?.email || coachAccount?.email || "unknown",
      user_role: coachAccount ? "coach" : familyAccount ? "family" : "unknown",
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    };
    await supabase.from("bug_reports").insert(report);
    await sendEmail("bug_report", "support@twirlpower.com", {
      ...report,
      appUrl: window.location.href,
    });
    setSent(true);
    setLoading(false);
    setTimeout(() => { setSent(false); setOpen(false); setForm({ description: "", expected: "", severity: "bug" }); }, 2000);
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(true)}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 500,
          width: 48, height: 48, borderRadius: "50%", background: "var(--navy)",
          border: "2px solid var(--brand)", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)", transition: "all 0.15s" }}
        title="Report an issue"
        onMouseEnter={e => e.currentTarget.style.background = "var(--brand)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--navy)"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </button>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Report an Issue"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" disabled={loading || !form.description || sent} onClick={handleSubmit}>
            {sent ? "✓ Sent!" : loading ? "Sending..." : "Submit Report"}
          </button>
        </>}>
        <div className="alert alert-info mb-3">
          <Icon name="info" size={14} color="var(--brand)" />
          <span style={{ fontSize: 12 }}>Thanks for helping us improve TwirlPower! We review every report.</span>
        </div>
        <div className="form-group">
          <label className="label">Page / section</label>
          <input className="input" value={page} readOnly style={{ background: "var(--bg)", color: "var(--muted)" }} />
        </div>
        <div className="form-group">
          <label className="label">Severity</label>
          <select className="select" value={form.severity} onChange={e => f("severity", e.target.value)}>
            <option value="bug">🐛 Bug — something is broken</option>
            <option value="ux">😤 Confusing — hard to use or understand</option>
            <option value="missing">💡 Missing — something I expected isn't here</option>
            <option value="other">💬 Other feedback</option>
          </select>
        </div>
        <div className="form-group">
          <label className="label">What happened? *</label>
          <textarea className="textarea" value={form.description} onChange={e => f("description", e.target.value)}
            rows={3} placeholder="Describe what you did and what went wrong..." autoFocus />
        </div>
        <div className="form-group">
          <label className="label">What did you expect to happen?</label>
          <textarea className="textarea" value={form.expected} onChange={e => f("expected", e.target.value)}
            rows={2} placeholder="Optional — describe the expected behavior" />
        </div>
      </Modal>
    </>
  );
}

// ─── BETA FEEDBACK POPUP ──────────────────────────────────────────────────────

function BetaFeedbackPopup({ authUser, familyAccount, coachAccount }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ rating: 0, working: "", frustrating: "", missing: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const KEY = "tp_feedback_sessions";
    const LAST_KEY = "tp_feedback_last";
    const sessions = parseInt(localStorage.getItem(KEY) || "0") + 1;
    localStorage.setItem(KEY, sessions);

    const lastShown = localStorage.getItem(LAST_KEY);
    const daysSinceLast = lastShown
      ? (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24)
      : 999;

    // Show on sessions 3, 7, 15, then every 30 days
    const triggerSessions = [3, 7, 15];
    const shouldShow = (triggerSessions.includes(sessions) || (sessions > 15 && daysSinceLast >= 30))
      && daysSinceLast >= 1;

    if (shouldShow) {
      setTimeout(() => setOpen(true), 8000); // 8 second delay after load
    }
  }, []);

  async function handleSubmit() {
    if (form.rating === 0) return;
    setLoading(true);
    const feedback = {
      rating: form.rating,
      working: form.working,
      frustrating: form.frustrating,
      missing: form.missing,
      user_email: authUser?.email || familyAccount?.email || coachAccount?.email || "unknown",
      user_role: coachAccount ? "coach" : familyAccount ? "family" : "unknown",
      created_at: new Date().toISOString(),
    };
    await supabase.from("beta_feedback").insert(feedback);
    await sendEmail("beta_feedback", "support@twirlpower.com", feedback);
    localStorage.setItem("tp_feedback_last", Date.now().toString());
    setSent(true);
    setLoading(false);
    setTimeout(() => { setSent(false); setOpen(false); }, 2000);
  }

  const stars = [1, 2, 3, 4, 5];

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 600,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ maxWidth: 480, width: "100%", padding: "32px 28px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, marginBottom: 4 }}>👋 Quick feedback?</div>
            <div style={{ fontSize: 13, color: "var(--slate)" }}>You're helping us build TwirlPower. 60 seconds, we promise.</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none",
            cursor: "pointer", color: "var(--muted)", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
        </div>

        <div className="form-group">
          <label className="label">Overall, how would you rate TwirlPower so far?</label>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {stars.map(s => (
              <button key={s} onClick={() => f("rating", s)}
                style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer",
                  opacity: form.rating >= s ? 1 : 0.3, transition: "opacity 0.1s" }}>
                ⭐
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="label">What's working well?</label>
          <textarea className="textarea" value={form.working} onChange={e => f("working", e.target.value)}
            rows={2} placeholder="What do you like so far?" />
        </div>
        <div className="form-group">
          <label className="label">What's frustrating or confusing?</label>
          <textarea className="textarea" value={form.frustrating} onChange={e => f("frustrating", e.target.value)}
            rows={2} placeholder="What's not working the way you expect?" />
        </div>
        <div className="form-group">
          <label className="label">What's missing?</label>
          <textarea className="textarea" value={form.missing} onChange={e => f("missing", e.target.value)}
            rows={2} placeholder="What would make TwirlPower more useful for you?" />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={loading || form.rating === 0 || sent} onClick={handleSubmit}>
            {sent ? "✓ Thank you!" : loading ? "Sending..." : "Submit Feedback"}
          </button>
          <button className="btn btn-ghost" onClick={() => setOpen(false)}>Skip for now</button>
          <button className="btn btn-ghost" style={{ fontSize: 11, color: "var(--muted)" }}
            onClick={() => {
              localStorage.setItem("tp_feedback_last", (Date.now() + 1000 * 60 * 60 * 24 * 14).toString());
              setOpen(false);
            }}>
            Don't ask 2 weeks
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STUDIOS ─────────────────────────────────────────────────────────────────

// Club search + select widget (used in twirler profile edit)
function ArchivedClubCheck({ query, supabase, onCreate }) {
  const [archived, setArchived] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      setLoading(true);
      const { data } = await supabase.from("clubs").select("id, name, city, state")
        .ilike("name", query).eq("status", "archived").limit(1);
      setArchived(data?.[0] || null);
      setLoading(false);
    }
    check();
  }, [query]);

  if (loading) return null;

  if (archived) {
    return (
      <div className="alert alert-warn" style={{ marginTop: 8 }}>
        <Icon name="alert" size={14} color="var(--amber)" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>"{archived.name}" exists but is archived</div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 2 }}>
            {[archived.city, archived.state].filter(Boolean).join(", ")}
            {" · "}To use this club, contact a TwirlPower admin to request reactivation.
          </div>
        </div>
      </div>
    );
  }

  return (
    <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
      onClick={onCreate}>
      + Add "{query}" as a new club
    </button>
  );
}

function ClubSelector({ value, onChange, supabase }) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", city: "", state: "", coachName: "", coachEmail: "" });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(null);
  const [selected, setSelected] = useState(!!value); // suppress search when value already chosen
  const debounceRef = useRef(null);

  useEffect(() => {
    if (selected) return; // don't search if user already picked one
    if (!query || query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase.from("clubs").select("*")
        .ilike("name", `%${query}%`).neq("status", "archived").limit(8);
      setResults(data || []);
      setLoading(false);
    }, 300);
  }, [query, selected]);

  async function handleCreate() {
    if (!createForm.name) return;
    setCreating(true);
    const { data: club, error } = await supabase.from("clubs").insert({
      name: createForm.name,
      city: createForm.city || null,
      state: createForm.state || null,
      status: "unclaimed",
      created_by: "twirler",
    }).select().single();
    if (!error && club) {
      if (createForm.coachEmail) {
        await sendEmail("club_unclaimed_notify", createForm.coachEmail, {
          coachName: createForm.coachName || "Coach",
          clubName: club.name,
          city: club.city,
          state: club.state,
        });
      }
      setCreated(club);
      onChange(club.name);
      setQuery(club.name);
      setSelected(true);
      setResults([]);
      setShowCreate(false);
    }
    setCreating(false);
  }

  function selectClub(club) {
    onChange(club.name);
    setQuery(club.name);
    setSelected(true);
    setResults([]);
  }

  function clearSelection() {
    setQuery("");
    setSelected(false);
    setResults([]);
    onChange("");
  }

  const statusBadge = (s) => {
    if (s.status === "claimed") return <span className="badge badge-green" style={{ fontSize: 9 }}>Claimed</span>;
    if (s.status === "pending_claim") return <span className="badge badge-amber" style={{ fontSize: 9 }}>Pending</span>;
    return <span className="badge badge-gray" style={{ fontSize: 9 }}>Unclaimed</span>;
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input className="input" value={query}
          onChange={e => { setQuery(e.target.value); setSelected(false); onChange(e.target.value); }}
          placeholder="Search for your club..."
          style={{ paddingRight: selected ? 70 : 12 }} />
        {loading && !selected && (
          <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            fontSize: 11, color: "var(--muted)" }}>Searching...</div>
        )}
        {selected && query && (
          <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 600 }}>✓ Selected</span>
            <button onClick={clearSelection} style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: 14, lineHeight: 1, padding: "0 2px" }} title="Clear">×</button>
          </div>
        )}
      </div>

      {/* Search results dropdown */}
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--card)",
          border: "1px solid var(--border)", borderRadius: 8, zIndex: 100, marginTop: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 220, overflowY: "auto" }}>
          {results.map(s => (
            <div key={s.id} onClick={() => selectClub(s)}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{s.name}</div>
                {(s.city || s.state) && (
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{[s.city, s.state].filter(Boolean).join(", ")}</div>
                )}
              </div>
              {statusBadge(s)}
            </div>
          ))}
          <div onClick={() => { setShowCreate(true); setResults([]); }}
            style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "var(--brand)", fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            + Add "{query}" as a new club
          </div>
        </div>
      )}

      {/* No results — offer to create */}
      {query.length >= 2 && results.length === 0 && !loading && (
        <ArchivedClubCheck query={query} supabase={supabase}
          onCreate={() => { setShowCreate(true); setCreateForm(f => ({ ...f, name: query })); }} />
      )}

      {/* Create club form */}
      {showCreate && (
        <div className="card-sm" style={{ marginTop: 8, background: "var(--bg)", border: "1px solid var(--brand)" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 10 }}>Add new club</div>
          <div className="form-group">
            <label className="label">Club name *</label>
            <input className="input" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">City</label>
              <input className="input" value={createForm.city} onChange={e => setCreateForm(f => ({ ...f, city: e.target.value }))} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label className="label">State</label>
              <select className="select" value={createForm.state} onChange={e => setCreateForm(f => ({ ...f, state: e.target.value }))}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>
            Know your coach's email? We'll notify them so they can claim this club.
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="label">Coach name (optional)</label>
              <input className="input" value={createForm.coachName} onChange={e => setCreateForm(f => ({ ...f, coachName: e.target.value }))} placeholder="Coach name" />
            </div>
            <div className="form-group">
              <label className="label">Coach email (optional)</label>
              <input className="input" type="email" value={createForm.coachEmail} onChange={e => setCreateForm(f => ({ ...f, coachEmail: e.target.value }))} placeholder="coach@example.com" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={!createForm.name || creating} onClick={handleCreate}>
              {creating ? "Adding..." : "Add Club"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {created && (
        <div className="alert alert-success" style={{ marginTop: 8 }}>
          <Icon name="check" size={13} color="var(--green)" />
          <span style={{ fontSize: 12 }}>Club added! {createForm.coachEmail ? "Coach notified by email." : ""}</span>
        </div>
      )}
    </div>
  );
}

// Club page — coach manages their claimed club
function ClubPage({ coachAccount, supabase, setPage, coachClubs, setCoachClubs,
  coachClubClaims, setCoachClubClaims, loadCoachData, twirlers,
  pendingClubMembers, setPendingClubMembers }) {

  const [selectedClubId, setSelectedClubId] = useState(coachClubs[0]?.id || null);
  const [tab, setTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [clubCoaches, setClubCoaches] = useState([]);
  const [loadingClub, setLoadingClub] = useState(false);

  // Create/claim flow
  const [showCreate, setShowCreate] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [createForm, setCreateForm] = useState({ name: coachAccount?.club || "", city: "", state: "", message: "", file: null });
  const [claimSearch, setClaimSearch] = useState("");
  const [claimResults, setClaimResults] = useState([]);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimFile, setClaimFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Invite coach flow
  const [inviteCoachEmail, setInviteCoachEmail] = useState("");
  const [inviteCoachName, setInviteCoachName] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  // Invite twirler flow
  const [inviteTwirlerEmail, setInviteTwirlerEmail] = useState("");
  const [inviteTwirlerName, setInviteTwirlerName] = useState("");
  const [twirlerInviteSent, setTwirlerInviteSent] = useState(false);

  const selectedClub = coachClubs.find(c => c.id === selectedClubId) || coachClubs[0];
  const isOwner = selectedClub?.coachRole === "owner";

  useEffect(() => {
    if (selectedClub) {
      setForm(selectedClub);
      loadClubDetails(selectedClub.id);
    }
  }, [selectedClubId, coachClubs.length]);

  async function loadClubDetails(clubId) {
    setLoadingClub(true);
    const [{ data: m }, { data: cc }] = await Promise.all([
      supabase.from("club_members")
        .select("*, twirlers(first_name, organizations, family_accounts(email, parent_name))")
        .eq("club_id", clubId),
      supabase.from("club_coaches")
        .select("*, coach_accounts(name, email, studio, organizations)")
        .eq("club_id", clubId)
        .eq("status", "active"),
    ]);
    setMembers(m || []);
    setClubCoaches(cc || []);
    setLoadingClub(false);
  }

  async function saveClub() {
    setSaving(true);
    const { data: updated } = await supabase.from("clubs").update({
      name: form.name, city: form.city, state: form.state,
      website: form.website, phone: form.phone, description: form.description,
    }).eq("id", selectedClub.id).select().single();
    if (updated) {
      setCoachClubs(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    }
    setEditMode(false);
    setSaving(false);
  }

  async function submitCreateClub() {
    if (!createForm.name) return;
    setSubmitting(true);
    const { data: club } = await supabase.from("clubs").insert({
      name: createForm.name, city: createForm.city || null,
      state: createForm.state || null, status: "pending_claim", created_by: "coach",
    }).select().single();
    if (club) {
      let docUrl = null;
      if (createForm.file) {
        const ext = createForm.file.name.split(".").pop();
        const path = `${coachAccount.id}/club_claim_${club.id}.${ext}`;
        const { data: up } = await supabase.storage.from("documents").upload(path, createForm.file, { upsert: true });
        if (up) docUrl = supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
      }
      await supabase.from("club_claim_requests").insert({
        club_id: club.id, coach_id: coachAccount.id,
        message: createForm.message || "Coach created this club.",
        document_url: docUrl, status: "pending",
      });
      // Insert club_coaches row so coach can see it immediately (pending approval)
      await supabase.from("club_coaches").upsert({
        club_id: club.id, coach_id: coachAccount.id,
        role: "owner", status: "active",
      }, { onConflict: "club_id,coach_id" });
      await sendEmail("club_claim_request", "support@twirlpower.com", {
        coachName: coachAccount.name, coachEmail: coachAccount.email,
        clubName: club.name, city: club.city, state: club.state,
        message: createForm.message, type: "new",
      });
      setCoachClubClaims(prev => [...prev, { clubs: { name: club.name }, status: "pending" }]);
      setSuccessMsg(`Club "${club.name}" created and submitted for admin approval.`);
      setShowCreate(false);
    }
    setSubmitting(false);
  }

  async function searchClubsToClaim() {
    if (claimSearch.length < 2) return;
    const { data } = await supabase.from("clubs").select("*")
        .ilike("name", `%${claimSearch}%`).neq("status", "archived").limit(8);
    setClaimResults(data || []);
  }

  async function submitClaimExisting(club) {
    setSubmitting(true);
    let docUrl = null;
    if (claimFile) {
      const ext = claimFile.name.split(".").pop();
      const path = `${coachAccount.id}/club_claim_existing_${club.id}.${ext}`;
      const { data: up } = await supabase.storage.from("documents").upload(path, claimFile, { upsert: true });
      if (up) docUrl = supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;
    }
    await supabase.from("club_claim_requests").insert({
      club_id: club.id, coach_id: coachAccount.id,
      message: claimMessage, document_url: docUrl, status: "pending",
    });
    await sendEmail("club_claim_request", "support@twirlpower.com", {
      coachName: coachAccount.name, coachEmail: coachAccount.email,
      clubName: club.name, city: club.city, state: club.state,
      message: claimMessage, type: "existing",
    });
    setCoachClubClaims(prev => [...prev, { clubs: { name: club.name }, status: "pending" }]);
    setSuccessMsg(`Claim request for "${club.name}" submitted for admin approval.`);
    setShowClaim(false);
    setClaimResults([]);
    setSubmitting(false);
  }

  async function approveMember(memberId) {
    await supabase.from("club_members").update({ status: "active" }).eq("id", memberId);
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: "active" } : m));
    // Also clear from sidebar pending list
    if (setPendingClubMembers) {
      setPendingClubMembers(prev => prev.filter(m => m.id !== memberId));
    }
  }

  async function removeMember(memberId) {
    if (!window.confirm("Remove this twirler from the club?")) return;
    await supabase.from("club_members").delete().eq("id", memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
  }

  async function promoteCoach(coachId) {
    await supabase.from("club_coaches").update({ role: "owner" })
      .eq("club_id", selectedClub.id).eq("coach_id", coachId);
    setClubCoaches(prev => prev.map(c => c.coach_id === coachId ? { ...c, role: "owner" } : c));
  }

  async function removeCoach(coachId) {
    if (!window.confirm("Remove this coach from the club?")) return;
    await supabase.from("club_coaches").delete()
      .eq("club_id", selectedClub.id).eq("coach_id", coachId);
    setClubCoaches(prev => prev.filter(c => c.coach_id !== coachId));
  }

  async function sendCoachInvite() {
    if (!inviteCoachEmail || !selectedClub) return;
    await sendEmail("club_invite_coach", inviteCoachEmail, {
      coachName: inviteCoachName || "Coach",
      inviterName: coachAccount.name,
      clubName: selectedClub.name,
      city: selectedClub.city,
      state: selectedClub.state,
    });
    setInviteSent(true);
    setInviteCoachEmail(""); setInviteCoachName("");
    setTimeout(() => setInviteSent(false), 3000);
  }

  async function sendTwirlerInvite() {
    if (!inviteTwirlerEmail || !selectedClub) return;
    await sendEmail("club_invite_external", inviteTwirlerEmail, {
      twirlerName: inviteTwirlerName || "a twirler",
      clubName: selectedClub.name,
      coachName: coachAccount.name,
      city: selectedClub.city,
      state: selectedClub.state,
    });
    setTwirlerInviteSent(true);
    setInviteTwirlerEmail(""); setInviteTwirlerName("");
    setTimeout(() => setTwirlerInviteSent(false), 3000);
  }

  const tabs = [
    { id: "profile", label: "Club Profile" },
    { id: "coaches", label: `Coaches (${clubCoaches.length})` },
    { id: "members", label: `Twirlers (${members.length})` },
    { id: "invite", label: "Invite" },
  ];

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Clubs</h1>
          <p className="page-sub">{coachClubs.length} club{coachClubs.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => { setShowCreate(true); setShowClaim(false); }}>
            + Create Club
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setShowClaim(true); setShowCreate(false); }}>
            Claim Existing
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="alert alert-success mb-4">
          <Icon name="check" size={14} color="var(--green)" />
          <span style={{ fontSize: 13 }}>{successMsg}</span>
        </div>
      )}

      {/* Pending claims */}
      {coachClubClaims.length > 0 && (
        <div className="alert alert-info mb-4">
          <Icon name="info" size={14} color="var(--brand)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Pending admin approval</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>
              {coachClubClaims.map(c => c.clubs?.name).join(", ")} — you'll be notified once approved.
            </div>
          </div>
        </div>
      )}

      {/* Create club form */}
      {showCreate && (
        <div className="card mb-4" style={{ borderTop: "3px solid var(--brand)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Create a new club</div>
          <div className="form-row">
            <div className="form-group"><label className="label">Club name *</label>
              <input className="input" value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your club name" autoFocus /></div>
            <div className="form-group"><label className="label">Phone</label>
              <input className="input" value={createForm.phone || ""}
                onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="label">City</label>
              <input className="input" value={createForm.city}
                onChange={e => setCreateForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div className="form-group"><label className="label">State</label>
              <select className="select" value={createForm.state}
                onChange={e => setCreateForm(f => ({ ...f, state: e.target.value }))}>
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label className="label">Message to admin (optional)</label>
            <textarea className="textarea" rows={2} value={createForm.message}
              onChange={e => setCreateForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Brief note about your club..." /></div>
          <div className="form-group"><label className="label">Supporting document (optional)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={e => setCreateForm(f => ({ ...f, file: e.target.files?.[0] }))}
              style={{ fontSize: 12, color: "var(--slate)" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Business license, club registration, or proof of ownership</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" disabled={!createForm.name || submitting}
              onClick={submitCreateClub}>{submitting ? "Submitting..." : "Submit for Approval"}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Claim existing form */}
      {showClaim && (
        <div className="card mb-4" style={{ borderTop: "3px solid var(--slate)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Claim an existing club</div>
          <div className="flex gap-2 mb-3">
            <input className="input" value={claimSearch}
              onChange={e => setClaimSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchClubsToClaim()}
              placeholder="Search by club name..." />
            <button className="btn btn-secondary btn-sm" onClick={searchClubsToClaim}>Search</button>
          </div>
          {claimResults.map(c => (
            <div key={c.id} className="card-sm mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{[c.city, c.state].filter(Boolean).join(", ")}</div>
                  <span className={`badge ${c.status === "claimed" ? "badge-green" : "badge-gray"}`} style={{ fontSize: 9 }}>{c.status}</span>
                </div>
                {c.status !== "claimed" ? (
                  <div>
                    <textarea className="textarea" rows={1} value={claimMessage}
                      onChange={e => setClaimMessage(e.target.value)}
                      placeholder="Brief message (optional)" style={{ marginBottom: 6 }} />
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setClaimFile(e.target.files?.[0])}
                      style={{ fontSize: 11, marginBottom: 6 }} />
                    <button className="btn btn-primary btn-sm" disabled={submitting}
                      onClick={() => submitClaimExisting(c)}>
                      {submitting ? "..." : "Request Claim"}
                    </button>
                  </div>
                ) : (
                  <span className="badge badge-green" style={{ fontSize: 10 }}>Already claimed</span>
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => setShowClaim(false)}>Cancel</button>
        </div>
      )}

      {/* No clubs yet */}
      {coachClubs.length === 0 && !showCreate && !showClaim && (
        <div className="empty-state">
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏫</div>
          <h3>No clubs yet</h3>
          <p>Create a new club listing or claim an existing one. Admin approval required.</p>
        </div>
      )}

      {/* Club selector tabs if multiple clubs */}
      {coachClubs.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {coachClubs.map(c => (
            <button key={c.id} onClick={() => setSelectedClubId(c.id)}
              className={`chip ${c.id === selectedClubId ? "selected" : ""}`}>
              {c.name}
              {c.coachRole === "owner" && <span style={{ marginLeft: 4, fontSize: 10 }}>👑</span>}
            </button>
          ))}
        </div>
      )}

      {/* Selected club detail */}
      {selectedClub && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedClub.name}</div>
              <div style={{ fontSize: 13, color: "var(--slate)" }}>
                {[selectedClub.city, selectedClub.state].filter(Boolean).join(", ")}
                <span className={`badge ${selectedClub.status === "claimed" ? "badge-green" : "badge-amber"}`}
                  style={{ fontSize: 10, marginLeft: 8 }}>
                  {selectedClub.status === "claimed" ? "Active" : "Pending approval"}
                </span>
                {selectedClub.coachRole === "owner" && (
                  <span className="badge badge-purple" style={{ fontSize: 10, marginLeft: 4 }}>👑 Owner</span>
                )}
              </div>
            </div>
          </div>

          {selectedClub.status === "pending_claim" && (
            <div className="alert alert-warn mb-4">
              <Icon name="alert" size={14} color="var(--amber)" />
              <span style={{ fontSize: 13 }}>Pending admin approval. You'll be notified once approved.</span>
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  border: "none", background: "none", fontFamily: "inherit",
                  color: tab === t.id ? "var(--brand)" : "var(--slate)",
                  borderBottom: tab === t.id ? "2px solid var(--brand)" : "2px solid transparent",
                  marginBottom: -1 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {tab === "profile" && (
            <div className="card">
              {editMode && isOwner ? (
                <div>
                  <div className="form-row">
                    <div className="form-group"><label className="label">Club name</label>
                      <input className="input" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div className="form-group"><label className="label">Phone</label>
                      <input className="input" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="label">City</label>
                      <input className="input" value={form.city || ""} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                    <div className="form-group"><label className="label">State</label>
                      <select className="select" value={form.state || ""} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
                        <option value="">Select</option>
                        {US_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group"><label className="label">Website</label>
                    <input className="input" value={form.website || ""} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" /></div>
                  <div className="form-group"><label className="label">Description</label>
                    <textarea className="textarea" value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm" disabled={saving} onClick={saveClub}>{saving ? "Saving..." : "Save"}</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setForm(selectedClub); setEditMode(false); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                    {isOwner && selectedClub.status === "claimed" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(true)}>
                        <Icon name="edit" size={13} /> Edit
                      </button>
                    )}
                  </div>
                  {[["Name", selectedClub.name], ["Location", [selectedClub.city, selectedClub.state].filter(Boolean).join(", ") || "—"],
                    ["Phone", selectedClub.phone || "—"], ["Website", selectedClub.website || "—"]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", width: 90, flexShrink: 0 }}>{label}</div>
                      <div style={{ fontSize: 13, color: "var(--navy)" }}>
                        {label === "Website" && selectedClub.website
                          ? <a href={selectedClub.website} target="_blank" rel="noreferrer" style={{ color: "var(--brand)" }}>{selectedClub.website}</a>
                          : val}
                      </div>
                    </div>
                  ))}
                  {selectedClub.description && (
                    <div style={{ marginTop: 12, fontSize: 13, color: "var(--slate)", lineHeight: 1.7 }}>{selectedClub.description}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Coaches tab */}
          {tab === "coaches" && (
            <div>
              {loadingClub ? <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading...</div> :
                clubCoaches.length === 0 ? (
                  <div className="empty-state"><h3>No other coaches yet</h3><p>Invite coaches to join your club.</p></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {clubCoaches.map(cc => (
                      <div key={cc.id} className="card-sm flex items-center gap-3">
                        <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "#ede9fe", color: "#6d28d9" }}>
                          {initials(cc.coach_accounts?.name || "?")}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{cc.coach_accounts?.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{cc.coach_accounts?.email}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {cc.role === "owner"
                            ? <span className="badge badge-purple" style={{ fontSize: 10 }}>👑 Owner</span>
                            : <span className="badge badge-gray" style={{ fontSize: 10 }}>Coach</span>}
                          {isOwner && cc.coach_id !== coachAccount.id && (
                            <>
                              {cc.role !== "owner" && (
                                <button className="btn btn-secondary btn-sm"
                                  onClick={() => promoteCoach(cc.coach_id)}
                                  style={{ fontSize: 10, padding: "3px 8px" }}>
                                  Promote to Owner
                                </button>
                              )}
                              <button className="btn btn-danger btn-sm"
                                onClick={() => removeCoach(cc.coach_id)}
                                style={{ fontSize: 10, padding: "3px 8px" }}>
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* Members tab */}
          {tab === "members" && (
            <div>
              {loadingClub ? <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading...</div> :
                members.length === 0 ? (
                  <div className="empty-state"><h3>No twirlers yet</h3><p>Twirlers who select your club will appear here.</p></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {members.map(m => {
                      const t = m.twirlers;
                      return (
                        <div key={m.id} className="card-sm flex items-center gap-3"
                          style={{ borderLeft: m.status === "active" ? "3px solid var(--green)" : "3px solid var(--amber)" }}>
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12, background: "var(--brand)", color: "white" }}>
                            {initials(t?.first_name || "?")}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{t?.first_name}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>
                              {t?.family_accounts?.parent_name} · {(t?.organizations || []).join(", ")}
                            </div>
                          </div>
                          {m.status === "pending" ? (
                            <div className="flex gap-2">
                              <span className="badge badge-amber" style={{ fontSize: 10 }}>Pending</span>
                              <button className="btn btn-primary btn-sm" onClick={() => approveMember(m.id)}>✓ Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => removeMember(m.id)}>✗</button>
                            </div>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <span className="badge badge-green" style={{ fontSize: 10 }}>Active</span>
                              <button className="btn btn-ghost btn-sm" onClick={() => removeMember(m.id)}
                                style={{ fontSize: 11 }}>Remove</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* Invite tab */}
          {tab === "invite" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Invite coach */}
              {isOwner && (
                <div className="card" style={{ maxWidth: 480 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Invite a coach</div>
                  <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                    Coaches with a TwirlPower account can also request to join your club from their coach profile.
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="label">Coach name</label>
                      <input className="input" value={inviteCoachName} onChange={e => setInviteCoachName(e.target.value)} placeholder="Optional" /></div>
                    <div className="form-group"><label className="label">Coach email *</label>
                      <input className="input" type="email" value={inviteCoachEmail} onChange={e => setInviteCoachEmail(e.target.value)} placeholder="coach@example.com" /></div>
                  </div>
                  <button className="btn btn-primary btn-sm" disabled={!inviteCoachEmail} onClick={sendCoachInvite}>Send Coach Invite</button>
                  {inviteSent && <div className="alert alert-success" style={{ marginTop: 8 }}><Icon name="check" size={13} color="var(--green)" /><span style={{ fontSize: 12 }}>Invitation sent!</span></div>}
                </div>
              )}

              {/* Invite twirler */}
              <div className="card" style={{ maxWidth: 480 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Invite a twirler</div>
                <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 12 }}>
                  Send an email invitation to families who aren't on TwirlPower yet.
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="label">Twirler name (optional)</label>
                    <input className="input" value={inviteTwirlerName} onChange={e => setInviteTwirlerName(e.target.value)} placeholder="First name" /></div>
                  <div className="form-group"><label className="label">Parent/guardian email *</label>
                    <input className="input" type="email" value={inviteTwirlerEmail} onChange={e => setInviteTwirlerEmail(e.target.value)} placeholder="family@example.com" /></div>
                </div>
                <button className="btn btn-primary btn-sm" disabled={!inviteTwirlerEmail} onClick={sendTwirlerInvite}>Send Twirler Invite</button>
                {twirlerInviteSent && <div className="alert alert-success" style={{ marginTop: 8 }}><Icon name="check" size={13} color="var(--green)" /><span style={{ fontSize: 12 }}>Invitation sent!</span></div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function OverrideModal({ open, onClose, data, onSave }) {
  const [newLevel, setNewLevel] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open && data) { setNewLevel(data.nextLevel || ""); setReason(""); setConfirmed(false); }
  }, [open, data]);

  if (!data) return null;
  const levels = ORGS[data.orgId]?.levels || [];

  return (
    <Modal open={open} onClose={onClose} title="Override Classification"
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!newLevel || !confirmed} onClick={() => { onSave(data.twirlerId, data.orgId, data.event, newLevel, reason); onClose(); }}>
          Apply Override
        </button>
      </>}>
      <div className="alert alert-warn mb-4">
        <Icon name="alert" size={16} color="var(--amber)" />
        <div>
          <strong>Manual overrides are recorded in the classification history.</strong>
          <div style={{ fontSize: 13, marginTop: 4 }}>This should only be used to correct data errors or when instructed by a USTA/NBTA official. Overriding classification may affect competition eligibility records.</div>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontSize: 14 }}>
        <span style={{ color: "var(--slate)" }}>Event:</span> <strong>{data.event}</strong> · <span style={{ color: "var(--slate)" }}>Org:</span> <strong>{data.orgId}</strong>
      </div>
      <div className="form-group">
        <label className="label">Current level</label>
        <input className="input" value={data.currentLevel} disabled style={{ background: "#f1f5f9" }} />
      </div>
      <div className="form-group">
        <label className="label">Override to level</label>
        <select className="select" value={newLevel} onChange={e => setNewLevel(e.target.value)}>
          <option value="">Select level</option>
          {levels.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="label">Reason for override</label>
        <textarea className="textarea" value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="e.g. Data entry error correction" />
      </div>
      <label className="toggle" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ marginRight: 8 }} />
        <span style={{ fontSize: 13 }}>I understand this override will be logged and may affect eligibility records.</span>
      </label>
    </Modal>
  );
}
