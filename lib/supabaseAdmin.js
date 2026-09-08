import { createClient } from "@supabase/supabase-js";

// Server-only. Never import this into a "use client" component. The
// service role key bypasses Row Level Security entirely, which is exactly
// what the webhook needs (to mark an order "paid") but would be dangerous
// if it ever reached the browser.
//
// Get this key from Supabase → Project Settings → API → "service_role"
// secret (NOT the "anon" key you already have in NEXT_PUBLIC_SUPABASE_ANON_KEY).
// Add it in Vercel as SUPABASE_SERVICE_ROLE_KEY — no NEXT_PUBLIC_ prefix.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}
