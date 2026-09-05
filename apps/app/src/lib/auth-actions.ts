/** Sign up / sign in against Supabase Auth. Returns a user-facing message on failure. */
import type { TypedSupabaseClient } from '@comm-platform/api';
import { mapProfile, toUserMessage } from '@comm-platform/api';
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@comm-platform/validation';

export type AuthActionResult = {
  ok: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
};

export async function signUp(client: TypedSupabaseClient, input: SignUpInput): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  }

  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName } },
  });

  if (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  if (!data.session) {
    return {
      ok: true,
      needsEmailConfirmation: true,
      message: 'Account created. Check your email to confirm your address, then sign in.',
    };
  }

  return { ok: true };
}

export async function signIn(client: TypedSupabaseClient, input: SignInInput): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  }

  const { error } = await client.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: toUserMessage(error) };
  }

  return { ok: true };
}

export async function fetchOwnProfile(client: TypedSupabaseClient, userId: string) {
  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    throw new Error(toUserMessage(error));
  }
  return data ? mapProfile(data) : null;
}
