
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log("Supabase config:", { 
  supabaseUrl: supabaseUrl ? "✓ Set" : "✗ Missing", 
  supabaseAnonKey: supabaseAnonKey ? "✓ Set" : "✗ Missing" 
});

// Create a mock client if environment variables are missing
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Creating mock client.");
  
  // Mock supabase client that prevents crashes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      signOut: () => Promise.resolve({ error: { message: "Supabase not configured" } })
    }
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client created successfully");
}

export { supabase };
