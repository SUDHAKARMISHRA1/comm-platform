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

export function getSupabase(): TypedSupabaseClient {
  if (client) {
    return client;
  }

  client = createBrowserSupabaseClient({
    env: readPublicEnv({
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }),
    storage: Platform.OS === 'web' ? createSafeAuthStorage() : AsyncStorage,
    detectSessionInUrl: Platform.OS === 'web',
  });

  return client;
}
