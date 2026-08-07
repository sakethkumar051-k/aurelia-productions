'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const REVEAL_THRESHOLD = 0.94; // already-visible elements reveal immediately
const STAGGER_STEP = 95; // ms between siblings inside a [data-stagger] group
const STAGGER_CAP = 7;
const COUNT_DURATION = 1500;
const HEADER_SOLID_AT = 70;

function runCount(node: HTMLElement) {
  if (node.dataset.counted) return;
  node.dataset.counted = '1';

  const target = parseInt(node.getAttribute('data-count') ?? '', 10);
  if (!target) return;

  const start = performance.now();
  node.textContent = '0';

  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / COUNT_DURATION);
    node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function reveal(el: HTMLElement) {
  el.setAttribute('data-shown', '');
  if (el.hasAttribute('data-count')) runCount(el);
  el.querySelectorAll<HTMLElement>('[data-count]').forEach(runCount);
}

/**
 * Drives the design's scroll behaviour: reveal-on-enter with stagger, the
 * count-up statistics, the hero parallax layer and the header's solid state.
 * All of it is skipped when the visitor prefers reduced motion — the inline
 * boot script leaves `data-fx` off, and the CSS then renders everything at rest.
 */
export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const enabled = root.dataset.fx === 'on';

    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    );

    const onScroll = () => {
      const y = window.scrollY || 0;
      root.dataset.scrolled = y > HEADER_SOLID_AT ? 'true' : 'false';
      if (!enabled) return;
      for (const layer of parallax) {
        const factor = parseFloat(layer.dataset.parallax || '0');
        layer.style.transform = `translateY(${(y * factor).toFixed(1)}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!enabled) {
      document
        .querySelectorAll<HTMLElement>('[data-count]')
        .forEach((n) => (n.dataset.counted = '1'));
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );

    const seen = new WeakSet<HTMLElement>();

    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);

        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight * REVEAL_THRESHOLD && box.bottom > 0) {
          reveal(el);
          return;
        }

        const group = el.closest<HTMLElement>('[data-stagger]');
        if (group) {
          const siblings = Array.from(
            group.querySelectorAll<HTMLElement>('[data-reveal]'),
          );
          const index = siblings.indexOf(el);
          if (index > 0) {
            el.style.transitionDelay = `${Math.min(index, STAGGER_CAP) * STAGGER_STEP}ms`;
          }
        }

        observer.observe(el);
      });
    };

    scan();

    let debounce: ReturnType<typeof setTimeout>;
    const mutations = new MutationObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(scan, 60);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      mutations.disconnect();
      clearTimeout(debounce);
    };
  }, [pathname]);

  return null;
}
