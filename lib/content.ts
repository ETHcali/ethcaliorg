/**
 * Content queries. Every one of these runs at build time in getStaticProps.
 *
 * These read the published view of the world: RLS hides drafts from the anon
 * key, so there is no `is_published` filter to forget here. Nothing in this file
 * can see an unpublished row even if it asks for one.
 */
import { supabase } from './supabase';
import type {
  EventRecord,
  EventDetail,
  PartnerRecord,
  TeamMemberRecord,
  VenueRecord,
} from '../types/content';

/** Columns the list views need. Selecting * would ship every body field into the page payload. */
const LIST_COLUMNS =
  'id, slug, kind, role, scope, starts_on, ends_on, city, country, name_es, name_en, summary_es, summary_en, poster_path, is_published';

export async function getEvents(scope?: 'local' | 'international'): Promise<EventRecord[]> {
  if (!supabase) return [];
  let query = supabase
    .from('events')
    .select(LIST_COLUMNS)
    .order('starts_on', { ascending: false });

  if (scope) query = query.eq('scope', scope);

  const { data, error } = await query;
  if (error) throw new Error(`getEvents: ${error.message}`);
  return (data ?? []) as unknown as EventRecord[];
}

export async function getEventsByKind(kind: string): Promise<EventRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('events')
    .select(LIST_COLUMNS)
    .eq('kind', kind)
    .order('starts_on', { ascending: false });

  if (error) throw new Error(`getEventsByKind: ${error.message}`);
  return (data ?? []) as unknown as EventRecord[];
}

/** Every published slug, for getStaticPaths. */
export async function getEventSlugs(kind?: string): Promise<string[]> {
  if (!supabase) return [];
  let query = supabase.from('events').select('slug');
  if (kind) query = query.eq('kind', kind);

  const { data, error } = await query;
  if (error) throw new Error(`getEventSlugs: ${error.message}`);
  return (data ?? []).map((r) => (r as { slug: string }).slug);
}

/**
 * One event and everything its page renders. The child tables are joined in a
 * single request rather than fetched per event — 47 events × 3 follow-up queries
 * is the n+1 that would make a full rebuild crawl.
 */
export async function getEvent(slug: string): Promise<EventDetail | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('events')
    .select(
      `*,
       venue:venues (slug, name, maps_url, lat, lng),
       poaps:event_poaps (id, event_id, poap_url, chain, collectors),
       nfts:event_nfts (id, event_id, protocol, nft_url, chain, mints),
       hackathon:hackathon_details (*)`
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`getEvent(${slug}): ${error.message}`);
  if (!data) return null;

  // PostgREST returns a 1:1 embed as an object, but a a nullable one can come
  // back as an empty array depending on the relationship it infers. Normalise
  // so the page never has to check both shapes.
  const row = data as Record<string, unknown>;
  const hackathon = Array.isArray(row.hackathon) ? row.hackathon[0] ?? null : row.hackathon ?? null;
  const venue = Array.isArray(row.venue) ? row.venue[0] ?? null : row.venue ?? null;

  return { ...row, hackathon, venue } as unknown as EventDetail;
}

export async function getVenues(): Promise<VenueRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('venues').select('*').order('name');
  if (error) throw new Error(`getVenues: ${error.message}`);
  return (data ?? []) as VenueRecord[];
}

export async function getTeam(): Promise<TeamMemberRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
  if (error) throw new Error(`getTeam: ${error.message}`);
  return (data ?? []) as TeamMemberRecord[];
}

export async function getPartners(): Promise<PartnerRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('kind')
    .order('sort_order');
  if (error) throw new Error(`getPartners: ${error.message}`);
  return (data ?? []) as PartnerRecord[];
}
