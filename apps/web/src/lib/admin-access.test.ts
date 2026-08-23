import { describe, expect, it } from 'vitest';

import { resolveAdminAccess } from './admin-access';

describe('resolveAdminAccess', () => {
  it('rejects missing users', () => {
    expect(resolveAdminAccess({ userId: null, role: 'admin' })).toBe('unauthenticated');
  });

  it('rejects non-admin roles', () => {
    expect(resolveAdminAccess({ userId: 'user-1', role: 'user' })).toBe('forbidden');
    expect(resolveAdminAccess({ userId: 'user-1', role: null })).toBe('forbidden');
  });

  it('allows admins verified from user_roles', () => {
    expect(resolveAdminAccess({ userId: 'admin-1', role: 'admin' })).toBe('allowed');
  });
});
