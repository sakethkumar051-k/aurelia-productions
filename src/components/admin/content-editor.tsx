'use client';

import { useId, useRef, useState, useTransition } from 'react';

import { resetSection, saveSection } from '@/app/admin/actions';

import styles from './content-editor.module.css';

/* Labels and hints -------------------------------------------------------- */

/** Friendlier names for keys the schema keeps terse. */
const LABELS: Record<string, string> = {
  a: 'Answer',
  alt: 'Photo description',
  best: 'Best for',
  blurb: 'Short description',
  body: 'Body copy',
  cat: 'Category',
  cta: 'Button label',
  d: 'Description',
  eyebrow: 'Eyebrow (small caps line)',
  faqs: 'Questions',
  h: 'Tile height (px)',
  hero: 'Hero photo description',
  icon: 'Icon path (SVG)',
  includes: "What's included",
  items: 'Items',
  n: 'Number',
  place: 'Location',
  points: 'Bullet points',
  primary: 'Primary button',
  q: 'Question',
  script: 'Script line (handwritten font)',
  secondary: 'Secondary button',
  short: 'Short name',
  slot: 'Photo slot id',
  t: 'Title',
  title: 'Title',
};

/**
 * Labels for keys whose value is a group or a list. Several keys mean different
 * things depending on shape — a service's `hero` is a photo brief, a page's
 * `hero` is the whole top-of-page block — so containers get their own names.
 */
const CONTAINER_LABELS: Record<string, string> = {
  cta: 'Buttons',
  faqs: 'Questions',
  hero: 'Hero',
  includes: "What's included",
  items: 'Items',
  labels: 'Field labels',
  members: 'Team members',
  packages: 'Packages',
  paragraphs: 'Paragraphs',
  placeholders: 'Placeholder text',
  points: 'Bullet points',
  services: 'Pillars',
  steps: 'Steps',
  thanks: 'Thank-you panel',
  tiers: 'Tiers',
};

const HINTS: Record<string, string> = {
  title: 'Section headings only: wrap a word in *asterisks* to italicise it in gold.',
  cta: 'Use {tier} or {name} where the tier or pillar name should appear.',
  rowCta: 'Use {name} where the pillar short name should appear.',
  icon: 'SVG path data drawn on a 24×24 grid. Leave alone unless you have a replacement path.',
  slot: 'Permanent photo key. The photograph stays linked when you rename this entry.',
  slug: 'Permanent service URL and photo key. It stays fixed when you edit the service title.',
  h: 'Controls how tall this tile is in the portfolio masonry — 300 to 420 works well.',
};

/** Keys that always deserve a textarea regardless of current length. */
const LONG_KEYS = new Set([
  'a',
  'blurb',
  'body',
  'd',
  'description',
  'intro',
  'note',
  'quote',
  'paragraphs',
]);

function humanise(key: string, container = false): string {
  const override = container ? CONTAINER_LABELS[key] : LABELS[key];
  if (override) return override;

  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/[_-]/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** A blank value shaped like the sample — used when adding a list item. */
function blankLike(sample: unknown): unknown {
  if (Array.isArray(sample)) return [];
  if (sample === null || sample === undefined) return '';

  switch (typeof sample) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object': {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(sample as object)) {
        result[key] =
          key === 'slot'
            ? `custom-${crypto.randomUUID()}`
            : key === 'slug'
              ? `new-service-${crypto.randomUUID().slice(0, 8)}`
              : blankLike(value);
      }
      return result;
    }
    default:
      return '';
  }
}

/** A short human label for one item in a list of objects. */
function itemSummary(value: unknown, index: number): string {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    for (const key of ['title', 'name', 't', 'tier', 'q', 'label', 'cat', 'slug']) {
      const candidate = record[key];
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.length > 48 ? `${candidate.slice(0, 48)}…` : candidate;
      }
    }
  }
  return `Item ${index + 1}`;
}

/* Value editors ----------------------------------------------------------- */

type NodeProps = {
  fieldKey: string;
  value: unknown;
  sample?: unknown;
  onChange: (next: unknown) => void;
  depth: number;
};

function StringField({ fieldKey, value, onChange }: NodeProps) {
  const text = String(value ?? '');
  const long = LONG_KEYS.has(fieldKey) || text.length > 90 || text.includes('\n');
  const id = useId();
  const hint = HINTS[fieldKey];
  const fixed = fieldKey === 'slot' || fieldKey === 'slug';

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {humanise(fieldKey)}
      </label>
      {long ? (
        <textarea
          id={id}
          value={text}
          rows={Math.min(10, Math.max(3, Math.ceil(text.length / 80)))}
          onChange={(event) => onChange(event.target.value)}
          className={styles.textarea}
          readOnly={fixed}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={styles.input}
          readOnly={fixed}
        />
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

function NumberField({ fieldKey, value, onChange }: NodeProps) {
  const id = useId();
  const hint = HINTS[fieldKey];

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {humanise(fieldKey)}
      </label>
      <input
        id={id}
        type="number"
        value={Number(value ?? 0)}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.input}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

function BooleanField({ fieldKey, value, onChange }: NodeProps) {
  const id = useId();

  return (
    <div className={styles.field}>
      <div className={styles.checkboxRow}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor={id} className={styles.checkboxLabel}>
          {humanise(fieldKey)}
        </label>
      </div>
    </div>
  );
}

function ListField({ fieldKey, value, sample, onChange, depth }: NodeProps) {
  const items = Array.isArray(value) ? value : [];
  const sampleItems = Array.isArray(sample) ? sample : [];
  const ofStrings = typeof (items[0] ?? sampleItems[0] ?? '') === 'string';

  const replace = (index: number, next: unknown) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, position) => position !== index));
  };

  const move = (index: number, direction: number) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  };

  const add = () => {
    const template = blankLike(items[items.length - 1] ?? sampleItems[0] ?? '');
    onChange([...items, template]);
  };

  return (
    <fieldset className={`${styles.group} ${styles.groupNested}`}>
      <legend className={`${styles.groupLegend} ${styles.groupLegendNested}`}>
        {humanise(fieldKey, true)}
      </legend>

      <div className={styles.list}>
        {items.length === 0 && (
          <p className={styles.emptyList}>Nothing here yet.</p>
        )}

        {items.map((item, index) => {
          const tools = (
            <div className={styles.rowTools}>
              <button
                type="button"
                aria-label={`Move ${humanise(fieldKey, true)} item ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className={styles.tool}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move ${humanise(fieldKey, true)} item ${index + 1} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
                className={styles.tool}
              >
                ↓
              </button>
              <button
                type="button"
                aria-label={`Remove ${humanise(fieldKey, true)} item ${index + 1}`}
                onClick={() => remove(index)}
                className={`${styles.tool} ${styles.toolDanger}`}
              >
                ×
              </button>
            </div>
          );

          if (ofStrings) {
            const text = String(item ?? '');
            const long = LONG_KEYS.has(fieldKey) || text.length > 90;

            return (
              <div key={index} className={styles.listRow}>
                {long ? (
                  <textarea
                    value={text}
                    aria-label={`${humanise(fieldKey, true)} ${index + 1}`}
                    rows={Math.min(8, Math.max(3, Math.ceil(text.length / 80)))}
                    onChange={(event) => replace(index, event.target.value)}
                    className={styles.textarea}
                  />
                ) : (
                  <input
                    type="text"
                    value={text}
                    aria-label={`${humanise(fieldKey, true)} ${index + 1}`}
                    onChange={(event) => replace(index, event.target.value)}
                    className={styles.input}
                  />
                )}
                {tools}
              </div>
            );
          }

          return (
            <div key={index} className={styles.listItem}>
              <div className={styles.listItemHead}>
                <span className={styles.listItemTitle}>
                  {itemSummary(item, index)}
                </span>
                {tools}
              </div>
              <ValueEditor
                fieldKey={fieldKey}
                value={item}
                sample={sampleItems[0]}
                depth={depth + 1}
                onChange={(next) => replace(index, next)}
                hideLegend
              />
            </div>
          );
        })}

        <button type="button" onClick={add} className={styles.add}>
          + Add {humanise(fieldKey, true).toLowerCase()}
        </button>
      </div>
    </fieldset>
  );
}

function ObjectField({
  fieldKey,
  value,
  sample,
  onChange,
  depth,
  hideLegend,
}: NodeProps & { hideLegend?: boolean }) {
  const record = (value ?? {}) as Record<string, unknown>;
  const sampleRecord = (sample ?? {}) as Record<string, unknown>;

  const body = (
    <div className={styles.groupBody}>
      {Object.entries(record).map(([key, child]) => (
        <ValueEditor
          key={key}
          fieldKey={key}
          value={child}
          sample={sampleRecord[key]}
          depth={depth + 1}
          onChange={(next) => onChange({ ...record, [key]: next })}
        />
      ))}
    </div>
  );

  if (hideLegend) return body;

  return (
    <fieldset
      className={
        depth === 0 ? styles.group : `${styles.group} ${styles.groupNested}`
      }
    >
      <legend
        className={
          depth === 0
            ? styles.groupLegend
            : `${styles.groupLegend} ${styles.groupLegendNested}`
        }
      >
        {humanise(fieldKey, true)}
      </legend>
      {body}
    </fieldset>
  );
}

function ValueEditor(props: NodeProps & { hideLegend?: boolean }) {
  const { value } = props;

  if (Array.isArray(value)) return <ListField {...props} />;
  if (typeof value === 'number') return <NumberField {...props} />;
  if (typeof value === 'boolean') return <BooleanField {...props} />;
  if (value !== null && typeof value === 'object') {
    return <ObjectField {...props} />;
  }
  return <StringField {...props} />;
}

/* Editor shell ------------------------------------------------------------ */

type ContentEditorProps = {
  section: string;
  initialValue: unknown;
  defaultValue: unknown;
};

/**
 * Generic editor over one section of the content tree.
 *
 * Inputs are chosen from the *shape* of the data rather than a hand-written
 * form, so every field in the schema is editable and adding a field to the
 * schema surfaces it here automatically.
 */
export function ContentEditor({
  section,
  initialValue,
  defaultValue,
}: ContentEditorProps) {
  const [value, setValue] = useState<unknown>(initialValue);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<
    { kind: 'idle' | 'saved' | 'error'; message: string }
  >({ kind: 'idle', message: '' });
  const [pending, startTransition] = useTransition();
  const revision = useRef(0);

  const update = (next: unknown) => {
    revision.current += 1;
    setValue(next);
    setDirty(true);
    setStatus({ kind: 'idle', message: '' });
  };

  const save = () => {
    const savingRevision = revision.current;
    startTransition(async () => {
      const result = await saveSection(section, value);

      if (result.ok) {
        if (revision.current === savingRevision) {
          setDirty(false);
          setStatus({ kind: 'saved', message: 'Saved — the site is updated.' });
        } else {
          setStatus({ kind: 'idle', message: 'Newer changes are unsaved.' });
        }
      } else {
        setStatus({ kind: 'error', message: result.error });
      }
    });
  };

  const restore = () => {
    revision.current += 1;
    setValue(structuredClone(defaultValue));
    setDirty(true);
    setStatus({
      kind: 'idle',
      message: 'Original copy loaded — press Save to publish it.',
    });
  };

  const clearOverride = () => {
    if (!window.confirm('Reset this entire section to the original copy?')) return;
    const resettingRevision = revision.current;
    startTransition(async () => {
      const result = await resetSection(section);

      if (result.ok) {
        if (revision.current === resettingRevision) {
          revision.current += 1;
          setValue(structuredClone(defaultValue));
          setDirty(false);
          setStatus({ kind: 'saved', message: 'Reset to the shipped copy.' });
        } else {
          setStatus({ kind: 'idle', message: 'Newer changes are unsaved.' });
        }
      } else {
        setStatus({ kind: 'error', message: result.error });
      }
    });
  };

  const statusClass =
    status.kind === 'error'
      ? `${styles.barStatus} ${styles.barStatusError}`
      : status.kind === 'saved'
        ? `${styles.barStatus} ${styles.barStatusSaved}`
        : styles.barStatus;

  return (
    <div className={styles.editor}>
      <div className={styles.bar}>
        <p className={statusClass} role="status">
          {status.message ||
            (dirty ? 'Unsaved changes' : 'Everything is saved.')}
        </p>
        <button
          type="button"
          onClick={restore}
          disabled={pending}
          className={styles.secondary}
        >
          Load original
        </button>
        <button
          type="button"
          onClick={clearOverride}
          disabled={pending}
          className={styles.secondary}
        >
          Reset section
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className={styles.save}
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <ValueEditor
        fieldKey={section}
        value={value}
        sample={defaultValue}
        depth={0}
        onChange={update}
        hideLegend
      />
    </div>
  );
}
