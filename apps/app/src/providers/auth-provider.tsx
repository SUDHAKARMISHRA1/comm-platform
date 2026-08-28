import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { createLogger } from '@comm-platform/api';

import {
  clearDemoSession,
  createDemoSession,
  isDemoAuthEnabled,
  loadDemoSession,
  saveDemoSession,
} from '@/lib/demo-auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { bindApiSession } from '@/coding/api/client';

type AuthContextValue = {
  configured: boolean;
  demoMode: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signInDemo: (email: string) => void;
  signOutDemo: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const log = createLogger('auth');

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const demoMode = isDemoAuthEnabled();
  const [loading, setLoading] = useState(configured || demoMode);
  const [session, setSession] = useState<Session | null>(null);

  const signInDemo = useCallback((email: string) => {
    const next = createDemoSession(email);
    saveDemoSession(next);
    setSession(next);
    setLoading(false);
  }, []);

  const signOutDemo = useCallback(() => {
    clearDemoSession();
    setSession(null);
  }, []);

  useEffect(() => {
    if (demoMode) {
      setSession(loadDemoSession());
      setLoading(false);
      return;
    }

    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          log.error('Failed to restore session', error);
        }
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch((error: unknown) => {
        log.error('Failed to restore session', error);
        if (active) {
          setLoading(false);
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [configured, demoMode]);

  useEffect(() => {
    bindApiSession(session);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      demoMode,
      loading,
      session,
      user: session?.user ?? null,
      signInDemo,
      signOutDemo,
    }),
    [configured, demoMode, loading, session, signInDemo, signOutDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
