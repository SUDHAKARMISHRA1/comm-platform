import { NextResponse, type NextRequest } from 'next/server';

import { listSubmissionsForUser } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  return NextResponse.json({ submissions: await listSubmissionsForUser(auth.user.id) });
}
