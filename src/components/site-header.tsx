'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { NAV } from '@/content/site';

import styles from './site-header.module.css';

function isCurrent(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="The Aurevia Productions — home"
        >
          <span aria-hidden="true" className={styles.brandMark}>
            A
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Aurevia</span>
            <span className={styles.brandSub}>Productions</span>
          </span>
        </Link>

        <nav aria-label="Primary" className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              className={
                isCurrent(pathname, item.href)
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className={styles.cta}>
            DM for Booking
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visuallyHidden">
            {open ? 'Close menu' : 'Open menu'}
          </span>
          <span aria-hidden="true" className={styles.burgerBox} data-open={open}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        className={styles.scrim}
        data-open={open}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        id="mobile-nav"
        className={styles.drawer}
        data-open={open}
        role="dialog"
        aria-modal={open || undefined}
        aria-label="Site menu"
        inert={!open}
      >
        <p className={styles.drawerEyebrow}>Menu</p>
        <nav aria-label="Mobile" className={styles.drawerNav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              className={
                isCurrent(pathname, item.href)
                  ? `${styles.drawerLink} ${styles.drawerLinkActive}`
                  : styles.drawerLink
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className={styles.drawerCta}
        >
          DM for Booking
        </Link>
        <p className={styles.drawerScript}>Events | Decor | Moments That Last</p>
      </div>
    </header>
  );
}
