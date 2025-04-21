
import { createClient } from "@supabase/supabase-js";

// These values should already be set by the Lovable Supabase integration
const supabaseUrl = (window as any).SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create a client instance with fallback values for development
export const supabase = createClient(
  // If URL is empty, provide a placeholder to avoid runtime errors
  supabaseUrl || "https://placeholder-project.supabase.co",
  // If key is empty, provide a placeholder to avoid runtime errors
  supabaseAnonKey || "placeholder-key"
);

// Console warning to help debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anonymous Key is missing. Please connect your project to Supabase using the green Supabase button in the top right of the Lovable interface."
  );
}
