
import { createClient } from '@supabase/supabase-js'

// Extract the current URL for proper redirections
const currentUrl = window.location.origin;

// Use provided Supabase URL and Anon Key from environment or window
const supabaseUrl = (window as any).SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with proper redirect URLs
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Supabase-Auth-Redirect': currentUrl
      }
    }
  }
);

// Console warning to help debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anonymous Key is missing. Please connect your project to Supabase using the green Supabase button in the top right of the Lovable interface."
  );
}
