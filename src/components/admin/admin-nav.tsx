'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from '@/app/admin/admin.module.css';

type NavGroup = {
  label: string;
  items: { href: string; label: string }[];
};

export function AdminNav({
  email,
  groups,
}: {
  email: string;
  groups: NavGroup[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={
        pathname === href ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
      }
    >
      {label}
    </Link>
  );

  async function signOut() {
    setSigningOut(true);
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span aria-hidden="true" className={styles.brandMark}>
          A
        </span>
        <span>
          <span className={styles.brandName}>Aurevia</span>
          <span className={styles.brandSub}>Admin</span>
        </span>
      </div>

      <nav aria-label="Admin sections">
        <div className={styles.navGroup}>
          <p className={styles.navLabel}>Overview</p>
          <div className={styles.navList}>
            {link('/admin', 'Dashboard')}
            {link('/admin/media', 'Photographs')}
            {link('/admin/enquiries', 'Enquiries')}
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.label} className={styles.navGroup}>
            <p className={styles.navLabel}>{group.label}</p>
            <div className={styles.navList}>
              {group.items.map((item) => link(item.href, item.label))}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFoot}>
        <p>{email}</p>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className={styles.signOut}
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
