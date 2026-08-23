import { describe, expect, it, vi } from 'vitest';

import { signIn, signUp } from './auth-actions';

function mockClient(authImpl: Record<string, ReturnType<typeof vi.fn>>) {
  return { auth: authImpl } as never;
}

describe('signUp', () => {
  it('rejects invalid input without calling supabase', async () => {
    const signUpFn = vi.fn();
    const result = await signUp(mockClient({ signUp: signUpFn }), {
      displayName: 'A',
      email: 'bad',
      password: 'x',
      confirmPassword: 'y',
    });
    expect(result.ok).toBe(false);
    expect(signUpFn).not.toHaveBeenCalled();
  });

  it('returns a confirmation state when supabase creates a user without a session', async () => {
    const result = await signUp(
      mockClient({
        signUp: vi.fn().mockResolvedValue({ data: { session: null, user: { id: '1' } }, error: null }),
      }),
      {
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'correcthorse',
        confirmPassword: 'correcthorse',
      },
    );
    expect(result.ok).toBe(true);
    expect(result.needsEmailConfirmation).toBe(true);
  });

  it('maps supabase errors', async () => {
    const result = await signUp(
      mockClient({
        signUp: vi.fn().mockResolvedValue({
          data: { session: null, user: null },
          error: { message: 'User already registered' },
        }),
      }),
      {
        displayName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'correcthorse',
        confirmPassword: 'correcthorse',
      },
    );
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/already exists/i);
  });
});

describe('signIn', () => {
  it('maps invalid credentials', async () => {
    const result = await signIn(
      mockClient({
        signInWithPassword: vi.fn().mockResolvedValue({
          error: { message: 'Invalid login credentials' },
        }),
      }),
      { email: 'ada@example.com', password: 'wrong-password' },
    );
    expect(result.ok).toBe(false);
    expect(result.message).toBe('Invalid email or password.');
  });
});
