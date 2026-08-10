import type { Metadata } from 'next';
import Link from 'next/link';

import { Emphasis } from '@/components/emphasis';
import { LotusDivider } from '@/components/lotus-divider';
import { Photo } from '@/components/photo';
import { getContent } from '@/lib/content';

import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About the house',
  description:
    'Nine years, one standard. Aurevia designs in-house and fabricates in-house — meet the crew who answer your first call and run your function.',
  alternates: { canonical: '/about' },
};

export default async function AboutPage() {
  const { about, media } = await getContent();

  return (
    <>
      <section aria-labelledby="ab-h" className={styles.hero}>
        <div data-stagger className="container">
          <p data-reveal="y" className={styles.heroEyebrow}>
            {about.hero.eyebrow}
          </p>
          <h1 id="ab-h" data-reveal="y" className={styles.heroTitle}>
            <Emphasis text={about.hero.title} />
          </h1>
          <p data-reveal="y" className={styles.heroScript}>
            {about.hero.script}
          </p>
        </div>
      </section>

      <section aria-labelledby="story-h" className={styles.story}>
        <div className={styles.storyGrid}>
          <div data-stagger>
            <p data-reveal="y" className={styles.storyEyebrow}>
              {about.story.eyebrow}
            </p>
            <h2 id="story-h" data-reveal="y" className={styles.storyTitle}>
              <Emphasis text={about.story.title} />
            </h2>
            {about.story.paragraphs.map((paragraph, index) => (
              <p key={index} data-reveal="y" className={styles.storyBody}>
                {paragraph}
              </p>
            ))}
          </div>

          <div data-reveal="zoom" className={styles.storyFigure}>
            <div className={styles.storyFrame}>
              <Photo
                slot="about-story"
                asset={media['about-story']}
                alt={about.story.imageAlt}
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
            {about.philosophy.eyebrow}
          </p>
          <h2 id="phil-h" data-reveal="y" className={styles.philosophyQuote}>
            {about.philosophy.quote}
          </h2>
          <LotusDivider className={styles.philosophyDivider} />
        </div>
      </section>

      <section aria-labelledby="proc-h" className={styles.process}>
        <div className="container">
          <p data-reveal="y" className={styles.processEyebrow}>
            {about.process.eyebrow}
          </p>
          <h2 id="proc-h" data-reveal="y" className={styles.processTitle}>
            <Emphasis text={about.process.title} />
          </h2>

          <div data-stagger className={styles.processGrid}>
            {about.process.steps.map((step) => (
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
            {about.team.eyebrow}
          </p>
          <h2 id="team-h" data-reveal="y" className={styles.teamTitle}>
            <Emphasis text={about.team.title} />
          </h2>

          <div data-stagger className={styles.teamGrid}>
            {about.team.members.map((member) => (
              <figure key={member.slot} data-reveal="y" className={styles.teamCard}>
                <div className={styles.teamFrame}>
                  <Photo
                    slot={member.slot}
                    asset={media[member.slot]}
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
              {about.team.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
