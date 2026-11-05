import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PokedexIcon, POGO_ROUTES, POGO_TOOLS } from '../src';

describe('PokedexIcon', () => {
  it('is drawn as the lucide icons beside it are: the 24px grid, a 2px round stroke in the text colour, and out of the accessibility tree', () => {
    const { container } = render(<PokedexIcon className="size-5" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('size-5');
  });

  it('is what the switcher shows for the Pokédex, not a book', () => {
    for (const tools of [POGO_TOOLS, POGO_ROUTES]) {
      const { container } = render(<>{tools.find((tool) => tool.id === 'pokedex')!.icon}</>);
      expect(container.querySelector('svg')).toHaveAttribute('data-icon', 'pokedex');
    }
  });
});
