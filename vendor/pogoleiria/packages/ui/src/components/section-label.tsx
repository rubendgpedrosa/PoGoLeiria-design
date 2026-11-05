import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * The label and figure above a list, at the suite's two named levels.
 *
 * D7 named the two. `live` is the hub's SectionHeader look — the display face,
 * sentence case, at `figure`, in `ink-bright` — for what you can still act on
 * before it expires. `ambient` is the old tracked-uppercase label — 10px, bold,
 * `ink-subtle` — for context that will still be true tonight. Case is part of
 * the split: only the live level drops the capitals. `ambient` is the default,
 * so a bare SectionLabel keeps the look it always had.
 *
 * The count, when given, sits opposite the label in the display face so figures
 * line up between rows. Without one the label renders alone, with no wrapper to
 * indent it.
 * The hub's SectionHeader `ambient` is figure-sized; this one is the 10px label.
 * Same name, two looks, until the owner decides (ui-review D5).
 */
type Tone = 'live' | 'ambient';

const TONES: Record<Tone, string> = {
  live: 'font-display text-figure font-extrabold tracking-[-0.02em] text-ink-bright lg:text-figure-lg',
  ambient: 'text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle',
};

function SectionLabel({
  tone = 'ambient',
  count,
  className,
  children,
  ...props
}: React.ComponentProps<'p'> & { tone?: Tone; count?: React.ReactNode }) {
  const label = (
    <p data-slot="section-label" className={cn(TONES[tone], className)} {...props}>
      {children}
    </p>
  );

  // No count, no row: the label is the whole thing, and a wrapper would only
  // add a flex box that stretches it to a width it does not fill.
  if (count === undefined) {
    return label;
  }

  return (
    <div className="flex items-baseline justify-between gap-2">
      {label}
      <span className="font-display text-label font-semibold tabular-nums text-ink-subtle lg:text-body">{count}</span>
    </div>
  );
}

export { SectionLabel };
