import { describe, expect, it } from 'vitest';

import { signInSchema, signUpSchema, updateProfileSchema } from './index';

describe('signUpSchema', () => {
  const valid = {
    displayName: 'Ada Lovelace',
    email: 'ada@example.com',
    password: 'correcthorse',
    confirmPassword: 'correcthorse',
  };

  it('accepts a valid signup payload', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toMatch(/do not match/i);
    }
  });

  it('rejects a short password', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = signUpSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('requires a password', () => {
    const result = signInSchema.safeParse({ email: 'ada@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('rejects usernames with spaces', () => {
    const result = updateProfileSchema.safeParse({
      displayName: 'Ada',
      username: 'ada lovelace',
      bio: '',
    });
    expect(result.success).toBe(false);
  });
});
