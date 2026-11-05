import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppSwitcher, POGO_TOOLS, POGO_ROUTES } from '../src/components/app-switcher'

function Switcher({ current = 'quests' }) {
  return <AppSwitcher items={POGO_TOOLS} current={current} ariaLabel="Ferramentas" />
}

describe('AppSwitcher', () => {
  it('names the landmark so it can be skipped to', () => {
    render(<Switcher />)
    expect(screen.getByRole('navigation', { name: 'Ferramentas' })).toBeInTheDocument()
  })

  it('links to every tool except the one already open', () => {
    render(<Switcher current="quests" />)
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      'https://pogoleiria.pt'
    )
    expect(screen.getByRole('link', { name: 'Pokédex' })).toHaveAttribute(
      'href',
      'https://pogoleiria.pt/pokedex'
    )
    // The current tool is a label, not a link back to where you already are.
    expect(screen.queryByRole('link', { name: 'Quests' })).not.toBeInTheDocument()
  })

  it('marks the current tool for assistive tech', () => {
    const { container } = render(<Switcher current="pokedex" />)
    const current = container.querySelectorAll('[aria-current="page"]')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent('Pokédex')
  })

  it('moves the marker when a different tool renders it', () => {
    const { container, rerender } = render(<Switcher current="quests" />)
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent('Quests')
    rerender(<Switcher current="map" />)
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent('Mapa')
  })

  it('keeps every tool at the 44px touch floor', () => {
    const { container } = render(<Switcher />)
    const items = container.querySelectorAll('[data-slot="app-switcher-item"]')
    expect(items).toHaveLength(POGO_TOOLS.length)
    for (const item of items) {
      expect(item.className).toContain('min-h-11')
    }
  })

  it('points every tool at a distinct URL', () => {
    // One identity, four tools: the switcher is the only place that says
    // where they live, so a copy-paste slip here would strand a whole app.
    const hrefs = POGO_TOOLS.map((tool) => tool.href)
    expect(new Set(hrefs).size).toBe(POGO_TOOLS.length)
  })

  // No tool has a hostname of its own (the quests and dex subdomains were
  // retired on 2026-10-04): every one lives on the shell's host.
  it('points every tool at the shell', () => {
    for (const tool of POGO_TOOLS) expect(new URL(tool.href).host).toBe('pogoleiria.pt')
  })
})

describe('AppSwitcher — routing inside a shell', () => {
  function Stub({ href, children, ...rest }: React.ComponentProps<'a'>) {
    return (
      <a data-stub-link="true" href={href} {...rest}>
        {children}
      </a>
    )
  }

  it('routes same-origin hrefs through the supplied link component', () => {
    const { container } = render(
      <AppSwitcher
        items={POGO_ROUTES}
        current="quests"
        ariaLabel="Ferramentas"
        linkComponent={Stub}
      />
    )
    // Every non-current tool is an internal path, so all of them go through the router.
    expect(container.querySelectorAll('[data-stub-link="true"]')).toHaveLength(POGO_ROUTES.length - 1)
  })

  it('never routes a cross-origin href through the router', () => {
    // A client-side router cannot soft-navigate across origins, so handing it
    // an absolute URL would break the link rather than speed it up.
    const { container } = render(
      <AppSwitcher
        items={POGO_TOOLS}
        current="quests"
        ariaLabel="Ferramentas"
        linkComponent={Stub}
      />
    )
    expect(container.querySelectorAll('[data-stub-link="true"]')).toHaveLength(0)
    expect(container.querySelectorAll('a')).toHaveLength(POGO_TOOLS.length - 1)
  })

  it('keeps the two tool lists in step', () => {
    // They're separate because one is origins and one is routes; if their ids,
    // order or labels drift, the bar changes shape mid-migration.
    expect(POGO_ROUTES.map((t) => t.id)).toEqual(POGO_TOOLS.map((t) => t.id))
    expect(POGO_ROUTES.map((t) => t.label)).toEqual(POGO_TOOLS.map((t) => t.label))
    expect(POGO_ROUTES.every((t) => t.href.startsWith('/'))).toBe(true)
    // Distinct routes, so no two tools can resolve to the same page.
    expect(new Set(POGO_ROUTES.map((t) => t.href)).size).toBe(POGO_ROUTES.length)
  })
})

describe('AppSwitcher — docked vs floating', () => {
  it('docks by default, taking its own height instead of covering content', () => {
    // Floating it over an embedded application lands on that application's own
    // controls, and the shell can't know where those are.
    const { container } = render(<Switcher />)
    const nav = container.querySelector('[data-slot="app-switcher"]')!
    expect(nav.className).not.toContain('fixed')
    expect(nav.className).toContain('border-t')
  })

  it('still floats when asked', () => {
    const { container } = render(
      <AppSwitcher items={POGO_TOOLS} current="quests" ariaLabel="Ferramentas" floating />
    )
    const nav = container.querySelector('[data-slot="app-switcher"]')!
    expect(nav.className).toContain('fixed')
    expect(nav.className).toContain('shadow-float')
  })

  it('keeps the 44px touch floor either way', () => {
    for (const floating of [true, false]) {
      const { container, unmount } = render(
        <AppSwitcher
          items={POGO_TOOLS}
          current="quests"
          ariaLabel="Ferramentas"
          floating={floating}
        />
      )
      for (const item of container.querySelectorAll('[data-slot="app-switcher-item"]')) {
        expect(item.className).toContain('min-h-11')
      }
      unmount()
    }
  })
})

describe('AppSwitcher — each tool its colour', () => {
  it("colours the current item with its tool's accent", () => {
    const { container } = render(<AppSwitcher items={POGO_TOOLS} current="pokedex" ariaLabel="Ferramentas" />);
    const current = container.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.style.getPropertyValue('--tool')).toBe('var(--color-tool-pokedex)');
  });

  it('shows a count on an item, and says what it counts once', () => {
    const items = POGO_ROUTES.map((item) => item.id === 'pokedex' ? { ...item, badge: { count: 3, label: '3 pedidos por aprovar' } } : item);
    render(<AppSwitcher items={items} current="map" ariaLabel="Ferramentas" />);
    // CountDot carries the badge's meaning now, so the exact name holds the
    // label once: an exact match fails if it were still repeated.
    const pokedex = screen.getByRole('link', { name: '3 pedidos por aprovar Pokédex' });
    expect(pokedex).toHaveTextContent('3');
    expect(pokedex).toHaveAccessibleName('3 pedidos por aprovar Pokédex');
    expect(screen.getByRole('link', { name: 'Quests' })).not.toHaveTextContent(/\d/);
  });

  it('has no badge without one', () => {
    const { container } = render(<Switcher />);
    expect(container.querySelector('[data-slot="count-dot"]')).toBeNull();
  });
});
