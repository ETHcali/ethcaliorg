/**
 * Supabase client for the public site.
 *
 * Anon key only, and that is the whole security model: every content table
 * grants `anon` SELECT and nothing else, gated on `is_published`. There is no
 * service-role client in this repo on purpose — the site never writes. Editing
 * happens in the wallet app's /admin/content, behind an on-chain ADMIN_ROLE check.
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
