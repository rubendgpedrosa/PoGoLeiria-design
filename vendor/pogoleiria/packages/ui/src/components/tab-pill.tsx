'use client';
import * as React from 'react';

import { cn } from '../lib/utils';
import { TabsList, TabsTrigger } from './tabs';
import { SegmentedControl } from './segmented-control';

/**
 * The segmented container used for the desktop view toggle (quests) and the
 * filter tabs (dex).
 *
 * It reads as a track with a thumb in it now rather than a floating slab: a
 * sunken well, a hairline, and the selected segment filled. The heavy drop
 * shadow went with it — the only chrome that still floats above the page is
 * AppSwitcher, which owns the one --shadow-float.
 */
function TabPill({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="tab-pill"
      className={cn('rounded-full bg-surface-raised p-1', className)}
      {...props}
    />
  );
}

/**
 * Tailwind needs the whole class name in the source to emit it, so the column
 * counts are spelled out rather than built from the number.
 */
const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  // trades' five trade categories — 100%, Lucky, Shiny, XXL, XXS — are one
  // control with five short labels, not a row of five separate buttons.
  5: 'grid-cols-5',
  // Six once Normal joined them.
  6: 'grid-cols-6',
} as const;

/**
 * Equal-width tabs with the same 8° joins as the other segmented controls.
 */
function PillTabsList({
  cols,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsList> & { cols: keyof typeof COLS }) {
  return (
    <SegmentedControl asChild columns={cols} className="segmented-control--flush"><TabsList
      className={cn(
        'relative grid h-auto w-full bg-transparent p-0',
        COLS[cols],
        className
      )}
      {...props}
    >
      {children}
    </TabsList></SegmentedControl>
  );
}

/**
 * A trigger inside a TabPill, with the canonical active-state treatment.
 *
 * This string used to be copy-pasted at five call sites, and one copy had
 * already drifted: quests' desktop toggle was missing a glow layer and the
 * `hover:text-white` guard that its own bottom nav and dex's filter tabs both
 * had, so the same control looked different on desktop than on mobile.
 *
 * SegmentedControl paints the ember fill with the same 8° joins as the
 * other controls. Its foreground passes AA against the fill on its own.
 */
function PillTabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        'min-h-11 border-transparent text-body font-bold text-ink-muted shadow-none',
        'hover:text-ink-bright',
        'data-[state=active]:text-primary-foreground',
        'data-[state=active]:hover:text-primary-foreground',
        className
      )}
      {...props}
    />
  );
}

export { TabPill, PillTabsList, PillTabsTrigger };
