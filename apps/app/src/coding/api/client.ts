import type { Session } from '@supabase/supabase-js';

import { getSupabase } from '@/lib/supabase';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';
export const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

let boundSession: Session | null = null;

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

async function resolveAccessToken(): Promise<string | null> {
  if (boundSession?.access_token) return boundSession.access_token;
  const { data } = await getSupabase().auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
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
