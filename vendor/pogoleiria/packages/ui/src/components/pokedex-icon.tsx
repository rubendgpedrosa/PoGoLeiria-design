import * as React from 'react';

/**
 * A Pokédex, for the tool of that name: the switcher's item, the side menu's
 * row, the dock's way back to it. It was lucide's open book, which says
 * "reading" and nothing of Pokémon (owner, 2026-10-11).
 *
 * Lucide has none, so this is drawn to sit among lucide's: the 24px grid, a
 * 2px round stroke in the text colour, no fill. The device closed, as the
 * games show it: the lens top left, an indicator light, the stepped seam across
 * the lid, and a slot under it. Few marks on purpose: it is drawn at 18px.
 */
function PokedexIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      data-icon="pokedex"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="9" cy="7.5" r="2" />
      <path d="M15.5 7.5h.01" />
      <path d="M4 13h5l2-2h9" />
      <path d="M9 17.5h6" />
    </svg>
  );
}

export { PokedexIcon };
