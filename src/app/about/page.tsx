import type { Metadata } from 'next';
import Link from 'next/link';

import { LotusDivider } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { TEAM, TIMELINE } from '@/content/site';

import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About the house',
  description:
    'Nine years, one standard. Aurevia designs in-house and fabricates in-house — meet the crew who answer your first call and run your function.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="ab-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            About the house
          </p>
          <h1 id="ab-h" data-reveal="y" className={styles.heroTitle}>
            A studio built on <span className="em">detail</span>
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            We customize, You celebrate.
          </p>
        </div>
      </section>

      <section aria-labelledby="story-h" className={styles.story}>
        <div className={styles.storyGrid}>
          <div data-stagger>
            <p data-reveal="y" className={styles.storyEyebrow}>
              Our story
            </p>
            <h2 id="story-h" data-reveal="y" className={styles.storyTitle}>
              Nine years of <span className="em">first dances</span>
            </h2>
            <p data-reveal="y" className={styles.storyBody}>
              Aurevia began with one mandap in a Pune housing society and a
              promise that nobody would have to chase us on the morning of the
              function. Nine years on we are a workshop, a floral chain, a films
              unit and a production crew — still run by the people who answer
              your first call.
            </p>
            <p data-reveal="y" className={styles.storyBody}>
              We design in-house and fabricate in-house. That is why a theme you
              approve on a render is the theme that arrives on the truck, and
              why a Normal package never feels like a lesser version of a
              Premium one.
            </p>
            <p data-reveal="y" className={styles.storyBody}>
              Weddings, festivals, films and brand stages — different crafts, one
              standard.
            </p>
          </div>

          <div data-reveal="zoom" className={styles.storyFigure}>
            <div className={styles.storyFrame}>
              <Photo
                slot="about-story"
                alt="Workshop table with fabric swatches, flowers and sketches"
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="phil-h" className={styles.philosophy}>
        <div className={styles.philosophyInner}>
          <p data-reveal="y" className={styles.philosophyEyebrow}>
            Philosophy
          </p>
          <h2 id="phil-h" data-reveal="y" className={styles.philosophyQuote}>
            A celebration is not a set of vendors. It is one story told in
            flowers, light, sound and timing — and it should sound like your
            family, not like ours.
          </h2>
          <LotusDivider className={styles.philosophyDivider} />
        </div>
      </section>

      <section aria-labelledby="proc-h" className={styles.process}>
        <div className="container">
          <p data-reveal="y" className={styles.processEyebrow}>
            How we work
          </p>
          <h2 id="proc-h" data-reveal="y" className={styles.processTitle}>
            Consult · Design · Setup · <span className="em">Execute</span>
          </h2>

          <div data-stagger className={styles.processGrid}>
            {TIMELINE.map((step) => (
              <div key={step.n} data-reveal="y" className={styles.processStep}>
                <span aria-hidden="true" className={styles.processNode} />
                <p className={styles.processNumber}>{step.n}</p>
                <h3 className={styles.processStepTitle}>{step.t}</h3>
                <p className={styles.processStepBody}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="team-h" className={styles.team}>
        <div className="container">
          <p data-reveal="y" className={styles.teamEyebrow}>
            The people
          </p>
          <h2 id="team-h" data-reveal="y" className={styles.teamTitle}>
            Who you will <span className="em">actually meet</span>
          </h2>

          <div data-stagger className={styles.teamGrid}>
            {TEAM.map((member) => (
              <figure key={member.slot} data-reveal="y" className={styles.teamCard}>
                <div className={styles.teamFrame}>
                  <Photo
                    slot={member.slot}
                    alt={member.alt}
                    sizes="(max-width: 700px) 100vw, 25vw"
                  />
                </div>
                <figcaption className={styles.teamCaption}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div data-reveal="y" className={styles.teamCta}>
            <Link href="/contact" className="btn btnLg btnMaroon">
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
