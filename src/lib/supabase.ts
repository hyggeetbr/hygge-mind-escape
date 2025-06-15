
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("Supabase config:", { 
  supabaseUrl: supabaseUrl ? "✓ Set" : "✗ Missing", 
  supabaseAnonKey: supabaseAnonKey ? "✓ Set" : "✗ Missing" 
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", { supabaseUrl, supabaseAnonKey });
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("Supabase client created successfully");
