import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — safe for both server components and client components
export const supabase = createClient(supabaseUrl, supabaseKey);

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────

export type Competition = {
  id: string;
  name: string;
  competition_date: string;
  city: string | null;
  state: string | null;
  venue: string | null;
  org: string | null;
  registration_url: string | null;
  registration_deadline: string | null;
  show_on_marketing_site: boolean;
};

export type Club = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  status: 'unclaimed' | 'pending_claim' | 'claimed' | 'archived';
  show_on_marketing_site: boolean;
  owner_coach_id: string | null;
  website_url: string | null;
};

export type Coach = {
  id: string;
  name: string;
  studio: string | null;
  state: string | null;
  organizations: string[] | null;
  bio: string | null;
  email: string | null;
};

// ── DATA FETCHERS ─────────────────────────────────────────────────────────────

export async function getCompetitions({
  org,
  state,
  past = false,
  limit = 100,
}: {
  org?: string;
  state?: string;
  past?: boolean;
  limit?: number;
} = {}): Promise<Competition[]> {
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('public_competitions')
    .select('id,name,competition_date,city,state,venue,org,registration_url,registration_deadline,show_on_marketing_site')
    .eq('show_on_marketing_site', true)
    .limit(limit);

  if (past) {
    query = query.lt('competition_date', today).order('competition_date', { ascending: false });
  } else {
    query = query.gte('competition_date', today).order('competition_date', { ascending: true });
  }

  if (org)   query = query.eq('org', org);
  if (state) query = query.eq('state', state.toUpperCase());

  const { data, error } = await query;
  if (error) { console.error('getCompetitions error:', error); return []; }
  return data ?? [];
}

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const { data, error } = await supabase
    .from('public_competitions')
    .select('*')
    .eq('id', id)
    .eq('show_on_marketing_site', true)
    .single();
  if (error) return null;
  return data;
}

export async function getClubs({
  state,
  includeUnclaimed = true,
  limit = 100,
}: {
  state?: string;
  includeUnclaimed?: boolean;
  limit?: number;
} = {}): Promise<Club[]> {
  let query = supabase
    .from('clubs')
    .select('id,name,city,state,status,show_on_marketing_site,owner_coach_id,website_url')
    .eq('show_on_marketing_site', true)
    .neq('status', 'archived')
    .order('name', { ascending: true })
    .limit(limit);

  if (!includeUnclaimed) query = query.eq('status', 'claimed');
  if (state) query = query.eq('state', state.toUpperCase());

  const { data, error } = await query;
  if (error) { console.error('getClubs error:', error); return []; }
  return data ?? [];
}

export async function getClubById(id: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', id)
    .eq('show_on_marketing_site', true)
    .single();
  if (error) return null;
  return data;
}

export async function getCoaches({
  state,
  org,
  search,
  limit = 100,
}: {
  state?: string;
  org?: string;
  search?: string;
  limit?: number;
} = {}): Promise<Coach[]> {
  let query = supabase
    .from('coach_accounts')
    .select('id,name,studio,state,organizations,bio')
    .order('name', { ascending: true })
    .limit(limit);

  if (state)  query = query.eq('state', state.toUpperCase());
  if (org)    query = query.contains('organizations', [org]);
  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error } = await query;
  if (error) { console.error('getCoaches error:', error); return []; }
  return data ?? [];
}

export async function getStats(): Promise<{
  families: number;
  twirlers: number;
  competitions: number;
}> {
  const [familiesRes, twirlerRes, compRes] = await Promise.all([
    supabase.from('family_accounts').select('id', { count: 'exact', head: true }),
    supabase.from('twirlers').select('id', { count: 'exact', head: true }),
    supabase.from('public_competitions').select('id', { count: 'exact', head: true }).eq('show_on_marketing_site', true),
  ]);
  return {
    families:     familiesRes.count ?? 0,
    twirlers:     twirlerRes.count  ?? 0,
    competitions: compRes.count     ?? 0,
  };
}

export async function getCoachCountByState(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('coach_accounts')
    .select('state');
  if (error || !data) return {};
  return data.reduce((acc: Record<string, number>, row) => {
    if (row.state) acc[row.state] = (acc[row.state] ?? 0) + 1;
    return acc;
  }, {});
}
