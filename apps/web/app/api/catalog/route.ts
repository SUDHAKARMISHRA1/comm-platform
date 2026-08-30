import { NextResponse, type NextRequest } from 'next/server';

import { getCatalog } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  return NextResponse.json(await getCatalog());
}
