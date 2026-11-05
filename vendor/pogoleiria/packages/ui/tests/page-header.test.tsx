import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PageHeader } from '../src';

describe('PageHeader', () => {
  it('sets a string title as the page h1 in the shared 44px row, with the meta line under it', () => {
    render(<PageHeader title="Quests" meta="376 Pokéstops" />);
    const h1 = screen.getByRole('heading', { level: 1, name: 'Quests' });
    expect(h1).toHaveClass('min-h-11', 'text-2xl', 'font-display');
    expect(screen.getByText('376 Pokéstops')).toBeInTheDocument();
  });

  it('keeps the meta line even when empty, so every header is one height', () => {
    const { container } = render(<PageHeader title="Comunidade" />);
    expect(container.querySelector('p.h-4')).not.toBeNull();
  });

  it('can hide optional header art on desktop while keeping a trainer avatar', () => {
    const { rerender } = render(<PageHeader logo={<span>optional art</span>} title="Pokédex" />);
    expect(screen.getByText('optional art').parentElement).toHaveClass('lg:hidden');
    rerender(<PageHeader logo={<span>avatar</span>} logoDesktopHidden={false} title="Rita" />);
    expect(screen.getByText('avatar').parentElement).not.toHaveClass('lg:hidden');
  });
});
