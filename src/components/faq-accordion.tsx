'use client';

import { useState } from 'react';

import type { Faq } from '@/content/services';

import styles from './faq-accordion.module.css';

type FaqAccordionProps = {
  slug: string;
  faqs: Faq[];
};

/** Single-open accordion — matches the design's one-question-at-a-time rule. */
export function FaqAccordion({ slug, faqs }: FaqAccordionProps) {
  const [open, setOpen] = useState('');

  return (
    <div data-stagger className={styles.list}>
      {faqs.map((faq, index) => {
        const key = `${slug}-${index}`;
        const isOpen = open === key;

        return (
          <div key={key} data-reveal="y" className={styles.item}>
            <h3 className={styles.heading}>
              <button
                type="button"
                id={`faq-trigger-${key}`}
                aria-expanded={isOpen}
                aria-controls={`faq-${key}`}
                onClick={() => setOpen(isOpen ? '' : key)}
                className={styles.trigger}
              >
                {faq.q}
                <span aria-hidden="true" className={styles.sign}>
                  {isOpen ? '–' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={`faq-${key}`}
              role="region"
              aria-labelledby={`faq-trigger-${key}`}
              hidden={!isOpen}
              className={styles.panel}
            >
              <p className={styles.answer}>{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
