import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * The top of every page in the suite (Holofote): an optional avatar, the page's name
 * over one meta line, and an optional control at the end. One component so
 * the hub, Quests and the Pokédex stop drifting apart; they had grown three
 * logo sizes (44/48/52), three title sizes (19/24/30) and three meta styles.
 *
 * The title row is 44px tall whatever it holds (a plain name, or the
 * Pokédex's section links, which are 44px tap targets), so every header is
 * one height. 24px titles: two section names side by side fit a phone.
 *
 * Behind it on a phone, the brand (owner, 2026-10-11): the PoGoLeiria mark,
 * large, upright, cropped and faint (`.page-brand` in
 * tokens.css; the app sets `--brand-mark`). No coloured band: only the mark.
 * The compact mobile header separates the mark from the list with a hairline.
 * Not from lg: the header is inside a padded sidebar there.
 *
 * The shell's desktop header carries the brand.
 * `titleDesktopHidden` hides the title there too (the hub, whose title is
 * the brand); `trailing` always stays.
 */
function PageHeader({
  logo,
  title,
  meta,
  trailing,
  titleDesktopHidden = false,
  logoDesktopHidden = true,
  className,
  children,
}: {
  logo?: React.ReactNode;
  /** A string becomes the page's h1; pass nodes to set your own. */
  title: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  titleDesktopHidden?: boolean;
  /** False for something that isn't the brand (a trainer's avatar), which stays on desktop. */
  logoDesktopHidden?: boolean;
  className?: string;
  /** Anything under the row: the Pokédex's progress bar. */
  children?: React.ReactNode;
}) {
  return (
    <header data-slot="page-header" className={cn('page-header relative isolate -mx-4 flex shrink-0 flex-col px-4', className)}>
      <span aria-hidden="true" className="page-brand" />
      <div className="flex min-w-0 items-center gap-3">
        {logo ? <span className={cn('shrink-0', logoDesktopHidden && 'lg:hidden')}>{logo}</span> : null}
        <div className={cn('min-w-0 flex-1', titleDesktopHidden && 'lg:hidden')}>
          {typeof title === 'string' ? (
            <h1 className="flex min-h-11 items-center truncate font-display text-2xl font-extrabold leading-none tracking-[-0.03em] text-ink-bright">
              {title}
            </h1>
          ) : (
            title
          )}
          <p className="h-4 truncate text-label leading-4 text-ink-muted">{meta ?? ' '}</p>
        </div>
        {trailing ? <div className="ml-auto shrink-0">{trailing}</div> : null}
      </div>
      {children}
    </header>
  );
}

export { PageHeader };
