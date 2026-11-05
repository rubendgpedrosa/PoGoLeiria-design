import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchField } from '../src/components/search-field'

const base = {
  placeholder: 'Pesquisar…',
  ariaLabel: 'Pesquisar quests',
  clearLabel: 'Limpar pesquisa',
}

describe('SearchField', () => {
  it('gives both the input and the clear button accessible names', async () => {
    // dex's hand-rolled copy of this had neither: the clear button was an
    // icon-only button with no name at all.
    render(<SearchField {...base} value="dratini" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Pesquisar quests')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpar pesquisa' })).toBeInTheDocument()
  })

  it('only offers the clear button once there is something to clear', () => {
    const { rerender } = render(<SearchField {...base} value="" onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Limpar pesquisa' })).not.toBeInTheDocument()
    rerender(<SearchField {...base} value="d" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Limpar pesquisa' })).toBeInTheDocument()
  })

  it('reports the typed value, not the event', async () => {
    const onChange = vi.fn()
    render(<SearchField {...base} value="" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Pesquisar quests'), 'x')
    expect(onChange).toHaveBeenCalledWith('x')
  })

  it('clears to an empty string', async () => {
    const onChange = vi.fn()
    render(<SearchField {...base} value="dratini" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Limpar pesquisa' }))
    expect(onChange).toHaveBeenCalledWith('')
    expect(screen.getByRole('searchbox', { name: 'Pesquisar quests' })).toHaveFocus()
  })
})

describe('SearchField focus', () => {
  // The shell's global focus rule, read from tokens.css rather than copied, so
  // the assertion follows the stylesheet the apps actually load.
  const tokens = readFileSync(resolve(__dirname, '../src/tokens.css'), 'utf8')
  const focusRule = tokens.match(/^(\[data-slot="app-shell"\][^{]*):focus-visible\s*\{\s*outline:/m)

  it('keeps the shell outline off the field and on the controls around it', () => {
    // The unlayered outline used to land on the bare input too, drawing a
    // second, differently-shaped box inside the field's own frame, and pushed
    // the clear button's ring out through the field's edge.
    expect(focusRule).not.toBeNull()
    render(
      <div data-slot="app-shell">
        <button type="button">Filtros</button>
        <SearchField {...base} value="dratini" onChange={vi.fn()} />
      </div>
    )
    const selector = focusRule![1]
    expect(screen.getByRole('searchbox', { name: 'Pesquisar quests' }).matches(selector)).toBe(false)
    expect(screen.getByRole('button', { name: 'Limpar pesquisa' }).matches(selector)).toBe(false)
    expect(screen.getByRole('button', { name: 'Filtros' }).matches(selector)).toBe(true)
  })

  it('draws its own focus: the frame for the input, an inset ring for clear', () => {
    const { container } = render(<SearchField {...base} value="dratini" onChange={vi.fn()} />)
    const frame = container.querySelector('[data-slot="search-field"]')!
    expect(frame.className).toContain('has-[input:focus-visible]:ring-ember-bright')
    expect(frame.className).not.toContain('focus-within:')
    // The frame carries focus; the borderless inner input suppresses its own
    // outline so the field never draws a second one inside the frame.
    expect(screen.getByRole('searchbox').className).toContain('focus-visible:outline-0')
    expect(screen.getByRole('button', { name: 'Limpar pesquisa' }).className).toContain(
      'focus-visible:ring-inset'
    )
  })
})
