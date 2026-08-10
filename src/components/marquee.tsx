import styles from './marquee.module.css';

/** Decorative service ticker — duplicated once so the loop is seamless. */
export function Marquee({ words }: { words: string[] }) {
  return (
    <div aria-hidden="true" className={styles.strip}>
      <div className={styles.track}>
        {[0, 1].map((run) => (
          <div key={run} className={styles.run}>
            {words.map((word) => (
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
