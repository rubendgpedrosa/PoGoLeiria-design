import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../src/components/button'
import { Badge } from '../src/components/badge'
import { Progress } from '../src/components/progress'
import { EmptyState } from '../src/components/empty-state'
import { AppShell, AppShellMobile, AppShellDesktop } from '../src/components/app-shell'
import { cn } from '../src/lib/utils'

describe('cn', () => {
  it('lets a later utility win over an earlier one of the same kind', () => {
    // Every component leans on this to make its className prop an override.
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('bg-surface-sunken', 'bg-surface-raised')).toBe('bg-surface-raised')
  })

  it('keeps utilities that do not conflict', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })
})

describe('Button', () => {
  it('renders a button by default and the child element with asChild', () => {
    const { rerender } = render(<Button>Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument()
    rerender(
      <Button asChild>
        <a href="/somewhere">Go</a>
      </Button>
    )
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('takes a className override', () => {
    render(<Button className="h-20">Go</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-20')
    expect(screen.getByRole('button')).not.toHaveClass('h-9')
  })
})

describe('Badge', () => {
  it('renders the child element with asChild, as the reward chips rely on', () => {
    render(
      <Badge asChild>
        <button type="button">Stardust</button>
      </Badge>
    )
    expect(screen.getByRole('button', { name: 'Stardust' })).toBeInTheDocument()
  })
})

describe('Progress', () => {
  it.each([0, 40, 100])('exposes determinate progress %s to assistive technology', (value) => {
    render(<Progress value={value} aria-label="Collection progress" />)
    const progress = screen.getByRole('progressbar', { name: 'Collection progress' })
    expect(progress).toHaveAttribute('aria-valuenow', String(value))
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    expect(progress).toHaveAttribute('data-state', value === 100 ? 'complete' : 'loading')
  })

  it('translates the indicator by the remaining percentage', () => {
    const { container } = render(<Progress value={40} />)
    const indicator = container.querySelector<HTMLElement>('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-60%)' })
  })

  it('treats a missing value as empty rather than crashing', () => {
    const { container } = render(<Progress />)
    const indicator = container.querySelector<HTMLElement>('[data-slot="progress-indicator"]')
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })
})

describe('EmptyState', () => {
  it('keeps the title no smaller than its description', () => {
    // The heading was 11px above a 13px sentence, so the list's own answer
    // read larger than the question it was answering.
    render(<EmptyState title="Sem resultados" description="Ajusta os filtros." />)
    expect(screen.getByText('Sem resultados')).toHaveClass('text-body')
    expect(screen.getByText('Ajusta os filtros.')).toHaveClass('text-label')
  })
})

describe('AppShell', () => {
  it('is the main landmark and carries no decorative layers', () => {
    const { container } = render(
      <AppShell>
        <AppShellMobile>phone</AppShellMobile>
        <AppShellDesktop>desktop</AppShellDesktop>
      </AppShell>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
    // None left. It painted a hexagon lattice at three percent of the page's
    // own ink — a four percent luminance delta, which nobody ever saw — and
    // before that a 128px bottom fade for an in-app nav these apps no longer
    // have. The shell is the landmark and nothing else.
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
  })

  it('renders both layout columns', () => {
    render(
      <AppShell>
        <AppShellMobile>phone</AppShellMobile>
        <AppShellDesktop>desktop</AppShellDesktop>
      </AppShell>
    )
    expect(screen.getByText('phone')).toBeInTheDocument()
    expect(screen.getByText('desktop')).toBeInTheDocument()
  })
})

describe('AppShellMobile padding', () => {
  it('pads the top, and leaves the bottom to whatever is below it', () => {
    // The bottom was 4.75rem, reserving room for a floating nav inside the
    // app. These apps are framed now and the shell's bar is docked outside
    // that frame, so the reservation was just 76px of dead space against 12px
    // at the top.
    const { container } = render(<AppShellMobile />)
    const cls = container.querySelector('[data-slot="app-shell-mobile"]')!.className
    expect(cls).toContain('pt-[max(0.75rem,env(safe-area-inset-top))]')
    // Bottom is the bare inset: 0 inside the frame, where the shell owns the
    // safe area and a list should reach the docked bar; the home indicator
    // when the app is opened directly on its own subdomain.
    expect(cls).toContain('pb-[env(safe-area-inset-bottom)]')
    expect(cls).not.toContain('4.75rem')
  })
})
