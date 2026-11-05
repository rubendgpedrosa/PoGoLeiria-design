import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TypeWash } from '../src';

describe('TypeWash', () => {
  it('sets the wash triplet the glow reads, and stays out of the accessibility tree', () => {
    const { container } = render(<TypeWash wash="122 199 76" className="size-12"><img alt="" src="x.png" /></TypeWash>);
    const tile = container.querySelector('[data-slot="type-wash"]') as HTMLElement;
    expect(tile.style.getPropertyValue('--wash')).toBe('122 199 76');
    expect(tile).toHaveClass('wash-tile', 'size-12');
    expect(tile).toHaveAttribute('aria-hidden', 'true');
  });

  it('lets the art stand out of the tile when asked, as a map pin\'s does', () => {
    const { container } = render(<TypeWash wash="122 199 76" breakout><img alt="" src="x.png" /></TypeWash>);
    expect(container.querySelector('[data-slot="type-wash"]')).toHaveClass('wash-tile--out');
    const { container: plain } = render(<TypeWash wash="122 199 76"><img alt="" src="x.png" /></TypeWash>);
    expect(plain.querySelector('[data-slot="type-wash"]')).not.toHaveClass('wash-tile--out');
  });
});
