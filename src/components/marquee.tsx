import { MARQUEE_WORDS } from '@/content/site';

import styles from './marquee.module.css';

/** Decorative service ticker — duplicated once so the loop is seamless. */
export function Marquee() {
  return (
    <div aria-hidden="true" className={styles.strip}>
      <div className={styles.track}>
        {[0, 1].map((run) => (
          <div key={run} className={styles.run}>
            {MARQUEE_WORDS.map((word) => (
              <span key={word} className={styles.word}>
                {word}
                <span className="diamond" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
