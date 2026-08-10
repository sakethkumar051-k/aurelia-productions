import { Fragment } from 'react';

/**
 * Renders the design's italic gold emphasis inside a heading.
 *
 * Content stores headings as one editable string — `Five pillars, one *atelier*`
 * — so an editor can move or remove the emphasis without touching markup.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split('*');

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="em">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Strips the emphasis markers — for `<title>`, meta descriptions and alt text. */
export function plain(text: string): string {
  return text.replace(/\*/g, '');
}

/** Fills `{name}`-style placeholders in an editable label. */
export function fill(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}
