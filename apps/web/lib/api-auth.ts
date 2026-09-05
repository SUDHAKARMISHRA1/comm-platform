/**
 * Auth for `/api/*` routes used by the Expo app.
 * Validates the Bearer access token with the anon key (`getUser(token)`).
 * Admin cookie sessions use `requireAdmin()` instead — do not mix the two.
 */
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function requireApiUser(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { error: NextResponse.json({ error: 'Auth not configured' }, { status: 500 }) };
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { user: data.user };
}

export function apiDisplayName(user: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const meta = user.user_metadata ?? {};
  const named = [meta.full_name, meta.name, meta.display_name].find(
    (value) => typeof value === 'string' && value.trim(),
  ) as string | undefined;
  return named?.trim() || user.email?.split('@')[0] || 'Member';
}

/** Stub 429 used when the client sends `x-rate-limit-test: 1`. Not a real rate limiter. */
export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'You have reached the execution limit. Please wait a moment before trying again.' },
    { status: 429 },
  );
}
