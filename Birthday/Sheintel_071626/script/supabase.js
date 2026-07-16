const url=window.EPICINVITE_CONFIG?.SUPABASE_URL,key=window.EPICINVITE_CONFIG?.SUPABASE_PUBLISHABLE_KEY;
if(!window.supabase?.createClient)throw new Error("Supabase library failed to load.");
if(!url||!key)throw new Error("Supabase configuration is missing.");
window.epicInviteSupabase=window.supabase.createClient(url,key,{auth:{persistSession:false}});
