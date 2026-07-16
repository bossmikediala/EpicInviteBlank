const url = window.EPICINVITE_CONFIG?.SUPABASE_URL;
const key = window.EPICINVITE_CONFIG?.SUPABASE_PUBLISHABLE_KEY;

if (!window.supabase?.createClient) {
  throw new Error("The Supabase browser library did not load.");
}

if (!url || !key) {
  throw new Error("Supabase configuration is missing from the root config.js file.");
}

window.epicInviteSupabase = window.supabase.createClient(url, key, {
  auth: { persistSession: false }
});
