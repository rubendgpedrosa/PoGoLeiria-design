import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from '../src/components/segmented-control';
import { Tabs } from '../src/components/tabs';
import { PillTabsList, PillTabsTrigger } from '../src/components/tab-pill';

describe('SegmentedControl', () => {
  it('preserves navigation links and current-page semantics without a wrapper', () => {
    const { container } = render(<SegmentedControl asChild columns={2}>
      <nav aria-label="Sections"><a href="/pokedex" aria-current="page">Pokédex</a><a href="/pokedex/procurar">Comunidade</a></nav>
    </SegmentedControl>);
    expect(container.firstElementChild).toBe(screen.getByRole('navigation', { name: 'Sections' }));
    expect(screen.getByRole('link', { name: 'Pokédex' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Comunidade' })).toHaveAttribute('href', '/pokedex/procurar');
  });

  it('keeps independent toggle buttons independent, including disabled ones', async () => {
    const toggle = vi.fn();
    render(<SegmentedControl aria-label="Predictions">
      <button aria-pressed="true" onClick={toggle}>Shinies</button>
      <button aria-pressed="true" disabled onClick={toggle}>Backgrounds</button>
    </SegmentedControl>);
    expect(screen.getByRole('group', { name: 'Predictions' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Shinies' }));
    await userEvent.click(screen.getByRole('button', { name: 'Backgrounds' }));
    expect(toggle).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button', { pressed: true })).toHaveLength(2);
  });

  it('preserves Radix arrow-key navigation and automatic activation', async () => {
    render(<Tabs defaultValue="quests"><PillTabsList cols={2}>
      <PillTabsTrigger value="quests">Quests</PillTabsTrigger>
      <PillTabsTrigger value="map">Map</PillTabsTrigger>
    </PillTabsList></Tabs>);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Quests' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Map' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Map' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe("the divider beside the chosen segment", () => {
  it("is not drawn: a grey line down the red fill's slanted edge read as an off-colour border", () => {
    const css = readFileSync(resolve(__dirname, "../src/tokens.css"), "utf8")
    const chosen = String.raw`.segmented-control > :is([aria-current="page"], [aria-pressed="true"], [data-state="active"])`
    expect(css).toContain(`${chosen}::after,\n${chosen} + *::after {\n  opacity: 0;`)
  })
})

