import { describe, expect, it } from 'vitest';

import { toUserMessage } from './errors';
import { accountStatus } from './mappers';

describe('toUserMessage', () => {
  it('maps invalid credentials', () => {
    expect(toUserMessage({ message: 'Invalid login credentials' })).toBe('Invalid email or password.');
  });

  it('maps duplicate users', () => {
    expect(toUserMessage({ message: 'User already registered' })).toMatch(/already exists/i);
  });
});

describe('accountStatus', () => {
  it('returns unconfirmed when email is not confirmed', () => {
    expect(accountStatus({ email_confirmed_at: null, banned_until: null })).toBe('unconfirmed');
  });

  it('returns banned when banned_until is in the future', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    expect(accountStatus({ email_confirmed_at: new Date().toISOString(), banned_until: future })).toBe('banned');
  });
});
