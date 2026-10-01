import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth';

export default async function AdminDashboard() {
  await requireAdmin();
  redirect('/studio');
}
