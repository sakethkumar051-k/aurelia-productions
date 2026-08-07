'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import styles from './route-fade.module.css';

/**
 * Cross-fades page content on navigation, matching the prototype's 260ms
 * route transition. Disabled under `prefers-reduced-motion` by the stylesheet.
 */
export function RouteFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={styles.fade}>
      {children}
    </div>
  );
}
