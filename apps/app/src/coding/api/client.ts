import type { Session } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

const REFRESH_SKEW_SECONDS = 60;

let boundSession: Session | null = null;
let refreshInFlight: Promise<Session | null> | null = null;

/** Called by AuthProvider so API calls use the active session token. */
export function bindApiSession(session: Session | null) {
  boundSession = session;
}

export function currentApiUserId() {
  return boundSession?.user?.id ?? 'demo-user';
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function jwtExp(accessToken: string): number | null {
  try {
    const segment = accessToken.split('.')[1];
    if (!segment) return null;
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof atob === 'function' ? atob(padded) : '';
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

function sessionIsFresh(session: Session | null): boolean {
  if (!session?.access_token) return false;
  if (session.access_token === 'demo-access-token') return true;
  const exp = session.expires_at ?? jwtExp(session.access_token);
  if (exp == null) return true;
  return exp > Math.floor(Date.now() / 1000) + REFRESH_SKEW_SECONDS;
}

async function refreshBoundSession(): Promise<Session | null> {
  if (refreshInFlight) return refreshInFlight;

  const supabase = getSupabase();
  refreshInFlight = (async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      bindApiSession(data.session);
      return data.session;
    }
    const { data: existing } = await supabase.auth.getSession();
    if (existing.session) {
      bindApiSession(existing.session);
      return existing.session;
    }
    return boundSession;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

async function resolveAccessToken(): Promise<string | null> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  let session = data.session ?? boundSession;

  if (session && !sessionIsFresh(session) && session.refresh_token && session.access_token !== 'demo-access-token') {
    session = (await refreshBoundSession()) ?? session;
  } else if (session) {
    bindApiSession(session);
  }

  return session?.access_token ?? boundSession?.access_token ?? null;
}

export async function apiFetch<T>(path: string, init?: RequestInit, allowRetry = true): Promise<T> {
  const token = await resolveAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Network error. Check that the API server is running (pnpm dev:web).', 0);
  }

  if (response.status === 401 && allowRetry && token && token !== 'demo-access-token') {
    const refreshed = await refreshBoundSession();
    if (refreshed?.access_token && refreshed.access_token !== token) {
      return apiFetch<T>(path, init, false);
    }
  }

  if (response.status === 401) {
    throw new ApiError('Session expired or invalid. Please sign in again.', 401);
  }
  if (response.status === 429) {
    throw new ApiError('You have reached the execution limit. Please wait a moment before trying again.', 429);
  }
  if (response.status === 404) {
    throw new ApiError('Resource not found.', 404);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(body?.error ?? 'Something went wrong. Please try again.', response.status);
  }

  return response.json() as Promise<T>;
}
