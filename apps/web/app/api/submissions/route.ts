import { NextResponse, type NextRequest } from 'next/server';

import { getMockSubmission, listMockSubmissions } from '@comm-platform/coding';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  return NextResponse.json({ submissions: listMockSubmissions() });
}
