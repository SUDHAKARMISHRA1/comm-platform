/** Shared Supabase browser-client factory, env readers, error mapping, and profile mappers. */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@comm-platform/types';

export type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type TypedSupabaseClient = SupabaseClient<Database>;

/** Reads Expo (`EXPO_PUBLIC_*`) or Next (`NEXT_PUBLIC_*`) anon keys — same Supabase project. */
export function readPublicEnv(env: Record<string, string | undefined> = process.env): PublicEnv {
  const supabaseUrl =
    env.EXPO_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
  const supabaseAnonKey =
    env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing public Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY (or the app-specific EXPO_PUBLIC_/NEXT_PUBLIC_ equivalents).',
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function hasPublicEnv(env: Record<string, string | undefined> = process.env): boolean {
  try {
    readPublicEnv(env);
    return true;
  } catch {
    return false;
  }
}

type AuthStorage = {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
};

type AuthLock = <R>(name: string, acquireTimeout: number, fn: () => Promise<R>) => Promise<R>;

/** Anon-key browser client. Pass custom `storage` on Expo web so private-mode still works. */
export function createBrowserSupabaseClient(options?: {
  env?: PublicEnv;
  storage?: AuthStorage;
  detectSessionInUrl?: boolean;
  storageKey?: string;
  lock?: AuthLock;
  persistSession?: boolean;
  autoRefreshToken?: boolean;
}): TypedSupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = options?.env ?? readPublicEnv();
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: options?.persistSession ?? true,
      autoRefreshToken: options?.autoRefreshToken ?? true,
      detectSessionInUrl: options?.detectSessionInUrl ?? true,
      storage: options?.storage,
      ...(options?.storageKey ? { storageKey: options.storageKey } : {}),
      ...(options?.lock ? { lock: options.lock } : {}),
    },
  });
}

export { createLogger, type LogLevel } from './logger';
export { toUserMessage } from './errors';
export { mapProfile, mapAdminUser, accountStatus } from './mappers';
export type { SupabaseClient };
