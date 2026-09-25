import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://djzuqukjijuwbihpxzmf.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqenVxdWtqaWp1d2JpaHB4em1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzc0OTgsImV4cCI6MjEwNTg1MzQ5OH0.e8vKJc9AkuIVTY3Hb1_YeqoyR1XphFp8DZQBjuQSzU4";

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
