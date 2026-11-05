import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * A count on an icon — the switcher's pending items, the dock's active
 * filters.
 *
 * Gold used to mark every count, alongside rewards and figures, and three
 * meanings made it mean nothing; a count of matching rows is not a reward.
 * It is neutral now (owner, 2026-10-17): ink-bright on the sunken surface,
 * never gold.
 *
 * The number is decoration and stays out of the accessibility tree; `label`
 * carries its meaning in words ("2 pedidos por aprovar"). Not a Badge
 * variant: Badge is a focusable inline-flex box with its own sizing and focus
 * treatment, and this is a pill pinned to a corner.
 */
function CountDot({ count, label, className }: { count: number; label: string; className?: string }) {
  return (
    <span
      data-slot="count-dot"
      className={cn(
        'flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-bright px-1 text-micro font-bold leading-none tabular-nums text-surface-sunken',
        className
      )}
    >
      <span aria-hidden="true">{count > 99 ? '99+' : count}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { CountDot };
