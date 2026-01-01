import { createClient } from '@supabase/supabase-js';

// Supabase client for frontend (uses anon key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase URL or Anon Key not found. Social login may not work.');
  console.warn('⚠️  Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  console.warn('⚠️  Create a .env file in FE-client directory with:');
  console.warn('   VITE_SUPABASE_URL=your_supabase_url');
  console.warn('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

// Always create Supabase client (even with empty values) to prevent import errors
// The client will fail gracefully when used without proper config
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
