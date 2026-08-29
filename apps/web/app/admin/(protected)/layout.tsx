import { cookies } from 'next/headers';
import { connection } from 'next/server';

import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  await cookies();
  await requireAdmin();
  return children;
}
