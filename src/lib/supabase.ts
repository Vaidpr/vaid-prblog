
import { createClient } from "@supabase/supabase-js";

// These values should already be set by the Lovable Supabase integration
const supabaseUrl = (window as any).SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
