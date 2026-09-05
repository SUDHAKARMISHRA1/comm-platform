/** Snake_case PostgREST rows → camelCase types used by the apps. */
import type { AccountStatus, AdminUserOverview, AdminUserOverviewRow, Profile, ProfileRow } from '@comm-platform/types';

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    username: row.username,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function accountStatus(row: Pick<AdminUserOverviewRow, 'email_confirmed_at' | 'banned_until'>): AccountStatus {
  if (row.banned_until && new Date(row.banned_until) > new Date()) {
    return 'banned';
  }
  if (!row.email_confirmed_at) {
    return 'unconfirmed';
  }
  return 'active';
}

export function mapAdminUser(row: AdminUserOverviewRow): AdminUserOverview {
  return {
    ...mapProfile({
      id: row.id,
      display_name: row.display_name,
      username: row.username,
      avatar_url: row.avatar_url,
      bio: row.bio,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }),
    email: row.email,
    emailConfirmedAt: row.email_confirmed_at,
    lastSignInAt: row.last_sign_in_at,
    bannedUntil: row.banned_until,
    role: row.role,
    accountStatus: accountStatus(row),
  };
}
