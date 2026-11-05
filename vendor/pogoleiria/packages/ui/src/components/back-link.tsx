import * as React from 'react';
import { ChevronLeft } from 'lucide-react';

import { cn } from '../lib/utils';

/**
 * One back affordance for the suite.
 *
 * Six patterns had grown for one job: a pill with a chevron
 * (profile-hero), a ghost button with an arrow (community-feed), a bare
 * meta link "‹ A minha Pokédex" (the shiny map page), and icon-only arrows
 * inside two sheets. They differed in glyph, height and colour, so "go back"
 * looked like six different actions. This is 44px, ink-label, a ChevronLeft
 * and a word — one style, whichever element holds it.
 *
 * `href` renders a link; `onClick` renders a button. Callers that navigate
 * pass an href; callers that close or step within a sheet pass a handler.
 */
type BackLinkProps = {
  /** Renders an <a> when present; otherwise an <button> for onClick. */
  href?: string;
  /** Renders a <button> when given without an href. */
  onClick?: () => void;
  /** The visible word, always required — an unlabelled arrow is a guess. */
  label: React.ReactNode;
  className?: string;
};

function BackLink({ href, onClick, label, className }: BackLinkProps) {
  const shared = cn(
    'inline-flex min-h-11 items-center gap-1 rounded-md lg:rounded-lg pl-1 pr-2 text-label font-semibold text-ink-label transition-colors motion-reduce:transition-none hover:text-ink-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-bright [&_svg]:size-4 [&_svg]:shrink-0',
    className
  );
  const children = (
    <>
      <ChevronLeft aria-hidden="true" />
      {label}
    </>
  );
  return href ? (
    <a data-slot="back-link" href={href} className={shared}>
      {children}
    </a>
  ) : (
    <button data-slot="back-link" type="button" onClick={onClick} className={shared}>
      {children}
    </button>
  );
}

export { BackLink };
