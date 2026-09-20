/**
 * Ingest a single product-app API failure.
 * Successes are never written. The Expo client posts here from `apiFetch` on error only.
 */
import { NextResponse, type NextRequest } from 'next/server';

import { requireApiUser } from '@/lib/api-auth';
import { createServiceSupabase } from '@/lib/supabase/service';

const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']);
const INGEST_PATH = '/telemetry/failures';

function clip(value: unknown, max: number) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function asStatus(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(599, Math.round(n)));
}

function asMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 20);
  const out: Record<string, unknown> = {};
  for (const [key, item] of entries) {
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean' || item == null) {
      out[key.slice(0, 40)] = typeof item === 'string' ? item.slice(0, 300) : item;
    }
  }
  return out;
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const method = clip(body.method, 16)?.toUpperCase() ?? 'GET';
  const path = clip(body.path, 300);
  if (!path || path === INGEST_PATH) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 });
  }
  if (!METHODS.has(method)) {
    return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
  }

  try {
    const service = createServiceSupabase();
    const { error } = await service.from('frontend_api_failures').insert({
      user_id: auth.user.id,
      method,
      path: path.startsWith('/') ? path : `/${path}`,
      status_code: asStatus(body.statusCode),
      error_code: clip(body.errorCode, 80),
      error_message: clip(body.errorMessage, 2000),
      request_id: clip(body.requestId, 80),
      client_platform: clip(body.clientPlatform, 40),
      app_version: clip(body.appVersion, 40),
      user_agent: clip(body.userAgent, 400),
      page_path: clip(body.pagePath, 300),
      metadata: asMetadata(body.metadata),
    });
    if (error) {
      return NextResponse.json({ error: 'Could not store failure' }, { status: 503 });
    }
  } catch {
    return NextResponse.json({ error: 'Monitor store unavailable' }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
