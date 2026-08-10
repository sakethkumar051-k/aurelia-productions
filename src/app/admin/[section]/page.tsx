import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContentEditor } from '@/components/admin/content-editor';
import { defaultContent } from '@/content/defaults';
import { sectionMeta } from '@/content/sections';
import { requireAdmin } from '@/lib/auth';
import { getContentFresh } from '@/lib/content';

import styles from '../admin.module.css';

type Params = { section: string };

export default async function SectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  await requireAdmin();

  const { section } = await params;
  const meta = sectionMeta(section);

  if (!meta) notFound();

  const content = await getContentFresh();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.pageEyebrow}>{meta.group}</p>
          <h1 className={styles.pageTitle}>{meta.label}</h1>
          <p className={styles.pageHint}>{meta.description}</p>
        </div>
        {meta.preview && (
          <Link
            href={meta.preview}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.signOut}
            style={{ width: 'auto', color: 'var(--maroon-mid)' }}
          >
            View live page ↗
          </Link>
        )}
      </div>

      <ContentEditor
        section={meta.key}
        initialValue={content[meta.key]}
        defaultValue={defaultContent[meta.key]}
      />
    </>
  );
}
