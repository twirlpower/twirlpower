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
 for (const orgId of twirlerProfile.organizations) {
  const org = ORGS[orgId];
  if (!org) continue;
  progress[orgId] = {};

  if (org.winModel === "cumulative") {
   for (const event of org.leveledEvents) {
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

  for (const event of org.leveledEvents) {
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
function fmtDate(d) { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
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

 const html = `<!DOCTYPE html><html><head><title>Classification Record — ${twirler.firstName}</title><style>body{font-family:Georgia,serif;color:#0f172a;max-width:900px;margin:0 auto;padding:32px}h1{font-size:24px;margin-bottom:4px}.sub{color:#64748b;font-size:13px;margin-bottom:24px}.section{margin-bottom:24px}h2{font-size:13px;font-weight:700;text-transform:uppercase;color:#334155;border-bottom:2px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f1f5f9;text-align:left;padding:6px 8px;font-size:10px;text-transform:uppercase;color:#64748b}td{padding:6px 8px;border-bottom:1px solid #f1f5f9}tr:last-child td{border-bottom:none}.footer{margin-top:28px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px}</style></head><body><h1>Classification Record — ${twirler.firstName}</h1><div class="sub">Generated ${today} · TwirlPower${twirler.dob ? ` · Age ${age}` : ""}${twirler.studio ? ` · ${twirler.studio}` : ""}</div><div class="section"><h2>Current Classification Levels</h2><table><thead><tr><th>Org</th><th>Event</th><th>Level</th><th>Age Division</th><th>Wins</th><th>Next Level</th></tr></thead><tbody>${rows || "<tr><td colspan=6>No data</td></tr>"}</tbody></table></div>${winRows ? `<div class="section"><h2>Recent First-Place Wins</h2><table><thead><tr><th>Date</th><th>Competition</th><th>Org</th><th>Event</th><th>Level</th><th>Sanctioned</th></tr></thead><tbody>${winRows}</tbody></table></div>` : ""}<div class="footer">Self-reported record maintained by the family using TwirlPower. Governed by each org's official rulebook. Print date: ${today}.</div></body></html>`;

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

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--navy:#0f172a;--navy2:#1e293b;--navy3:#334155;--slate:#64748b;--muted:#94a3b8;--border:#e2e8f0;--bg:#f8fafc;--card:#ffffff;--blue:#3b82f6;--blue2:#2563eb;--purple:#8b5cf6;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--brand:#0d9488;--brand2:#0f766e;--brand-light:#f0fdfa;--pink:#e11d6a;--pink2:#be1259;--pink-light:#fce7f0;--gold:#f59e0b;--gold-light:#fef3c7;--radius:12px;--radius-sm:8px}body.dark{--bg:#0f172a;--card:#1e293b;--border:#334155;--slate:#94a3b8;--muted:#64748b;--navy:#f1f5f9;--navy2:#e2e8f0;--navy3:#cbd5e1}body.dark .input,body.dark .select,body.dark .textarea{background:#0f172a;color:#f1f5f9}body.dark .table tr:hover td{background:#334155}body.dark .badge-gray{background:#334155;color:#cbd5e1}body.dark .modal{background:#1e293b}body.dark .modal-header,body.dark .modal-footer{border-color:#334155}body.dark .card-sm{background:#0f172a}body.dark .alert-info{background:#0c2340;border-color:#1e40af;color:#93c5fd}body.dark .alert-warn{background:#2d1a00;border-color:#92400e;color:#fcd34d}body.dark .alert-success{background:#052e16;border-color:#166534;color:#86efac}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--navy)}.serif{font-family:'DM Serif Display',serif}.app{display:flex;min-height:100vh}.sidebar{width:240px;min-width:240px;background:var(--navy);display:flex;flex-direction:column;padding:0;position:sticky;top:0;height:100vh;overflow-y:auto}.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid rgba(255,255,255,0.08)}.sidebar-logo h1{font-family:'DM Serif Display',serif;color:white;font-size:22px;line-height:1.1}.sidebar-logo h1 span{color:var(--brand)}.sidebar-logo p{color:var(--muted);font-size:10px;margin-top:5px;letter-spacing:1px;text-transform:uppercase}.sidebar-section{padding:12px 0}.sidebar-label{padding:6px 20px;font-size:10px;font-weight:600;letter-spacing:1.2px;color:var(--slate);text-transform:uppercase}.nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;cursor:pointer;color:var(--muted);font-size:14px;font-weight:400;transition:all 0.15s;border-left:3px solid transparent}.nav-item:hover{color:white;background:rgba(255,255,255,0.05)}.nav-item.active{color:white;background:rgba(13,148,136,0.15);border-left-color:var(--brand)}.nav-icon{width:18px;height:18px;flex-shrink:0}.sidebar-twirler{padding:12px 16px;margin:8px;background:rgba(255,255,255,0.06);border-radius:var(--radius-sm);cursor:pointer}.sidebar-twirler:hover{background:rgba(255,255,255,0.1)}.sidebar-twirler.active{background:rgba(13,148,136,0.2);border:1px solid rgba(13,148,136,0.4)}.sidebar-twirler .name{color:white;font-size:13px;font-weight:500}.sidebar-twirler .sub{color:var(--muted);font-size:11px;margin-top:2px}.main{flex:1;overflow-y:auto;padding:32px;max-width:1000px}.page-header{margin-bottom:28px}.page-title{font-family:'DM Serif Display',serif;font-size:28px;color:var(--navy)}.page-sub{color:var(--slate);font-size:14px;margin-top:4px}.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px}.card-sm{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px}.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}.grid-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}.stat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px}.stat-label{font-size:11px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:var(--slate);margin-bottom:6px}.stat-value{font-size:26px;font-weight:600;color:var(--navy);line-height:1}.stat-sub{font-size:12px;color:var(--slate);margin-top:4px}.badge{display:inline-flex;align-items:center;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.3px}.badge-blue{background:#dbeafe;color:#1d4ed8}.badge-purple{background:#ede9fe;color:#6d28d9}.badge-green{background:#dcfce7;color:#15803d}.badge-amber{background:#fef3c7;color:#b45309}.badge-red{background:#fee2e2;color:#b91c1c}.badge-gray{background:#f1f5f9;color:#475569}.badge-warn{background:#fff7ed;color:#c2410c;border:1px solid #fed7aa}.progress-bar{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden}.progress-fill{height:100%;border-radius:999px;transition:width 0.3s}.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;cursor:pointer;border:none;transition:all 0.15s;font-family:inherit}.btn-primary{background:var(--brand);color:white}.btn-primary:hover{background:var(--brand2)}.btn-secondary{background:var(--bg);color:var(--navy);border:1px solid var(--border)}.btn-secondary:hover{background:var(--border)}.btn-danger{background:#fee2e2;color:var(--red)}.btn-danger:hover{background:#fecaca}.btn-sm{padding:6px 12px;font-size:12px}.btn-ghost{background:transparent;color:var(--slate);border:1px solid var(--border)}.btn-ghost:hover{background:var(--bg)}.input,.select,.textarea{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;color:var(--navy);background:white;outline:none;transition:border 0.15s}.input:focus,.select:focus,.textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(13,148,136,0.12)}.label{font-size:12px;font-weight:600;color:var(--slate);margin-bottom:5px;display:block;letter-spacing:0.3px}.form-group{margin-bottom:14px}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.table{width:100%;border-collapse:collapse;font-size:14px}.table th{text-align:left;padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:var(--slate);border-bottom:1px solid var(--border)}.table td{padding:12px 14px;border-bottom:1px solid #f1f5f9;vertical-align:middle}.table tr:last-child td{border-bottom:none}.table tr:hover td{background:#f8fafc}.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}.modal{background:white;border-radius:var(--radius);width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2)}.modal-header{padding:20px 24px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}.modal-title{font-family:'DM Serif Display',serif;font-size:20px}.modal-body{padding:20px 24px}.modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}.alert{padding:12px 16px;border-radius:var(--radius-sm);font-size:13px;margin-bottom:12px;display:flex;gap:10px;align-items:flex-start}.alert-warn{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412}.alert-info{background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af}.alert-success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534}.avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0}.avatar-lg{width:52px;height:52px;font-size:18px}.chip-group{display:flex;gap:6px;flex-wrap:wrap}.chip{display:inline-flex;align-items:center;padding:4px 10px;border:1px solid var(--border);border-radius:20px;font-size:12px;font-weight:500;color:var(--slate);cursor:pointer;transition:all 0.15s}.chip.selected{background:var(--navy);color:white;border-color:var(--navy)}.chip:hover{border-color:var(--slate)}.divider{height:1px;background:var(--border);margin:16px 0}.text-muted{color:var(--slate)}.text-xs{font-size:12px}.text-sm{font-size:13px}.flex{display:flex}.flex-col{display:flex;flex-direction:column}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-6{margin-bottom:24px}.mt-auto{margin-top:auto}.w-full{width:100%}.overflow-hidden{overflow:hidden}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.warn-flag{color:var(--amber);font-size:14px;cursor:help}.empty-state{text-align:center;padding:48px 24px;color:var(--slate)}.empty-state h3{font-size:16px;font-weight:500;color:var(--navy3);margin-bottom:6px}.empty-state p{font-size:14px}.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}.section-title{font-size:15px;font-weight:600;color:var(--navy)}.toggle{display:flex;align-items:center;gap:8px;cursor:pointer}.toggle-track{width:36px;height:20px;background:var(--border);border-radius:999px;position:relative;transition:background 0.2s}.toggle-track.on{background:var(--blue)}.toggle-thumb{width:16px;height:16px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:left 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}.toggle-track.on .toggle-thumb{left:18px}.level-timeline{display:flex;flex-direction:column;gap:0}.level-step{display:flex;gap:12px;padding-bottom:16px;position:relative}.level-step:not(:last-child)::before{content:'';position:absolute;left:11px;top:24px;width:2px;bottom:0;background:var(--border)}.level-dot{width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid}.level-dot.done{background:var(--green);border-color:var(--green);color:white}.level-dot.current{background:var(--blue);border-color:var(--blue);color:white}.level-dot.future{background:white;border-color:var(--border);color:var(--muted)}.filter-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.filter-bar .select{width:auto;min-width:140px}.mobile-topbar{display:none}.sidebar-overlay{display:none}@media (max-width:768px){.sidebar{position:fixed;top:0;left:0;height:100vh;z-index:300;transform:translateX(-100%);transition:transform 0.25s ease;width:260px}.sidebar.open{transform:translateX(0)}.sidebar-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:299}.mobile-topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--navy);position:sticky;top:0;z-index:200;border-bottom:2px solid var(--brand)}.mobile-topbar-title{font-family:'DM Serif Display',serif;color:white;font-size:18px}.mobile-menu-btn{background:transparent;border:none;cursor:pointer;padding:4px;color:white;display:flex;align-items:center}.main{padding:16px}.grid-2,.grid-3{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}}`;
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
      {/* Shaft — angled from bottom-left to upper-right */}
      <line x1="8" y1="40" x2="40" y2="8" stroke="white" strokeWidth="3.5"
        strokeLinecap="round" opacity="0.9" />
      {/* Ball tip — large end, upper right */}
      <circle cx="41" cy="7" r="5" fill="#e11d6a" stroke="white" strokeWidth="1.5" />
      {/* Small tip — lower left */}
      <circle cx="7" cy="41" r="2.5" fill="white" opacity="0.7" />
      {/* Grip wrap lines — decorative */}
      <line x1="20" y1="28" x2="23" y2="25" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.35" />
      <line x1="24" y1="24" x2="27" y2="21" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.35" />
      <line x1="28" y1="20" x2="31" y2="17" stroke="white" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

// ─── BATON ICON DARK (for light backgrounds) ─────────────────────────────────

function BatonIconDark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-label="Baton">
      <line x1="8" y1="40" x2="40" y2="8" stroke="#0f172a" strokeWidth="3.5"
        strokeLinecap="round" opacity="0.85" />
      <circle cx="41" cy="7" r="5" fill="#e11d6a" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="7" cy="41" r="2.5" fill="#64748b" />
      <line x1="20" y1="28" x2="23" y2="25" stroke="#64748b" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.5" />
      <line x1="24" y1="24" x2="27" y2="21" stroke="#64748b" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.5" />
      <line x1="28" y1="20" x2="31" y2="17" stroke="#64748b" strokeWidth="1.5"
        strokeLinecap="round" opacity="0.5" />
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
  // ── Supabase auth state ──
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) checkAdmin(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only update on meaningful auth events, not TOKEN_REFRESHED or focus events
      // This prevents modal data loss when switching browser tabs
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setAuthUser(session?.user ?? null);
        if (session?.user) checkAdmin(session.user.id);
        else setIsAdmin(false);
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
  const [invites, setInvites] = useState([]);
  const [competitionHosts, setCompetitionHosts] = useState([]);
  const [publicCompetitions, setPublicCompetitions] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Load all user data from Supabase when auth user ID changes ──
  const loadedForUserRef = useRef(null);

  useEffect(() => {
    if (!authUser) {
      loadedForUserRef.current = null;
      setFamilyAccount(null); setTwirlers([]); setCompetitions([]);
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
    try {
      // Load family account
      const { data: fa } = await supabase
        .from('family_accounts').select('*').eq('user_id', userId).single();
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
          })));

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

    } catch (err) {
      console.error('Error loading data:', err);
    }
    setDataLoading(false);
  }

  const [activeTwirlerId, setActiveTwirlerId] = useLocalStorage("tp_active_twirler", null);
  const [page, setPage] = useState("home");
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

  const openModal = (name, data = {}) => setModals(m => ({ ...m, [name]: { open: true, ...data } }));
  const closeModal = (name) => setModals(m => ({ ...m, [name]: { ...m[name], open: false } }));

  const [hostMode, setHostMode] = useState(null); // null | host object — set when logging in as host

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

  // Pass resolved id as the canonical activeTwirlerId throughout the app
  const effectiveActiveTwirlerId = resolvedActiveTwirlerId;

  // Advanceable events check
  useEffect(() => {
    if (!activeTwirler) return;
    let updated = false;
    const newState = { ...(activeTwirler.classificationState || {}) };
    for (const orgId of activeTwirler.organizations || []) {
      const org = ORGS[orgId];
      if (!org) continue;
      for (const event of org.leveledEvents) {
        const classKey = `${orgId}__${event}`;
        const prog = progress?.[orgId]?.[event];
        if (prog?.shouldAdvance && !prog?.manualOverride && newState[classKey]?.level === prog.currentLevel) {
          // flag for advance notification — don't auto-advance; show in UI
        }
      }
    }
  }, [results, activeTwirler]);

  // ── TWIRLER MUTATIONS ──
  async function addTwirler(data) {
    const fa = familyAccount;
    if (!fa) return;
    const { data: inserted, error } = await supabase.from('twirlers').insert({
      family_id: fa.id,
      first_name: data.firstName,
      dob: data.dob || null,
      studio: data.studio || null,
      organizations: data.organizations || [],
      regular_events: data.regularEvents || [],
      classification_state: {},
      classification_history: [],
    }).select().single();
    if (error) { console.error('addTwirler:', error); return; }
    const t = { ...inserted, firstName: inserted.first_name, classificationState: {}, classificationHistory: [], regularEvents: inserted.regular_events || [], organizations: inserted.organizations || [] };
    setTwirlers(prev => [...prev, t]);
    setActiveTwirlerId(t.id);
    return t;
  }

  async function updateTwirler(id, data) {
    const dbData = {};
    if (data.firstName !== undefined) dbData.first_name = data.firstName;
    if (data.dob !== undefined) dbData.dob = data.dob;
    if (data.studio !== undefined) dbData.studio = data.studio;
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
    }));
    const { data: inserted, error } = await supabase.from('results').insert(rows).select();
    if (error) { console.error('addResults:', error); return; }
    const mapped = (inserted || []).map(r => ({
      ...r, orgId: r.org_id, twirlerId: r.twirler_id, competitionId: r.competition_id,
      classificationLevelEntered: r.classification_level_entered,
      protectionRule: r.protection_rule, isFinalRound: r.is_final_round,
      isPageant: r.is_pageant, isTwirlOff: r.is_twirl_off,
    }));
    setResults(prev => [...prev, ...mapped]);
  }

  async function addResultsToComp(compId, newResults) {
    await addResults(compId, newResults);
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
    await supabase.from('results').update(dbUpdates).eq('id', id);
  }

  async function updateCompetition(id, updates) {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.orgId !== undefined) dbUpdates.org_id = updates.orgId;
    if (updates.sanctioned !== undefined) dbUpdates.sanctioned = updates.sanctioned;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    await supabase.from('competitions').update(dbUpdates).eq('id', id);
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
    const { data: inserted, error } = await supabase.from('competition_hosts').insert({
      user_id: authUser?.id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      organization: data.organization || null,
      state: data.state || null,
      notes: data.notes || null,
      approved: false,
    }).select().single();
    if (error) { console.error('registerHost:', error); return; }
    const h = { ...inserted, createdAt: inserted.created_at };
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
  function coachCreateCompetition(coachId, compData, invitedTwirlerIds) {
    const compId = uid();
    const newComp = { id: compId, ...compData, createdByCoach: coachId };
    setCoachCompetitions(prev => [...prev, newComp]);
    const today = new Date().toISOString().slice(0, 10);
    const newInvites = invitedTwirlerIds.map(twirlerId => ({
      id: uid(),
      competitionId: compId,
      coachId,
      twirlerId,
      status: "pending", // "pending" | "accepted" | "declined"
      createdAt: today,
      respondedAt: null,
    }));
    setInvites(prev => [...prev, ...newInvites]);
  }

  // Family accepts or declines an invite
  function respondToInvite(inviteId, accept) {
    const invite = invites.find(i => i.id === inviteId);
    if (!invite) return;
    setInvites(prev => prev.map(i => i.id === inviteId
      ? { ...i, status: accept ? "accepted" : "declined", respondedAt: new Date().toISOString().slice(0, 10) }
      : i));
    if (accept) {
      const coachComp = coachCompetitions.find(c => c.id === invite.competitionId);
      if (coachComp) {
        // Add to family competitions if not already there
        setCompetitions(prev => {
          if (prev.find(c => c.id === coachComp.id)) return prev;
          return [...prev, { ...coachComp, acceptedFromInvite: true }];
        });
      }
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

  // ── Not authenticated → show Auth screen ──
  if (!authUser) {
    return (
      <AuthScreen
        onAuth={user => setAuthUser(user)}
        authError={authError}
        setAuthError={setAuthError}
      />
    );
  }

  // ── Authenticated but no family profile yet → show SetupScreen ──
  if (!familyAccount) {
    return (
      <SetupScreen
        onComplete={async data => {
          // Save family account to Supabase
          const { data: inserted, error } = await supabase.from('family_accounts').insert({
            user_id: authUser.id,
            parent_name: data.parentName,
            email: data.email || authUser.email,
            phone: data.phone || null,
            state: data.state || null,
            relationship: data.relationship || 'Parent',
            additional_guardians: [],
          }).select().single();
          if (error) { console.error('setup:', error); return; }
          setFamilyAccount({ ...inserted, parentName: inserted.parent_name, additionalGuardians: [] });
          setPage("home");
        }}
        onHostPath={host => setHostMode(host)}
        competitionHosts={competitionHosts}
        registerHost={registerHost}
        authUser={authUser}
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
                  <span style={{ color: "var(--muted)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, marginLeft: 10 }}>Host Dashboard</span>
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

  if (twirlers.length === 0) {
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
          </div>
          <AddTwirlerModal open={modals.addTwirler?.open} onClose={() => closeModal("addTwirler")} onSave={addTwirler} onOpenHistorical={twirler => openModal("historicalData", { twirler })} />
        </div>
      </>
    );
  }

  const pageProps = { activeTwirler, twirlers, competitions, results, twirlerResults, twirlerComps, progress, coaches, coachCompetitions, invites, pendingInvites, familyAccount, openModal, closeModal, modals, addCompetition, addResults, addResultsToComp, deleteResult, overrideClassification, applyHistoricalData, updateTwirler, deleteTwirler, updateResult, updateCompetition, setTwirlers, setCompetitions, setResults, setCoaches, addCoach, linkCoach, unlinkCoach, coachCreateCompetition, respondToInvite, setActiveTwirlerId, competitionHosts, publicCompetitions, attendees, registerHost, approveHost, createPublicCompetition, deletePublicCompetition, addAttendee, removeAttendee, setFamilyAccount };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Sidebar page={page} setPage={p => { setPage(p); setSidebarOpen(false); }} twirlers={twirlers} activeTwirlerId={activeTwirlerId} setActiveTwirlerId={id => { setActiveTwirlerId(id); setSidebarOpen(false); }} openModal={openModal} familyAccount={familyAccount} progress={progress} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pendingInvites={pendingInvites} onSignOut={signOut} darkMode={darkMode} setDarkMode={setDarkMode} isAdmin={isAdmin} previewRole={previewRole} setPreviewRole={setPreviewRole} />
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="mobile-topbar-title">Twirl<span style={{ color: "#e11d6a" }}>Power</span></span>
          <button className="mobile-menu-btn" onClick={() => openModal("addCompetition")} aria-label="Add competition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <div className="main">
          {page === "home" && <HomePage {...pageProps} setPage={setPage} />}
          {page === "history" && <HistoryPage {...pageProps} updateResult={updateResult} updateCompetition={updateCompetition} />}
          {page === "progress" && <ProgressPage {...pageProps} results={results} competitions={competitions} />}
          {page === "profile" && <ProfilePage {...pageProps} setFamilyAccount={setFamilyAccount} openModal={openModal} competitionHosts={competitionHosts} approveHost={approveHost} competitions={competitions} results={results} setTwirlers={setTwirlers} setCompetitions={setCompetitions} setResults={setResults} setCoaches={setCoaches} isAdmin={isAdmin} setPage={setPage} />}
          {page === "coaches" && <CoachesPage {...pageProps} />}
          {page === "openqs" && isAdmin && <OpenQuestionsPage />}
          {page === "admin" && isAdmin && <AdminPage {...pageProps} supabase={supabase} isAdmin={isAdmin} setPage={setPage} previewRole={previewRole} setPreviewRole={setPreviewRole} />}
          {page === "orgs" && <OrganizationsPage />}
          {page === "timeline" && <ClassificationTimelinePage {...pageProps} />}
          {page === "upcoming" && <UpcomingCompetitionsPage {...pageProps} />}
          {page === "hostdash" && <HostDashboardPage {...pageProps} />}
        </div>
        </div>
      </div>

      <AddTwirlerModal open={modals.addTwirler?.open} onClose={() => closeModal("addTwirler")} onSave={addTwirler} onOpenHistorical={twirler => openModal("historicalData", { twirler })} />
      <AddCompetitionModal open={modals.addCompetition?.open} onClose={() => closeModal("addCompetition")} onSave={(compData, resultData) => { const id = addCompetition(compData); addResults(id, resultData); }} activeTwirler={activeTwirler} competitions={competitions} />
      <OverrideModal open={modals.override?.open} onClose={() => closeModal("override")} data={modals.override} onSave={overrideClassification} />
      <AddResultsModal open={modals.addResults?.open} onClose={() => closeModal("addResults")} competition={modals.addResults?.competition} activeTwirler={activeTwirler} onSave={addResultsToComp} />
      <HistoricalDataModal open={modals.historicalData?.open} onClose={() => closeModal("historicalData")} activeTwirler={modals.historicalData?.twirler || activeTwirler} onSave={applyHistoricalData} />
    </>
  );
}

// ─── SETUP SCREEN ───────────────────────────────────────────────────────────

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────

function AuthScreen({ onAuth, authError, setAuthError }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleLogin(e) {
    e?.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      onAuth(data.user);
    }
  }

  async function handleSignup(e) {
    e?.preventDefault();
    if (!email || !password) return;
    if (password !== confirmPassword) { setAuthError("Passwords do not match."); return; }
    if (password.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
    } else if (data.user && !data.session) {
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
    if (error) {
      setAuthError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
      setMode("login");
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
                <button className="btn btn-ghost btn-sm" onClick={() => { setMode("signup"); setAuthError(null); setMessage(null); }}>
                  Create account
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => { setMode("reset"); setAuthError(null); setMessage(null); }}>
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {mode === "signup" && (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--navy)", marginBottom: 20 }}>Create your account</div>
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
                <span style={{ fontSize: 12 }}>You'll receive a confirmation email. Click the link to verify your account.</span>
              </div>
              <button className="btn btn-primary w-full" disabled={loading || !email || !password || !confirmPassword} onClick={handleSignup}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <button className="btn btn-ghost w-full" style={{ marginTop: 8 }} onClick={() => { setMode("login"); setAuthError(null); }}>
                ← Back to sign in
              </button>
            </>
          )}

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

function SetupScreen({ onComplete, onHostPath, competitionHosts, registerHost, authUser }) {
  const [accountType, setAccountType] = useState(null); // null | "family" | "host"
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
              <button onClick={() => setAccountType("host")}
                style={{ padding: "16px 20px", border: "2px solid var(--border)", borderRadius: 12,
                  background: "white", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                  transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--brand-light)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "white"; }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--navy)", marginBottom: 3 }}>🏆 Competition Host</div>
                <div style={{ fontSize: 13, color: "var(--slate)" }}>Post competition listings for twirlers and coaches to discover</div>
              </button>
            </div>
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

        {/* Host login / access */}
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
// Shown on the setup screen when user selects "Competition Host".
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
            Competition Host Access
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
            Register as a new Competition Host
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
          Register as a Competition Host
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
          <input className="input" value={form.organization} onChange={e => f("organization", e.target.value)} placeholder="e.g. USTA Ohio Regional Council, ABC Twirling Studio" />
        </div>
        <div className="form-group">
          <label className="label">Notes for admin <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <textarea className="textarea" rows={2} value={form.notes} onChange={e => f("notes", e.target.value)}
            placeholder="Any context about your role or why you're registering..." />
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

function Sidebar({ page, setPage, twirlers, activeTwirlerId, setActiveTwirlerId, openModal, familyAccount, progress, sidebarOpen, setSidebarOpen, pendingInvites, onSignOut, darkMode, setDarkMode, isAdmin, previewRole, setPreviewRole }) {
  const navItems = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "history", label: "Competition History", icon: "history" },
    { id: "progress", label: "Progress Tracker", icon: "progress" },
    { id: "upcoming", label: "Upcoming Competitions", icon: "trophy" },
    { id: "timeline", label: "Classification Timeline", icon: "history" },
    { id: "orgs", label: "Organizations", icon: "star" },
  ];
  const accountItems = [
    { id: "profile", label: "Family Profile", icon: "user" },
    { id: "coaches", label: "Coaches", icon: "users" },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: "settings", admin: true }] : []),
  ];

  const anyAdvanceable = Object.values(progress).some(org => Object.values(org).some(e => e.shouldAdvance));

  return (
    <div className={`sidebar${sidebarOpen ? " open" : ""}`}>
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BatonIcon size={36} />
          <h1>Twirl<span style={{ color: "#e11d6a" }}>Power</span></h1>
        </div>
        <p>TRACK · COMPETE · ADVANCE</p>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Athletes</div>
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
            {item.admin && <span className="badge" style={{ marginLeft: "auto", fontSize: 9, background: "#312e81", color: "#a5b4fc" }}>Admin</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 2 }}>{familyAccount?.parentName}</div>
        <div style={{ fontSize: 11, color: "var(--navy3)", marginBottom: 10 }}>Family Account</div>
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

function HomePage({ activeTwirler, twirlerResults, twirlerComps, progress, openModal, competitions, results, invites, coachCompetitions, coaches, respondToInvite, twirlers, familyAccount, setPage, setActiveTwirlerId }) {
  if (!activeTwirler) return <div className="empty-state"><h3>No twirler selected</h3></div>;

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
      detail: "Record a competition and enter results",
      done: twirlerComps.length > 0,
      action: () => openModal("addCompetition"),
      actionLabel: "Add competition",
    },
    {
      id: "results",
      label: "Enter results",
      detail: "Add event placements so wins are tracked",
      done: twirlerResults.length > 0,
      action: () => openModal("addCompetition"),
      actionLabel: "Add competition + results",
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
  const showOnboarding = onboardingDone < onboardingSteps.length;

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title"><span style={{ color: "var(--brand)" }}>{activeTwirler.firstName}</span>'s Dashboard</h1>
          <p className="page-sub">Age {getAge(activeTwirler.dob)} · {activeTwirler.organizations?.join(", ")} · {activeTwirler.studio || "No studio listed"}</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal("addCompetition")}>
          <Icon name="plus" size={15} /> Add Competition
        </button>
      </div>

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
          </div>
          {(activeTwirler.organizations || []).map(orgId => (
            <div key={orgId} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge" style={{ background: orgColor(orgId) + "20", color: orgColor(orgId) }}>{orgId}</span>
              </div>
              {(ORGS[orgId]?.leveledEvents || []).map(event => {
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
            </div>
          ))}
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
                  <thead><tr><th>Event</th><th>Level</th><th>Place</th></tr></thead>
                  <tbody>
                    {lastResults.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontSize: 13 }}>{r.event}</td>
                        <td><span className="badge badge-gray">{r.classificationLevelEntered}</span></td>
                        <td>
                          <span className="badge" style={{ background: r.placement === 1 ? "#fef9c3" : "#f1f5f9", color: r.placement === 1 ? "#854d0e" : "var(--slate)" }}>
                            {r.placement === 1 ? "🥇" : r.placement === 2 ? "🥈" : r.placement === 3 ? "🥉" : `${r.placement}th`}
                          </span>
                        </td>
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
    </div>
  );
}

// ─── HISTORY PAGE ────────────────────────────────────────────────────────────

function HistoryPage({ activeTwirler, twirlerResults, twirlerComps, results, openModal, deleteResult, updateResult, updateCompetition, competitions, addResultsToComp }) {
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
                <label className="label">Location</label>
                <input className="input" value={editCompForm.location} onChange={e => setEditCompForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State" />
              </div>
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
                  {fmtDate(comp.date)}{comp.location ? ` · ${comp.location}` : ""}
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
                  <thead><tr><th>Event</th><th>Level</th><th>Place</th><th>Contested</th><th>Flags</th><th>Notes</th><th></th></tr></thead>
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
                                {org?.rules?.protectionRule && <label className="toggle"><Toggle on={editResultForm.protectionRule} onChange={v => setEditResultForm(p => ({ ...p, protectionRule: v }))} /><span style={{ fontSize: 12 }}>Protection rule</span></label>}
                                {org?.rules?.finalRoundOnly && <label className="toggle"><Toggle on={editResultForm.isFinalRound !== false} onChange={v => setEditResultForm(p => ({ ...p, isFinalRound: v ? true : false }))} /><span style={{ fontSize: 12 }}>Final round</span></label>}
                                {comp.orgId === "TU" && <label className="toggle"><Toggle on={!!editResultForm.isPageant} onChange={v => setEditResultForm(p => ({ ...p, isPageant: v }))} /><span style={{ fontSize: 12 }}>Pageant</span></label>}
                                {comp.orgId === "TU" && <label className="toggle"><Toggle on={!!editResultForm.isTwirlOff} onChange={v => setEditResultForm(p => ({ ...p, isTwirlOff: v }))} /><span style={{ fontSize: 12 }}>Twirl-off</span></label>}
                              </div>
                              <div className="form-group" style={{ marginBottom: 10 }}>
                                <label className="label">Notes</label>
                                <input className="input" value={editResultForm.notes}
                                  onChange={e => setEditResultForm(p => ({ ...p, notes: e.target.value }))}
                                  placeholder="Optional notes about this result..." />
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
                          <td style={{ fontSize: 13 }}>{r.event}</td>
                          <td><span className="badge badge-gray">{r.classificationLevelEntered}</span></td>
                          <td>
                            <span className="badge" style={{ background: r.placement === 1 ? "#fef9c3" : "#f1f5f9", color: r.placement === 1 ? "#854d0e" : "var(--slate)" }}>
                              {r.placement === 1 ? "1st 🥇" : r.placement === 2 ? "2nd" : r.placement === 3 ? "3rd" : `${r.placement}th`}
                            </span>
                          </td>
                          <td style={{ fontSize: 13 }}>{r.contested ? "Yes" : "No"}</td>
                          <td>{flags.map((f, i) => <span key={i} className={`badge badge-${f.color === "warn" ? "warn" : "gray"}`} style={{ marginRight: 4, fontSize: 10 }}>{f.label}</span>)}</td>
                          <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 160 }}>
                            {r.notes ? <span title={r.notes}>📝 {r.notes.length > 30 ? r.notes.slice(0, 30) + "…" : r.notes}</span> : null}
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
    setEditCompForm({ name: comp.name, date: comp.date, location: comp.location || "", orgId: comp.orgId, sanctioned: comp.sanctioned !== false, notes: comp.notes || "" });
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
    });
  }

  function saveEditResult() {
    updateResult(editingResult, { ...editResultForm, placement: parseInt(editResultForm.placement) });
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
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
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
          {(ORGS[displayOrg]?.leveledEvents || []).map(event => {
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

function ProfilePage({ activeTwirler, twirlers, updateTwirler, deleteTwirler, familyAccount, setFamilyAccount, coaches, setCoaches, openModal, competitionHosts, approveHost, competitions, results, setTwirlers, setCompetitions, setResults, isAdmin, setPage }) {
  const [editFamily, setEditFamily] = useState(false);
  const [editTwirler, setEditTwirler] = useState(false);
  const [fForm, setFF] = useState(familyAccount);
  const [tForm, setTF] = useState(activeTwirler || {});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAddGuardian, setShowAddGuardian] = useState(false);
  const [guardianForm, setGF] = useState({ name: "", email: "", phone: "", relationship: "Parent" });

  useEffect(() => { setTF(activeTwirler || {}); }, [activeTwirler]);
  useEffect(() => { setFF(familyAccount); }, [familyAccount]);

  const linkedCoaches = coaches.filter(c => c.linkedTwirlers?.includes(activeTwirler?.id));
  const additionalGuardians = familyAccount?.additionalGuardians || [];

  function saveGuardian() {
    const updated = { ...familyAccount, additionalGuardians: [...additionalGuardians, { id: uid(), ...guardianForm }] };
    setFamilyAccount(updated);
    setGF({ name: "", email: "", phone: "", relationship: "Parent" });
    setShowAddGuardian(false);
  }

  function removeGuardian(id) {
    setFamilyAccount({ ...familyAccount, additionalGuardians: additionalGuardians.filter(g => g.id !== id) });
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
            <span className="section-title">Athlete Profile — {activeTwirler.firstName}</span>
            {!editTwirler
              ? <button className="btn btn-ghost btn-sm" onClick={() => setEditTwirler(true)}><Icon name="edit" size={13} /> Edit</button>
              : <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => { updateTwirler(activeTwirler.id, tForm); setEditTwirler(false); }}>Save changes</button>
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
              <div className="form-group"><label className="label">Studio / club</label><input className="input" value={tForm.studio || ""} onChange={e => setTF(p => ({ ...p, studio: e.target.value }))} placeholder="Studio or club name" /></div>

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
                <div style={{ marginBottom: 8 }}><span style={{ color: "var(--slate)" }}>Studio:</span> {activeTwirler.studio || <span style={{ color: "var(--muted)" }}>Not set</span>}</div>
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
                {linkedCoaches.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Coaches with access</div>
                    {linkedCoaches.map(c => (
                      <div key={c.id} className="flex items-center gap-2 mb-2">
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "#ede9fe", color: "#6d28d9" }}>{initials(c.name)}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                          {c.email && <div style={{ fontSize: 11, color: "var(--slate)" }}>{c.email}</div>}
                        </div>
                        <span className="badge badge-gray" style={{ marginLeft: "auto", fontSize: 10 }}>Read-only</span>
                      </div>
                    ))}
                  </div>
                )}
                {linkedCoaches.length === 0 && (
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>No coaches linked yet. Go to the Coaches page to add one.</div>
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
          <span className="section-title">Family Account — Guardians</span>
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
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Primary Guardian</div>
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
            <button className="btn btn-ghost btn-sm" onClick={() => removeGuardian(g.id)} title="Remove guardian">
              <Icon name="trash" size={13} color="var(--red)" />
            </button>
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
              <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={guardianForm.email} onChange={e => setGF(p => ({...p, email: e.target.value}))} /></div>
              <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" value={guardianForm.phone} onChange={e => setGF(p => ({...p, phone: e.target.value}))} /></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" disabled={!guardianForm.name} onClick={saveGuardian}>Add Guardian</button>
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
      {linkedCoaches.length > 0 && (
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
    { id: "hosts", label: `Host Approvals${pendingHosts.length > 0 ? ` (${pendingHosts.length})` : ""}` },
    { id: "accounts", label: "Accounts" },
    { id: "data", label: "Data Overview" },
  ];

  const roles = [
    { id: "family", label: "👨‍👩‍👧 Family", desc: "Standard family account view" },
    { id: "coach", label: "🎓 Coach", desc: "Coach account view (Phase 2)" },
    { id: "host", label: "📅 Host", desc: "Competition host view" },
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
              <span style={{ fontSize: 12 }}>Once approved, hosts retain access permanently. Phase 2: approval notifications via email.</span>
            </div>
            {pendingHosts.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>✓ No pending host approvals.</div>
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
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Registered {fmtDate(h.createdAt)}</div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => approveHost(h.id)}>✓ Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {approvedHosts.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                  ✓ Approved Hosts ({approvedHosts.length})
                </div>
                {approvedHosts.map(h => (
                  <div key={h.id} className="flex items-center gap-3 mb-2" style={{ padding: "10px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: "#bbf7d0", color: "#166534" }}>{initials(h.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{[h.organization, h.email, h.state].filter(Boolean).join(" · ")}</div>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>Approved</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ACCOUNTS */}
        {tab === "accounts" && (
          <AccountsTab supabase={supabase} currentFamilyAccount={familyAccount} twirlers={twirlers} />
        )}

        {/* DATA OVERVIEW */}
        {tab === "data" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Twirlers", value: twirlers.length, icon: "👤" },
                { label: "Competitions", value: competitions.length, icon: "🏆" },
                { label: "Results", value: results.length, icon: "📋" },
                { label: "Coaches", value: coaches.length, icon: "🎓" },
                { label: "Hosts (total)", value: (competitionHosts || []).length, icon: "📅" },
                { label: "Hosts (pending)", value: pendingHosts.length, icon: "⏳", warn: pendingHosts.length > 0 },
              ].map(stat => (
                <div key={stat.label} className="stat-card" style={stat.warn && stat.value > 0 ? { border: "1px solid #fed7aa", background: "#fff7ed" } : {}}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                  <div className="stat-value" style={{ fontSize: 22, color: stat.warn && stat.value > 0 ? "var(--red)" : "var(--navy)" }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="alert alert-info">
              <Icon name="info" size={14} color="var(--brand)" />
              <span style={{ fontSize: 12 }}>Phase 2: this tab will show real-time database stats across all users, error logs, and a Supabase query console.</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("openqs")}>
                View Open Questions →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ACCOUNTS TAB (ADMIN) ─────────────────────────────────────────────────────

function AccountsTab({ supabase, currentFamilyAccount, twirlers }) {
  const [accounts, setAccounts] = useState([]);
  const [admins, setAdmins] = useState([]); // user_ids that are admins
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [accountTwirlers, setAccountTwirlers] = useState({});
  const [adminWorking, setAdminWorking] = useState({}); // accountId → true while saving

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: accts, error: e1 }, { data: adms, error: e2 }] = await Promise.all([
          supabase.from('family_accounts').select('*').order('created_at', { ascending: false }),
          supabase.from('admins').select('user_id'),
        ]);
        if (e1) throw e1;
        if (e2) throw e2;
        setAccounts(accts || []);
        setAdmins((adms || []).map(a => a.user_id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
                {a.studio && <span className="badge badge-gray" style={{ fontSize: 10 }}>{a.studio}</span>}
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
                    ["Studio", a.studio || "—"],
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
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>No twirlers on this account</div>
                  )
                ) : (
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>Loading twirlers...</div>
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



function CoachesPage({ coaches, twirlers, activeTwirler, addCoach, linkCoach, unlinkCoach, familyAccount, coachCompetitions, invites, coachCreateCompetition }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showCreateComp, setShowCreateComp] = useState(null); // coachId
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialization: "", organizations: [] });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const allGuardians = [
    { name: familyAccount?.parentName, email: familyAccount?.email, phone: familyAccount?.phone, relationship: familyAccount?.relationship || "Parent" },
    ...(familyAccount?.additionalGuardians || [])
  ].filter(g => g.name);

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Coaches</h1>
          <p className="page-sub">Add coaches, manage access, and track competition invites</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={15} /> Add Coach</button>
      </div>

      <div className="alert alert-info mb-4">
        <Icon name="info" size={16} color="var(--blue)" />
        <div>
          <strong>How coach access works:</strong> Coaches have read-only access to linked athlete profiles. Coaches can also create competitions and invite your athletes — you'll see the invite on the dashboard and can accept or decline.
        </div>
      </div>

      {coaches.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎓</div>
            <h3>No coaches added yet</h3>
            <p>Add a coach by name and contact info, then select which athletes they can view.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
              <Icon name="plus" size={13} /> Add your first coach
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-col gap-3">
          {coaches.map(coach => {
            const linked = coach.linkedTwirlers || [];
            const coachComps = (coachCompetitions || []).filter(c => c.createdByCoach === coach.id);
            return (
              <div key={coach.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="avatar avatar-lg" style={{ background: "#ede9fe", color: "#6d28d9" }}>{initials(coach.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>{coach.name}</div>
                    {coach.email && <div style={{ fontSize: 13, color: "var(--slate)" }}>📧 {coach.email}</div>}
                    {coach.phone && <div style={{ fontSize: 13, color: "var(--slate)" }}>📞 {coach.phone}</div>}
                    {coach.specialization && <div style={{ fontSize: 13, color: "var(--slate)" }}>🎀 {coach.specialization}</div>}
                    {(coach.organizations||[]).length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {(coach.organizations||[]).map(o => (
                          <span key={o} className="badge" style={{ background: orgColor(o) + "15", color: orgColor(o), fontSize: 10 }}>{o}</span>
                        ))}
                      </div>
                    )}

                    <div className="divider" />

                    {/* Athlete access */}
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Athlete access — click to toggle</div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {twirlers.map(t => {
                        const isLinked = linked.includes(t.id);
                        return (
                          <button key={t.id} className={`chip ${isLinked ? "selected" : ""}`}
                            onClick={() => isLinked ? unlinkCoach(coach.id, t.id) : linkCoach(coach.id, t.id)}>
                            {isLinked ? "✓ " : ""}{t.firstName}
                          </button>
                        );
                      })}
                    </div>
                    {linked.length === 0 && (
                      <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", marginBottom: 8 }}>No athletes linked — this coach cannot view any profiles yet.</div>
                    )}

                    {linked.length > 0 && (
                      <div className="card-sm mt-2 mb-3" style={{ background: "#f8fafc" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Contact info visible to {coach.name}
                        </div>
                        {allGuardians.map((g, i) => (
                          <div key={i} className="flex items-center gap-2 mb-1">
                            <div className="avatar" style={{ width: 24, height: 24, fontSize: 10, background: "#dbeafe", color: "#1d4ed8" }}>{initials(g.name)}</div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{g.name}</span>
                            <span style={{ fontSize: 12, color: "var(--slate)" }}>({g.relationship})</span>
                            {g.email && <span style={{ fontSize: 12, color: "var(--slate)" }}>📧 {g.email}</span>}
                            {g.phone && <span style={{ fontSize: 12, color: "var(--slate)" }}>📞 {g.phone}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="divider" />

                    {/* Competition invites section */}
                    <div className="flex items-center justify-between mb-2">
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Competitions & invites
                      </div>
                      {linked.length > 0 && (
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}
                          onClick={() => setShowCreateComp(coach.id)}>
                          <Icon name="plus" size={12} /> Create competition invite
                        </button>
                      )}
                    </div>

                    {coachComps.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                        No competitions created by this coach yet.
                        {linked.length > 0 && " Use the button above to create one and invite athletes."}
                      </div>
                    ) : (
                      <div className="flex-col gap-2">
                        {coachComps.map(comp => {
                          const compInvites = (invites || []).filter(i => i.competitionId === comp.id);
                          const accepted = compInvites.filter(i => i.status === "accepted");
                          const pending = compInvites.filter(i => i.status === "pending");
                          const declined = compInvites.filter(i => i.status === "declined");
                          return (
                            <div key={comp.id} className="card-sm" style={{ background: "#f8fafc" }}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 14 }}>{comp.name}</div>
                                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                                    {fmtDate(comp.date)}{comp.location ? ` · ${comp.location}` : ""}
                                    {comp.orgId && <span className="badge" style={{ marginLeft: 6, background: orgColor(comp.orgId) + "15", color: orgColor(comp.orgId) }}>{comp.orgId}</span>}
                                  </div>
                                </div>
                              </div>
                              {/* Invite status per twirler */}
                              {compInvites.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Invite status</div>
                                  <div className="flex gap-2 flex-wrap">
                                    {compInvites.map(invite => {
                                      const twirler = twirlers.find(t => t.id === invite.twirlerId);
                                      const statusColor = invite.status === "accepted" ? "#15803d" : invite.status === "declined" ? "#b91c1c" : "#b45309";
                                      const statusBg = invite.status === "accepted" ? "#dcfce7" : invite.status === "declined" ? "#fee2e2" : "#fef3c7";
                                      const statusIcon = invite.status === "accepted" ? "✓" : invite.status === "declined" ? "✕" : "⏳";
                                      return (
                                        <div key={invite.id} style={{ display: "flex", alignItems: "center", gap: 5, background: statusBg, borderRadius: 20, padding: "3px 10px", fontSize: 12 }}>
                                          <span style={{ color: statusColor }}>{statusIcon}</span>
                                          <span style={{ color: statusColor, fontWeight: 500 }}>{twirler?.firstName || "Unknown"}</span>
                                          <span style={{ color: statusColor, opacity: 0.7 }}>{invite.status}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                                    {accepted.length} accepted · {pending.length} pending · {declined.length} declined
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Coach Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Coach"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
          <button className="btn btn-primary" disabled={!form.name} onClick={() => {
            addCoach(form);
            setForm({ name: "", email: "", phone: "", specialization: "" });
            setShowAdd(false);
          }}>Add Coach</button>
        </>}>
        <div className="alert alert-info mb-3">
          <Icon name="info" size={15} color="var(--blue)" />
          <span>After adding a coach, use the toggle chips to select which athletes they can view and invite to competitions.</span>
        </div>
        <div className="form-group"><label className="label">Coach name</label><input className="input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" autoFocus /></div>
        <div className="form-row">
          <div className="form-group"><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => f("email", e.target.value)} placeholder="coach@example.com" /></div>
          <div className="form-group"><label className="label">Phone</label><input className="input" type="tel" value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="(555) 555-5555" /></div>
        </div>
        <div className="form-group"><label className="label">Specialization <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <input className="input" value={form.specialization} onChange={e => f("specialization", e.target.value)} placeholder="e.g. USTA Solo, NBTA teams" />
        </div>
        <div className="form-group">
          <label className="label">Organizations <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional — informational)</span></label>
          <div className="chip-group">
            {Object.keys(ORGS).map(orgId => (
              <div key={orgId} className={`chip ${(form.organizations||[]).includes(orgId) ? "selected" : ""}`}
                onClick={() => f("organizations", (form.organizations||[]).includes(orgId)
                  ? (form.organizations||[]).filter(o => o !== orgId)
                  : [...(form.organizations||[]), orgId])}>
                {orgId}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Coach Create Competition Modal */}
      {showCreateComp && (
        <CoachCreateCompModal
          open={!!showCreateComp}
          onClose={() => setShowCreateComp(null)}
          coach={coaches.find(c => c.id === showCreateComp)}
          twirlers={twirlers.filter(t => (coaches.find(c => c.id === showCreateComp)?.linkedTwirlers || []).includes(t.id))}
          onSave={(compData, invitedIds) => {
            coachCreateCompetition(showCreateComp, compData, invitedIds);
            setShowCreateComp(null);
          }}
        />
      )}
    </div>
  );
}

function CoachCreateCompModal({ open, onClose, coach, twirlers, onSave }) {
  const [compForm, setComp] = useState({ name: "", date: "", location: "", orgId: "" });
  const [invitedIds, setInvitedIds] = useState([]);
  const cf = (k, v) => setComp(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (open) {
      setComp({ name: "", date: "", location: "", orgId: "", sanctioned: true });
      setInvitedIds(twirlers.map(t => t.id));
    }
  }, [open]);

  const toggleInvite = (id) => setInvitedIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );

  const valid = compForm.name && compForm.date && compForm.orgId && invitedIds.length > 0;

  const allOrgIds = [...new Set(twirlers.flatMap(t => t.organizations || []))];

  return (
    <Modal open={open} onClose={onClose} title="Create Competition & Invite Athletes"
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
      <div className="form-group">
        <label className="label">Location</label>
        <input className="input" value={compForm.location} onChange={e => cf("location", e.target.value)} placeholder="City, State" />
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

function OrganizationsPage() {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const orgIds = Object.keys(ORG_INFO);

  if (selectedOrg) {
    return <OrgDetailPage orgId={selectedOrg} onBack={() => setSelectedOrg(null)} />;
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

function OrgDetailPage({ orgId, onBack }) {
  const info = ORG_INFO[orgId];
  const org = ORGS[orgId];
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "classification", label: "Classification" },
    { id: "events", label: "Events" },
    { id: "rules", label: "Key Rules" },
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
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">About</span></div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.8 }}>{info.history}</p>
          </div>
          <div className="card mb-4">
            <div className="section-header"><span className="section-title">Classification at a glance</span></div>
            <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.7, marginBottom: 16 }}>{info.classificationSummary}</p>
            <div className="flex gap-2 flex-wrap">
              {org.levels.map((level, i) => (
                <div key={level} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, opacity: 0.3 + (i / org.levels.length) * 0.7 }} />
                  <span style={{ fontSize: 13, color: "var(--navy)", fontWeight: i === org.levels.length - 1 ? 600 : 400 }}>{level}</span>
                  {i < org.levels.length - 1 && <span style={{ color: "var(--muted)", fontSize: 12 }}>→</span>}
                </div>
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
    </div>
  );
}

function UpcomingCompetitionsPage({ publicCompetitions, attendees, twirlers, activeTwirler, familyAccount, addAttendee, removeAttendee, competitionHosts, setPage }) {
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
        <button className="btn btn-secondary btn-sm" onClick={() => setPage("hostdash")}>
          <Icon name="plus" size={13} /> I'm a Competition Host
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
    </div>
  );
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
        <h1 className="page-title">Competition Host</h1>
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
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--brand2)", marginBottom: 4 }}>How Competition Host accounts work</div>
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
        <div className="section-header"><span className="section-title">Register as a Competition Host</span></div>
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
          <input className="input" value={form.organization} onChange={e => f("organization", e.target.value)} placeholder="e.g. USTA Ohio Regional Council, ABC Twirling Studio" />
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
        <span>Your Competition Host account is approved. You can create and manage competition listings below.</span>
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
          const isTU = ["Q5","Q6"].includes(q.id);
          const orgTag = isDMA ? "DMA" : isTU ? "TU" : q.id <= "Q4" ? null : null;
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
  const [form, setForm] = useState({ firstName: "", dob: "", studio: "", organizations: [], regularEvents: [] });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleOrg = (orgId) => setForm(p => ({ ...p, organizations: p.organizations.includes(orgId) ? p.organizations.filter(o => o !== orgId) : [...p.organizations, orgId] }));

  function handleSave(withHistory) {
    const newTwirler = onSave(form);
    setForm({ firstName: "", dob: "", studio: "", organizations: [], regularEvents: [] });
    onClose();
    if (withHistory && newTwirler) {
      // slight delay so the modal closes first
      setTimeout(() => onOpenHistorical(newTwirler), 100);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Twirler Profile"
      footer={
        <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm"
              disabled={!form.firstName || !form.dob || form.organizations.length === 0}
              onClick={() => handleSave(false)}
              title="Add profile and set classifications later">
              Add — set classifications later
            </button>
            <button className="btn btn-primary"
              disabled={!form.firstName || !form.dob || form.organizations.length === 0}
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
      <div className="form-row">
        <div className="form-group"><label className="label">First name only</label><input className="input" value={form.firstName} onChange={e => f("firstName", e.target.value)} placeholder="e.g. Emma" /></div>
        <div className="form-group"><label className="label">Date of birth</label><input className="input" type="date" value={form.dob} onChange={e => f("dob", e.target.value)} /></div>
      </div>
      <div className="form-group"><label className="label">Studio / club</label><input className="input" value={form.studio} onChange={e => f("studio", e.target.value)} placeholder="Studio or club name" /></div>
      <div className="form-group">
        <label className="label">Organizations</label>
        <div className="chip-group">
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

  function addRow() {
    setEventRows(prev => [...prev, {
      event: "", classificationLevelEntered: orgLevels[0] || "Novice",
      placement: "", contested: true, protectionRule: false, isFinalRound: null
    }]);
  }

  function updateRow(i, k, v) {
    setEventRows(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  }

  function removeRow(i) {
    setEventRows(prev => prev.filter((_, idx) => idx !== i));
  }

  const needsLevel = (event) => leveledEvents.includes(event);

  // TU shows extra flags for pageant and twirl-off (which don't count toward advancement)
  const isTU = selectedOrg?.id === "TU";

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
          <div className="form-row" style={{ marginBottom: 8 }}>
            <div>
              <label className="label">Placement</label>
              <input className="input" type="number" min="1" max="99" value={row.placement}
                onChange={e => updateRow(i, "placement", e.target.value)} placeholder="1, 2, 3..." />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
              <label className="toggle">
                <Toggle on={row.contested} onChange={v => updateRow(i, "contested", v)} />
                <span style={{ fontSize: 13 }}>Contested division</span>
              </label>
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
  const [compForm, setComp] = useState({ name: "", date: "", location: "", orgId: "", sanctioned: true });
  const [eventRows, setEventRows] = useState([]);
  const cf = (k, v) => setComp(p => ({ ...p, [k]: v }));

  useEffect(() => {
    if (open && activeTwirler) {
      setStep(1);
      const firstOrg = activeTwirler.organizations?.[0] || "";
      setComp({ name: "", date: "", location: "", orgId: firstOrg, sanctioned: true });
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
  const validRows = eventRows.filter(r => r.event && r.placement !== "");

  // Duplicate detection — same name AND same date
  const duplicateWarning = compForm.name && compForm.date
    ? competitions.find(c =>
        c.name.trim().toLowerCase() === compForm.name.trim().toLowerCase() &&
        c.date === compForm.date
      )
    : null;

  function saveWithResults() {
    onSave(compForm, validRows.map(r => ({ ...r, placement: parseInt(r.placement), orgId: compForm.orgId })));
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
          <div className="form-group">
            <label className="label">Location</label>
            <input className="input" value={compForm.location} onChange={e => cf("location", e.target.value)} placeholder="City, State" />
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

function AddResultsModal({ open, onClose, competition, activeTwirler, onSave }) {
  const [eventRows, setEventRows] = useState([]);

  useEffect(() => {
    if (open) setEventRows([]);
  }, [open]);

  const selectedOrg = ORGS[competition?.orgId];
  const validRows = eventRows.filter(r => r.event && r.placement !== "");

  function save() {
    onSave(competition.id, validRows.map(r => ({ ...r, placement: parseInt(r.placement), orgId: competition.orgId })));
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
                    <td style={{ padding: "8px 8px", fontSize: 14 }}>{entry.event}</td>
                    <td style={{ padding: "6px 8px" }}>
                      <select className="select" style={{ padding: "5px 8px", fontSize: 13 }}
                        value={entry.level}
                        onChange={e => updateEntry(orgId, entry.event, "level", e.target.value)}>
                        {org.levels.map(l => <option key={l} value={l}>{l}</option>)}
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
