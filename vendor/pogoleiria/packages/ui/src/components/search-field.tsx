'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '../lib/utils';
import { Input } from './input';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Accessible name for the input. Required — the visual label is icon-only. */
  ariaLabel: string;
  /** Accessible name for the clear button, which is also icon-only. */
  clearLabel: string;
  className?: string;
  disabled?: boolean;
};

/**
 * The search box shared by quests and dex.
 *
 * Both apps previously carried their own byte-identical copy of this markup
 * (quests/components/search-bar.tsx and an inline `searchBar` helper inside
 * dex's mega-tracker), which is exactly the hand-matching the shared package
 * exists to end. dex's copy had also lost the accessible names along the way.
 */
function SearchField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  clearLabel,
  className,
  disabled = false,
}: SearchFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasQuery = value.length > 0;

  return (
    <div
      data-slot="search-field"
      className={cn(
        // An empty input used to carry --control-border (L 0.62) while every
        // other edge on the screen was --hairline (L 0.205), so the brightest
        // thing on a quest list was the search box. Brightness should follow
        // attention: hairline at rest, ember once you're actually in it.
        // Holofote: a filled field, no frame at rest, as in the mockup; the
        // fill is the surface one step up from the page, so it reads as a
        // place to type without a line drawn round it.
        'h-12 rounded-2xl lg:rounded-lg border border-transparent bg-surface-raised pl-3.5 pr-1 transition-all motion-reduce:transition-none duration-200',
        // The frame is the input's only focus indicator. It used to share the
        // job with the shell's global outline on the bare <input>, which sat
        // 2px out from an input inset past the icon: a second, shorter box
        // with its own corners, overlapping this one. tokens.css now leaves
        // SearchField out, so the ring here carries focus on its own: 2px of
        // ember-bright, the weight and colour of every other focus ring in
        // the shell, following this border's radius. Keyed to the input
        // rather than :focus-within so a keyboard-focused clear button shows
        // its own ring instead of two at once.
        'has-[input:focus-visible]:border-ember-bright has-[input:focus-visible]:ring-1 has-[input:focus-visible]:ring-ember-bright',
        className
      )}
    >
      <div className="flex h-full items-center gap-2 text-ink-subtle">
        <Search
          className={cn(
            'h-[18px] w-[18px] shrink-0 transition-colors motion-reduce:transition-none duration-200',
            hasQuery ? 'text-ember-bright' : 'text-ink-subtle'
          )}
        />
        <Input
          ref={inputRef}
          type="search"
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-body font-medium text-ink-strong shadow-none outline-none placeholder:font-normal placeholder:text-ink-subtle focus-visible:outline-0"
        />
        <button
          type="button"
          disabled={disabled || !hasQuery}
          aria-hidden={!hasQuery}
          tabIndex={hasQuery ? undefined : -1}
          style={{ visibility: hasQuery ? 'visible' : 'hidden' }}
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label={clearLabel}
          title={clearLabel}
          // The ring is inset: the button is exactly as tall as the field's
          // inside, so an outward ring would cut through the frame.
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted outline-none transition-all motion-reduce:transition-none duration-150 hover:bg-surface-hover hover:text-ink-strong focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember-bright"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { SearchField };
