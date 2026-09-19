/**
 * Supabase client for the public site.
 *
 * Anon key only, and that is the whole security model: every content table
 * grants `anon` SELECT and nothing else, gated on `is_published`. There is no
 * service-role client in this repo on purpose. Content editing happens in the
 * wallet app's /admin/content, behind an on-chain ADMIN_ROLE check.
 *
 * One exception, and it is not a content table: `quest_requests` grants anon
 * INSERT so the Frontier Cities form can submit, and grants no SELECT, so a
 * visitor can leave a proposal and cannot read anyone else's — including their
 * own. Nothing in this repo reads that table back.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(URL && ANON_KEY);

/**
 * Returns null when unconfigured rather than throwing, so a clone without a
 * .env still builds and renders empty lists instead of failing the build with a
 * stack trace that looks like a code error.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(URL as string, ANON_KEY as string, {
      auth: { persistSession: false },
    })
  : null;
