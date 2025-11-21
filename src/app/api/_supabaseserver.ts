import { createClient } from '@supabase/supabase-js';


export function createServerSupabase() {
// IMPORTANT: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only key
return createClient(url, key, { auth: { persistSession: false } });
}