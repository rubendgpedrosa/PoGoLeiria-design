'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Search, X } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * The dock (owner, 2026-10-11): a tool's controls in one floating bar at the
 * foot of a phone screen, above the switcher, in the thumb's reach. It took
 * the search field, the filters and the ways out of a page off the top of
 * Quests and the Pokédex, where on the Pokédex they filled four fifths of
 * the first screen before the list began.
 *
 * It floats, so it takes the one shadow and the lit edge. The page places it
 * (`DockArea`) and leaves room for it at the end of its list.
 */
function Dock({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dock"
      role="toolbar"
      className={cn(
        'lit pointer-events-auto flex h-14 items-center gap-0.5 rounded-xl border border-hairline-strong bg-surface-elevated pl-4 pr-1.5 shadow-float',
        className
      )}
      {...props}
    />
  );
}

/**
 * Where a page's dock sits: over the foot of the tool's own area, phones
 * only. Anything above the dock (a live strip) goes in before it. Taps
 * between its children reach the list underneath.
 */
function DockArea({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dock-area"
      className={cn('pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col gap-2 lg:hidden', className)}
      {...props}
    />
  );
}

/** The dock's search: the field without a frame of its own, taking the room the buttons leave. */
function DockSearch({
  value,
  onChange,
  placeholder,
  ariaLabel,
  clearLabel,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  clearLabel: string;
  disabled?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <label data-slot="search-field" className="flex h-full min-w-0 flex-1 items-center gap-2.5 text-ink-subtle">
      <span className="relative flex size-[18px] shrink-0 items-center justify-center">
        <Search aria-hidden="true" className={cn('size-[18px]', value && 'invisible')} />
        <button type="button" aria-label={clearLabel} title={clearLabel}
          disabled={disabled || !value} aria-hidden={!value} tabIndex={value ? undefined : -1}
          style={{ visibility: value ? 'visible' : 'hidden' }}
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute left-1/2 top-1/2 inline-flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:text-ink-strong focus-visible:outline-2 focus-visible:outline-ember-bright">
          <X aria-hidden="true" className="size-4" />
        </button>
      </span>
      <input
        ref={inputRef}
        type="search"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-full min-w-0 flex-1 bg-transparent text-body font-medium text-ink-strong outline-none placeholder:font-normal placeholder:text-ink-subtle [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  );
}

/** One of the dock's buttons: a 44px target, an icon, its name for a screen reader. `asChild` for a link. */
function DockButton({
  asChild = false,
  active = false,
  tone = 'plain',
  className,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean; active?: boolean; tone?: 'plain' | 'gold' }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="dock-button"
      {...(asChild ? {} : { type: 'button' as const })}
      className={cn(
        'relative inline-flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-ember-bright [&_svg]:size-5',
        active ? 'bg-ember text-white' : tone === 'gold' ? 'text-gold hover:bg-surface-hover' : 'text-ink-label hover:bg-surface-hover hover:text-ink-bright',
        className
      )}
      {...props}
    />
  );
}

/** The hairline between the search and the buttons. */
function DockSeparator() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-hairline-strong" />;
}

export { Dock, DockArea, DockSearch, DockButton, DockSeparator };
