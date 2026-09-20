/**
 * Public Contact Us ingest. Auth is optional (header link is shown while signed out).
 * A row is written only after validation succeeds. Max one successful message per UTC day
 * per email, and per signed-in user when a Bearer token is present.
 */
import { NextResponse, type NextRequest } from 'next/server';

import { CONTACT_DAILY_LIMIT_MESSAGE, contactUsSchema } from '@comm-platform/validation';

import { optionalApiUser } from '@/lib/api-auth';
import { createServiceSupabase } from '@/lib/supabase/service';

const MISSING_TABLE = /contact_messages|schema cache/i;
const UNIQUE_VIOLATION = '23505';

function utcDateString(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const auth = await optionalApiUser(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = contactUsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const name = parsed.data.name;
  const email = parsed.data.email.toLowerCase();
  const description = parsed.data.description;
  const userId = auth.user?.id ?? null;
  const submittedOn = utcDateString();

  try {
    const service = createServiceSupabase();

    const { data: byEmail, error: emailLookupError } = await service
      .from('contact_messages')
      .select('id')
      .eq('email', email)
      .eq('submitted_on', submittedOn)
      .limit(1);
    if (emailLookupError) {
      const missing = MISSING_TABLE.test(emailLookupError.message);
      return NextResponse.json(
        { error: missing ? 'Contact store is not ready. Run 0011_contact_messages.sql in Supabase.' : 'Could not send your message. Please try again.' },
        { status: 503 },
      );
    }
    if (byEmail?.length) {
      return NextResponse.json({ error: CONTACT_DAILY_LIMIT_MESSAGE, code: 'DAILY_LIMIT' }, { status: 429 });
    }

    if (userId) {
      const { data: byUser, error: userLookupError } = await service
        .from('contact_messages')
        .select('id')
        .eq('user_id', userId)
        .eq('submitted_on', submittedOn)
        .limit(1);
      if (userLookupError) {
        return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 503 });
      }
      if (byUser?.length) {
        return NextResponse.json({ error: CONTACT_DAILY_LIMIT_MESSAGE, code: 'DAILY_LIMIT' }, { status: 429 });
      }
    }

    const { data, error } = await service
      .from('contact_messages')
      .insert({
        user_id: userId,
        name,
        email,
        description,
        submitted_on: submittedOn,
      })
      .select('id, created_at')
      .single();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return NextResponse.json({ error: CONTACT_DAILY_LIMIT_MESSAGE, code: 'DAILY_LIMIT' }, { status: 429 });
      }
      const missing = MISSING_TABLE.test(error.message);
      return NextResponse.json(
        { error: missing ? 'Contact store is not ready. Run 0011_contact_messages.sql in Supabase.' : 'Could not send your message. Please try again.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ id: data.id, createdAt: data.created_at });
  } catch {
    return NextResponse.json({ error: 'Contact store unavailable' }, { status: 503 });
  }
}
