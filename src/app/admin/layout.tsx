import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminNav } from '@/components/admin/admin-nav';
import { SECTION_META } from '@/content/sections';
import { currentAdmin } from '@/lib/auth';

import styles from './admin.module.css';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * The admin panel is authenticated and always reads fresh content, so there is
 * nothing here to prerender. Without this, Cache Components would bake a
 * logged-out redirect into the build output.
 */
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await currentAdmin();

  // The login screen renders on its own — no shell, no navigation.
  if (!admin) return <>{children}</>;

  const groups = ['Pages', 'Collections', 'Site-wide'] as const;

  return (
    <div className={styles.shell}>
      <AdminNav
        email={admin.email}
        groups={groups.map((group) => ({
          label: group,
          items: SECTION_META.filter((section) => section.group === group).map(
            (section) => ({
              href: `/admin/${section.key}`,
              label: section.label,
            }),
          ),
        }))}
      />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
