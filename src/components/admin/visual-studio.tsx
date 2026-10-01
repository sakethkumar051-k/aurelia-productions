'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { saveVisibleText } from '@/app/admin/actions';
import type { Content, ContentSection } from '@/content/schema';
import { SlotCard } from '@/components/admin/media-manager';
import type { MediaSlot } from '@/lib/media-slots';

import styles from './visual-studio.module.css';

type TextEntry = {
  section: ContentSection;
  path: (string | number)[];
  value: string | number;
  renderedValue?: string;
  label: string;
};

type Selection =
  | { kind: 'text'; matches: TextEntry[] }
  | { kind: 'photo'; slot: string };

const SECTION_NAMES: Partial<Record<ContentSection, string>> = {
  brand: 'Brand',
  contact: 'Contact details',
  header: 'Header',
  footer: 'Footer',
  home: 'Home',
  about: 'About',
  servicesPage: 'Services page',
  serviceDetail: 'Service labels',
  festive: 'Festive Decor',
  portfolio: 'Portfolio',
  contactPage: 'Contact page',
  services: 'Services',
  notFound: 'Page not found',
};

const PAGE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Festive Decor', href: '/festive-decor' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
  { label: 'Page not found', href: '/aurevia-page-preview-not-found' },
];

function normalize(value: string | number): string {
  return String(value).replace(/\*/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
}

function pathLabel(path: (string | number)[]): string {
  return path.map((part) => typeof part === 'number'
    ? `Item ${part + 1}`
    : part.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase())
  ).join(' · ');
}

function collectText(value: unknown, section: ContentSection, path: (string | number)[], result: TextEntry[]) {
  if (typeof value === 'number') {
    result.push({ section, path, value, label: `${SECTION_NAMES[section]} · ${pathLabel(path)}` });
    return;
  }
  if (typeof value === 'string') {
    if (value.trim() && !['slot', 'slug', 'icon', 'phoneHref', 'whatsapp', 'instagram'].includes(String(path.at(-1)))) {
      result.push({ section, path, value, label: `${SECTION_NAMES[section]} · ${pathLabel(path)}` });
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectText(item, section, [...path, index], result));
    return;
  }
  Object.entries(value).forEach(([key, item]) => collectText(item, section, [...path, key], result));
}

function sectionForPage(page: string): ContentSection | null {
  if (page === '/') return 'home';
  if (page === '/about') return 'about';
  if (page === '/services') return 'servicesPage';
  if (page.startsWith('/services/')) return 'services';
  if (page === '/festive-decor') return 'festive';
  if (page === '/portfolio') return 'portfolio';
  if (page === '/contact') return 'contactPage';
  if (page === '/aurevia-page-preview-not-found') return 'notFound';
  return null;
}

function matchPriority(entry: TextEntry, page: string): number {
  if (entry.section === sectionForPage(page)) return 0;
  if (page.startsWith('/services/') && entry.section === 'serviceDetail') return 1;
  if (entry.section === 'header' || entry.section === 'footer') return 2;
  if (entry.section === 'brand' || entry.section === 'contact') return 3;
  return 4;
}

function updatedContent(content: Content, entry: TextEntry, value: string | number): Content {
  const next = structuredClone(content);
  let field: unknown = next[entry.section];
  for (const part of entry.path.slice(0, -1)) {
    field = (field as Record<string | number, unknown>)[part];
  }
  (field as Record<string | number, unknown>)[entry.path.at(-1)!] = value;
  return next;
}

export function VisualStudio({
  email,
  initialContent,
  slots,
  bundled,
  cloudName,
  uploadsEnabled,
}: {
  email: string;
  initialContent: Content;
  slots: MediaSlot[];
  bundled: Record<string, string>;
  cloudName: string;
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const restoreScroll = useRef<number | null>(null);
  const [frameVersion, setFrameVersion] = useState(0);
  const [content, setContent] = useState(initialContent);
  const [page, setPage] = useState('/');
  const [mode, setMode] = useState<'edit' | 'browse'>('edit');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [choice, setChoice] = useState(0);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const entries = useMemo(() => {
    const result: TextEntry[] = [];
    for (const [section, value] of Object.entries(content) as [ContentSection, unknown][]) {
      if (section !== 'media') collectText(value, section, [], result);
    }

    const template = (section: ContentSection, path: string[], renderedValue: string) => {
      const source = result.find((entry) => entry.section === section && entry.path.join('.') === path.join('.'));
      if (source) result.push({ ...source, renderedValue });
    };
    for (const service of content.services) {
      template('servicesPage', ['rowCta'], content.servicesPage.rowCta.replace('{name}', service.short));
      const short = result.find((entry) => entry.section === 'services' && entry.value === service.short && entry.path.at(-1) === 'short');
      if (short) result.push({ ...short, renderedValue: `Explore ${service.short} →` });
      for (const pkg of service.packages) {
        template('serviceDetail', ['packages', 'cta'], content.serviceDetail.packages.cta.replace('{tier}', pkg.tier));
      }
    }
    for (const tier of content.festive.compare.tiers) {
      template('festive', ['compare', 'cta'], content.festive.compare.cta.replace('{tier}', tier.tier));
    }
    return result;
  }, [content]);

  const pages = useMemo(() => [
    ...PAGE_LINKS,
    ...content.services.map((service) => ({
      label: `Service · ${service.short}`,
      href: `/services/${service.slug}`,
    })),
  ], [content.services]);

  const refreshPreview = useCallback(() => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    restoreScroll.current = win.scrollY;
    win.location.reload();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const win = frame?.contentWindow;
    const doc = win?.document;
    if (!win || !doc) return;

    let lastPath = '';
    const syncPath = () => {
      const next = win.location.pathname;
      if (next === lastPath || next.startsWith('/admin') || next.startsWith('/studio')) return;
      lastPath = next;
      setPage(next);
      setSelection(null);
      setMessage('');
    };

    const click = (event: MouseEvent) => {
      if (mode !== 'edit') return;
      const target = event.target as HTMLElement | null;
      if (!target || target.nodeType !== 1) return;

      const photo = target.closest<HTMLElement>('[data-media-slot]');
      const slot = photo?.dataset.mediaSlot;
      if (slot && slots.some((item) => item.slot === slot)) {
        event.preventDefault();
        event.stopPropagation();
        setSelection({ kind: 'photo', slot });
        setMessage('');
        return;
      }

      let element: HTMLElement | null = target;
      let best: { matches: TextEntry[]; length: number } | null = null;
      while (element && element !== doc.body) {
        const text = element.tagName === 'INPUT'
          ? (element as HTMLInputElement).placeholder
          : element.innerText;
        const normalized = normalize(text ?? '');
        if (normalized && normalized.length < 600) {
          const matches = entries.filter((entry) => normalize(entry.renderedValue ?? entry.value) === normalized);
          if (matches.length && (!best || normalized.length > best.length)) {
            best = { matches, length: normalized.length };
          }
        }
        element = element.parentElement;
      }

      if (!best) return;
      const matches = best.matches.sort((a, b) => matchPriority(a, win.location.pathname) - matchPriority(b, win.location.pathname));
      event.preventDefault();
      event.stopPropagation();
      setSelection({ kind: 'text', matches });
      setChoice(0);
      setDraft(String(matches[0].value));
      setMessage('');
    };

    doc.addEventListener('click', click, true);
    win.addEventListener('popstate', syncPath);
    const timer = win.setInterval(syncPath, 250);
    syncPath();

    return () => {
      doc.removeEventListener('click', click, true);
      win.removeEventListener('popstate', syncPath);
      win.clearInterval(timer);
    };
  }, [entries, frameVersion, mode, slots]);

  const navigate = (path: string) => {
    if (!pages.some((item) => item.href === path)) return;
    setPage(path);
    setSelection(null);
    setMessage('');
    if (frameRef.current) frameRef.current.src = path;
  };

  const signOut = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/admin/session', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not sign out');
      router.replace('/admin/login');
      router.refresh();
    } catch {
      setBusy(false);
      setMessage('Could not sign out. Please try again.');
    }
  };

  const save = async () => {
    if (selection?.kind !== 'text') return;
    const entry = selection.matches[choice];
    if (!entry || draft === String(entry.value)) return;
    const nextValue = typeof entry.value === 'number' ? Number(draft) : draft;
    if (typeof nextValue === 'number' && (!Number.isFinite(nextValue) || !draft.trim())) {
      setMessage('Enter a valid number.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const result = await saveVisibleText(entry.section, entry.path, nextValue);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setContent((current) => updatedContent(current, entry, nextValue));
      setSelection(null);
      setMessage('Saved. The live page has been updated.');
      refreshPreview();
    } catch {
      setMessage('Could not save. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const chosen = selection?.kind === 'text' ? selection.matches[choice] : null;
  const selectedSlot = selection?.kind === 'photo'
    ? slots.find((item) => item.slot === selection.slot)
    : null;

  return (
    <div className={styles.studio}>
      <header className={styles.toolbar}>
        <div className={styles.identity}>
          <span className={styles.mark}>A</span>
          <div>
            <span className={styles.name}>Aurevia Studio</span>
            <span className={styles.subname}>Editing as {email}</span>
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.pagePicker}>
            <span>Page</span>
            <select value={pages.some((item) => item.href === page) ? page : '/'} onChange={(event) => navigate(event.target.value)}>
              {pages.map((item) => <option key={item.href} value={item.href}>{item.label}</option>)}
            </select>
          </label>
          <div className={styles.modeSwitch} aria-label="Studio mode">
            <button type="button" aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}>Edit</button>
            <button type="button" aria-pressed={mode === 'browse'} onClick={() => setMode('browse')}>Browse</button>
          </div>
          <Link href="/admin/enquiries" className={styles.toolbarLink}>Enquiries</Link>
          <a href={page} target="_blank" rel="noopener noreferrer" className={styles.toolbarLink}>Open live ↗</a>
          <button type="button" className={styles.signOut} disabled={busy} onClick={() => void signOut()}>Sign out</button>
        </div>
      </header>

      <iframe
        ref={frameRef}
        title="Aurevia website preview"
        src="/"
        className={styles.preview}
        onLoad={() => {
          setFrameVersion((version) => version + 1);
          if (restoreScroll.current !== null) {
            const scrollY = restoreScroll.current;
            restoreScroll.current = null;
            frameRef.current?.contentWindow?.scrollTo(0, scrollY);
          }
        }}
      />

      {!selection && (
        <div className={styles.tip} role="status">
          {message || (mode === 'edit'
            ? 'Click any visible text or photograph to edit it. Switch to Browse to use links and filters.'
            : 'Browse the site as a visitor. Switch to Edit to change what you see.')}
        </div>
      )}

      {selection && (
        <aside className={styles.panel} aria-label="Edit selected content">
          <div className={styles.panelHead}>
            <div>
              <p className={styles.panelEyebrow}>{selection.kind === 'photo' ? 'Photograph' : 'Live text'}</p>
              <h2>{selection.kind === 'photo' ? selectedSlot?.label ?? 'Photograph' : 'Edit on page'}</h2>
            </div>
            <button type="button" className={styles.close} aria-label="Close editor" onClick={() => setSelection(null)}>×</button>
          </div>

          {selection.kind === 'text' && chosen && (
            <div className={styles.panelBody}>
              {selection.matches.length > 1 && (
                <label className={styles.field}>
                  <span>Which occurrence?</span>
                  <select value={choice} onChange={(event) => {
                    const index = Number(event.target.value);
                    setChoice(index);
                    setDraft(String(selection.matches[index].value));
                  }}>
                    {selection.matches.map((item, index) => <option key={`${item.section}-${item.path.join('.')}`} value={index}>{item.label}</option>)}
                  </select>
                </label>
              )}
              <p className={styles.context}>{chosen.label}</p>
              <label className={styles.field}>
                <span>Text shown on the website</span>
                {typeof chosen.value === 'number'
                  ? <input type="number" value={draft} onChange={(event) => setDraft(event.target.value)} />
                  : <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={Math.max(4, Math.min(10, Math.ceil(draft.length / 45)))} />}
              </label>
              {typeof chosen.value === 'string' && chosen.value.includes('*') && <p className={styles.hint}>Keep *asterisks* around words you want highlighted in gold.</p>}
              {message && <p className={styles.error} role="alert">{message}</p>}
              <div className={styles.panelActions}>
                <button type="button" className={styles.save} disabled={busy || draft === String(chosen.value)} onClick={() => void save()}>{busy ? 'Saving…' : 'Save change'}</button>
                <Link href={`/admin/${chosen.section}`} className={styles.advanced}>All fields ↗</Link>
              </div>
            </div>
          )}

          {selection.kind === 'photo' && selectedSlot && (
            <div className={styles.panelBody}>
              {!uploadsEnabled && <p className={styles.hint}>Photo uploads need a connected media provider. The image frame is ready; text editing works now.</p>}
              <SlotCard
                key={selectedSlot.slot}
                slot={selectedSlot}
                asset={content.media[selectedSlot.slot]}
                bundled={bundled[selectedSlot.slot]}
                cloudName={cloudName}
                uploadsEnabled={uploadsEnabled}
                onSaved={(asset) => {
                  setContent((current) => {
                    const media = { ...current.media };
                    if (asset) media[selectedSlot.slot] = asset;
                    else delete media[selectedSlot.slot];
                    return { ...current, media };
                  });
                  refreshPreview();
                }}
              />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
