type LotusDividerProps = {
  className?: string;
};

/** Gold rule — lotus glyph — gold rule. The house divider. */
export function LotusDivider({ className }: LotusDividerProps) {
  return (
    <div
      data-reveal="y"
      className={className ? `lotusDivider ${className}` : 'lotusDivider'}
    >
      <span data-reveal="x" className="lotusRuleLeft" />
      <LotusGlyph />
      <span data-reveal="x" className="lotusRuleRight" />
    </div>
  );
}

export function LotusGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C9A44C"
      strokeWidth="1"
    >
      <path d="M12 2.5c1.9 3.9 5.6 5.8 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-3.8 3.7-5.7 5.6-9.6Z" />
      <path d="M12 8.4V21" />
    </svg>
  );
}

/** Gold tick used in checklists and tier bullets. */
export function CheckMark({
  size = 19,
  strokeWidth = 1.6,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C9A44C"
      strokeWidth={strokeWidth}
      className={className}
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

/** Line icon rendered from the design's hand-drawn 24×24 paths. */
export function LineIcon({ d, size = 22 }: { d: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
