import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublicKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

const isValidSupabaseUrl = (value: string | undefined): value is string => {
  if (!value || value.includes('placeholder') || value === 'https://your-project.supabase.co') {
    return false;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const isPublicSupabaseKey = (value: string): boolean => {
  if (value.startsWith('sb_publishable_')) return true;

  const parts = value.split('.');
  if (parts.length !== 3 || !parts.every(Boolean)) return false;

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as { role?: unknown };
    return payload.role === 'anon';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = (): boolean =>
  isValidSupabaseUrl(supabaseUrl) && isPublicSupabaseKey(supabasePublicKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabasePublicKey)
  : null;
