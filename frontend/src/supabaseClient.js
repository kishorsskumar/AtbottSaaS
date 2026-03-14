import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseKey
  && supabaseUrl.startsWith("http")
  && supabaseKey.length > 20;

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = isConfigured;
