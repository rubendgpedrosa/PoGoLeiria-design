import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dock, DockArea, DockButton, DockSearch, DockSeparator } from '../src/components/dock';

describe('Dock', () => {
  it('is a toolbar of 44px targets, phones only', () => {
    render(
      <DockArea>
        <Dock aria-label="Quests">
          <DockSearch value="" onChange={() => {}} placeholder="Pesquisar" ariaLabel="Pesquisar quests" clearLabel="Limpar" />
          <DockSeparator />
          <DockButton aria-label="Filtros">f</DockButton>
          <DockButton asChild aria-label="Comunidade"><a href="/pokedex/procurar">c</a></DockButton>
        </Dock>
      </DockArea>,
    );
    const dock = screen.getByRole('toolbar', { name: 'Quests' });
    expect(dock.parentElement).toHaveClass('lg:hidden', 'pointer-events-none');
    expect(dock).toHaveClass('pointer-events-auto');
    expect(screen.getByRole('button', { name: 'Filtros' })).toHaveClass('size-11');
    expect(screen.getByRole('button', { name: 'Filtros' })).toHaveAttribute('type', 'button');
    // A link keeps being a link.
    expect(screen.getByRole('link', { name: 'Comunidade' })).toHaveAttribute('href', '/pokedex/procurar');
    expect(screen.queryByRole('button', { name: 'Limpar' })).toBeNull();
  });

  it('searches as you type and clears with one tap', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<DockSearch value="" onChange={onChange} placeholder="Pesquisar" ariaLabel="Pesquisar quests" clearLabel="Limpar" />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Pesquisar quests' }), 'm');
    expect(onChange).toHaveBeenCalledWith('m');
    rerender(<DockSearch value="murkrow" onChange={onChange} placeholder="Pesquisar" ariaLabel="Pesquisar quests" clearLabel="Limpar" />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpar' }));
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(screen.getByRole('searchbox', { name: 'Pesquisar quests' })).toHaveFocus();
  });

  it('marks a pressed button in ember and a gold one in gold', () => {
    render(<><DockButton aria-label="a" active>a</DockButton><DockButton aria-label="b" tone="gold">b</DockButton></>);
    expect(screen.getByRole('button', { name: 'a' })).toHaveClass('bg-ember');
    expect(screen.getByRole('button', { name: 'b' })).toHaveClass('text-gold');
  });
});
