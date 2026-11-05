import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '../src/components/tabs'
import { PillTabsList, PillTabsTrigger } from '../src/components/tab-pill'

function ThreeTabs({ onValueChange = vi.fn() }) {
  return (
    <Tabs value="all" onValueChange={onValueChange}>
      <PillTabsList cols={3}>
        <PillTabsTrigger value="all">Todos</PillTabsTrigger>
        <PillTabsTrigger value="owned">Obtidos</PillTabsTrigger>
        <PillTabsTrigger value="missing">Em falta</PillTabsTrigger>
      </PillTabsList>
    </Tabs>
  )
}

describe('PillTabsList', () => {
  it('keeps decorative joins out of the tablist semantics', () => {
    const { container } = render(<ThreeTabs />)
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
    expect(screen.getByRole('tablist')).toHaveAccessibleName('')
  })

  // trades' five trade categories share this control. The grid class has to be
  // a literal for Tailwind to emit it, so a new count is a real code change and
  // gets a real assertion.
  it('lays five columns out as five', () => {
    const { container } = render(
      <Tabs value="hundo">
        <PillTabsList cols={5}>
          <PillTabsTrigger value="hundo">100%</PillTabsTrigger>
          <PillTabsTrigger value="lucky">Lucky</PillTabsTrigger>
          <PillTabsTrigger value="shiny">Shiny</PillTabsTrigger>
          <PillTabsTrigger value="xxl">XXL</PillTabsTrigger>
          <PillTabsTrigger value="xxs">XXS</PillTabsTrigger>
        </PillTabsList>
      </Tabs>
    )
    expect(screen.getByRole('tablist').className).toContain('grid-cols-5')
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(5)
  })

})

describe('PillTabsTrigger', () => {
  it('carries the active treatment on exactly the selected tab', () => {
    render(<ThreeTabs />)
    expect(screen.getByRole('tab', { name: 'Todos' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Obtidos' })).toHaveAttribute('data-state', 'inactive')
  })

  it('applies one identical class string to every trigger', () => {
    // The whole reason this component exists: five hand-copied versions of this
    // string had already drifted apart, one of them missing a glow layer.
    render(<ThreeTabs />)
    const classes = ['Todos', 'Obtidos', 'Em falta'].map(
      (name) => screen.getByRole('tab', { name }).className
    )
    expect(new Set(classes).size).toBe(1)
    // The active fill is a token, not a hard-coded literal, so re-theming
    // can't leave one state behind. Assert the token, not a hex.
    expect(classes[0]).toContain('data-[state=active]:text-primary-foreground')
  })

  it('reports the selected value', async () => {
    const onValueChange = vi.fn()
    render(<ThreeTabs onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Obtidos' }))
    expect(onValueChange).toHaveBeenCalledWith('owned')
  })
})
