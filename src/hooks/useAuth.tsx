import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
// Change: use the real client, NOT the mock!
import { supabase } from '@/integrations/supabase/client'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("useAuth: Setting up auth state");
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("useAuth: Initial session:", { session, error });
      if (error) {
        console.error("useAuth: Error getting session:", error);
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("useAuth: Auth state changed:", { _event, session });
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log("useAuth: Attempting sign up for:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    console.log("useAuth: Sign up result:", { data, error });
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    console.log("useAuth: Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log("useAuth: Sign in result:", { data, error });
    return { data, error }
  }

  const signInWithGoogle = async (opts?: { promptSelectAccount?: boolean }) => {
    console.log("useAuth: Attempting Google sign in");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          prompt: opts?.promptSelectAccount ? "select_account" : undefined,
        },
      },
    });
    console.log("useAuth: Google sign in result:", { data, error });
    return { data, error };
  }

  const signOut = async () => {
    console.log("useAuth: Attempting sign out");
    const { error } = await supabase.auth.signOut()
    console.log("useAuth: Sign out result:", { error });
    return { error }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }
}
