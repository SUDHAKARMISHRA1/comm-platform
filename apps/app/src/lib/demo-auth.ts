import { Platform } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { getWebStorageItem, removeWebStorageItem, setWebStorageItem } from '@/lib/safe-web-storage';

const STORAGE_KEY = 'comm-platform:demo-session';

export function isDemoAuthEnabled(): boolean {
  return process.env.EXPO_PUBLIC_USE_MOCK_API === 'true' && !hasSupabaseEnv();
}

function hasSupabaseEnv(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
}

export function createDemoSession(email: string): Session {
  const now = new Date().toISOString();
  return {
    access_token: 'demo-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'demo-refresh-token',
    user: {
      id: '00000000-0000-4000-8000-000000000001',
      email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'demo' },
      user_metadata: { display_name: email.split('@')[0] },
      created_at: now,
      updated_at: now,
    },
  } as Session;
}

export function loadDemoSession(): Session | null {
  if (Platform.OS !== 'web') return null;
  try {
    const raw = getWebStorageItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveDemoSession(session: Session): void {
  if (Platform.OS !== 'web') return;
  try {
    setWebStorageItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* session stays in memory via auth provider state */
  }
}

export function clearDemoSession(): void {
  if (Platform.OS !== 'web') return;
  removeWebStorageItem(STORAGE_KEY);
}
