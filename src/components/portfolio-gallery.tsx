'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Photo } from '@/components/photo';
import {
  PORTFOLIO,
  PORTFOLIO_FILTERS,
  type PortfolioFilter,
  portfolioSlot,
} from '@/content/portfolio';

import styles from './portfolio-gallery.module.css';

export function PortfolioGallery() {
  const [filter, setFilter] = useState<PortfolioFilter>('All');
  const [index, setIndex] = useState(-1);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const items = useMemo(
    () =>
      filter === 'All'
        ? PORTFOLIO
        : PORTFOLIO.filter((item) => item.cat === filter),
    [filter],
  );

  const isOpen = index >= 0 && index < items.length;
  const current = isOpen ? items[index] : null;

  const step = useCallback(
    (direction: number) => {
      setIndex((value) => {
        const total = items.length;
        if (total === 0) return -1;
        return (value + direction + total) % total;
      });
    },
    [items.length],
  );

  const close = useCallback(() => {
    setIndex(-1);
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  }, []);

  const open = (position: number, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setIndex(position);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
        return;
      }

      if (event.key !== 'Tab') return;

      // Keep focus inside the viewer while it is open.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  return (
    <>
      <div
        role="group"
        aria-label="Filter portfolio by category"
        className={styles.filters}
      >
        {PORTFOLIO_FILTERS.map((option) => {
          const active = filter === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFilter(option);
                setIndex(-1);
              }}
              className={
                active
                  ? `${styles.filter} ${styles.filterActive}`
                  : styles.filter
              }
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className={styles.masonry}>
        {items.map((item, position) => (
          <figure key={item.title} className={styles.tile}>
            <button
              type="button"
              aria-label={`Open larger view: ${item.title}`}
              onClick={(event) => open(position, event.currentTarget)}
              className={styles.tileButton}
            >
              <span
                className={styles.tileFrame}
                style={{ height: `${item.h}px` }}
              >
                <Photo
                  slot={portfolioSlot(item.title)}
                  alt={item.alt}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </span>
              <span className={styles.tileCaption}>
                <span>
                  <span className={styles.tileTitle}>{item.title}</span>
                  <span className={styles.tilePlace}>{item.place}</span>
                </span>
                <span className={styles.tileCat}>{item.cat}</span>
              </span>
            </button>
          </figure>
        ))}
      </div>

      {isOpen && current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image viewer"
          className={styles.lightbox}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close viewer"
            onClick={close}
            className={`${styles.lbButton} ${styles.lbClose}`}
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => step(-1)}
            className={`${styles.lbButton} ${styles.lbPrev}`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => step(1)}
            className={`${styles.lbButton} ${styles.lbNext}`}
          >
            ›
          </button>

          <figure className={styles.lbFigure}>
            <div className={styles.lbFrame}>
              <Photo
                slot={portfolioSlot(current.title)}
                alt={current.alt}
                fit="contain"
                sizes="(max-width: 1000px) 100vw, 980px"
              />
            </div>
            <figcaption className={styles.lbCaption}>
              <div>
                <p className={styles.lbTitle}>{current.title}</p>
                <p className={styles.lbMeta}>
                  {current.place} · {current.cat}
                </p>
              </div>
              <p aria-live="polite" className={styles.lbCount}>
                {index + 1} / {items.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
