import type { Session } from '@supabase/supabase-js';

const BACKUP_KEY = 'comm-platform:auth-session';

type SessionTokens = {
  access_token: string;
  refresh_token: string;
};

function stores(): Storage[] {
  if (typeof window === 'undefined') return [];
  const out: Storage[] = [];
  try {
    out.push(window.localStorage);
  } catch {
    /* ignore */
  }
  try {
    out.push(window.sessionStorage);
  } catch {
    /* ignore */
  }
  return out;
}

function tokensFromUnknown(value: unknown): SessionTokens | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const nested = record.currentSession && typeof record.currentSession === 'object'
    ? (record.currentSession as Record<string, unknown>)
    : record;
  const access = nested.access_token;
  const refresh = nested.refresh_token;
  if (typeof access === 'string' && typeof refresh === 'string' && access && refresh) {
    return { access_token: access, refresh_token: refresh };
  }
  return null;
}

export function persistSessionBackup(session: Session | null) {
  const payload = session?.access_token && session.refresh_token
    ? JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        expires_in: session.expires_in,
        token_type: session.token_type,
        user: session.user,
      })
    : null;

  for (const store of stores()) {
    try {
      if (payload) store.setItem(BACKUP_KEY, payload);
      else store.removeItem(BACKUP_KEY);
    } catch {
      /* ignore quota / private mode */
    }
  }
}

export function readSessionBackup(): SessionTokens | null {
  for (const store of stores()) {
    try {
      const raw = store.getItem(BACKUP_KEY);
      if (!raw) continue;
      const tokens = tokensFromUnknown(JSON.parse(raw));
      if (tokens) return tokens;
    } catch {
      /* try next store */
    }
  }

  if (typeof window === 'undefined') return null;
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key?.startsWith('sb-') || !key.endsWith('-auth-token')) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const tokens = tokensFromUnknown(JSON.parse(raw));
      if (tokens) return tokens;
    }
  } catch {
    /* ignore */
  }
  return null;
}
