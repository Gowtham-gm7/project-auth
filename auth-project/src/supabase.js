import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with TypeScript support
const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase URL and ANON_KEY must be provided in .env file'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
    },
    realtime: {
      heartbeatIntervalMs: 10000,
    }
  });
};

export const supabase = initSupabase();