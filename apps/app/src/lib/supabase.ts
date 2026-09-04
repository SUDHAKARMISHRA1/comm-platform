import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import {
  createBrowserSupabaseClient,
  hasPublicEnv,
  readPublicEnv,
  type TypedSupabaseClient,
} from '@comm-platform/api';

import { createSafeAuthStorage } from '@/lib/safe-web-storage';

let client: TypedSupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return hasPublicEnv({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  });
}

function detectSessionInUrl() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  const { hash, search } = window.location;
  return hash.includes('access_token') || search.includes('code=') || search.includes('access_token');
}

/**
 * Serialize auth work in-process. `navigator.locks` can skip session recovery
 * after a hard refresh; a raw bypass lets concurrent `refreshSession` calls
 * rotate the refresh token twice and lock the user out with 401s.
 */
let authLockQueue: Promise<void> = Promise.resolve();

async function memoryAuthLock<R>(_name: string, _timeout: number, fn: () => Promise<R>): Promise<R> {
  let release: () => void = () => undefined;
  const previous = authLockQueue;
  authLockQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous;
  try {
    return await fn();
  } finally {
    release();
  }
}

export function getSupabase(): TypedSupabaseClient {
  if (typeof window === 'undefined' && Platform.OS === 'web') {
    return createBrowserSupabaseClient({
      env: readPublicEnv({
        EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
        EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      }),
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    });
  }

  if (client) {
    return client;
  }

  client = createBrowserSupabaseClient({
    env: readPublicEnv({
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }),
    storage: Platform.OS === 'web' ? createSafeAuthStorage() : AsyncStorage,
    detectSessionInUrl: detectSessionInUrl(),
    lock: Platform.OS === 'web' ? memoryAuthLock : undefined,
  });

  return client;
}
