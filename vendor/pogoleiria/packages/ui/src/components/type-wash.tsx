import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * A Pokémon's art on a glow of its type's colour: the Holofote tile.
 *
 * `wash` is an RGB triplet ("122 199 76"); @pogoleiria/pokemon's washFor()
 * gives one for a species, Shadow or a neutral item. The size and radius are
 * the caller's, since a 52px list tile and a 120px profile tile want
 * different corners. Decorative: the name beside it carries the meaning.
 *
 * `breakout` lets the art stand out of the tile's top, a size larger than
 * the tile, as a map pin's art stands out of its disc and a popup's out of
 * its card (.wash-tile--out in tokens.css): one silhouette from the map to
 * the list (owner, 2026-10-11).
 */
function TypeWash({ wash, breakout = false, className, style, ...props }: React.ComponentProps<'span'> & { wash: string; breakout?: boolean }) {
  return (
    <span
      data-slot="type-wash"
      aria-hidden="true"
      className={cn('wash-tile inline-grid shrink-0 place-items-center rounded-2xl', breakout && 'wash-tile--out', className)}
      style={{ ...style, '--wash': wash } as React.CSSProperties}
      {...props}
    />
  );
}

export { TypeWash };
