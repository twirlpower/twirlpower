// Shared Supabase fetch utility — used by all widgets
// The anon key is safe to expose — RLS protects your data

const SUPABASE_URL = 'https://fascxnrrnsknjnojfxvv.supabase.co';

// Key is injected at build time via Vite, or falls back to window global
const SUPABASE_KEY =
  typeof __SUPABASE_KEY__ !== 'undefined'
    ? __SUPABASE_KEY__
    : (window.TWIRLPOWER_ANON_KEY ?? '');

export async function supabaseFetch(table, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

export async function supabaseCount(table, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });

  if (!res.ok) throw new Error(`Supabase count error: ${res.status}`);
  const range = res.headers.get('content-range') ?? '';
  const total = range.split('/')[1];
  return total === '*' ? 0 : parseInt(total, 10) || 0;
}

export const ORG_COLORS = {
  USTA: '#0d9488',
  NBTA: '#0f172a',
  TU:   '#7c3aed',
  DMA:  '#b45309',
};

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');`;

export const BASE_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :host {
    --teal:  #0d9488;
    --teal-dark: #0f766e;
    --pink:  #e11d6a;
    --navy:  #0f172a;
    --slate: #475569;
    --slate-light: #94a3b8;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --card: #ffffff;
    --radius: 12px;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    display: block;
  }
`;
