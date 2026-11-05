import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionLabel } from '../src/components/section-label'

describe('SectionLabel', () => {
  it('defaults to the ambient tracked-uppercase label', () => {
    render(<SectionLabel>Contexto técnico</SectionLabel>)
    const label = screen.getByText('Contexto técnico')
    expect(label).toHaveAttribute('data-slot', 'section-label')
    expect(label).toHaveClass('text-micro')
    expect(label).toHaveClass('font-bold')
    expect(label).toHaveClass('uppercase')
    expect(label).toHaveClass('tracking-[0.15em]')
    expect(label).toHaveClass('text-ink-subtle')
  })

  it('renders only the label, with no wrapper, when there is no count', () => {
    const { container } = render(<SectionLabel>Geração I</SectionLabel>)
    const label = screen.getByText('Geração I')
    expect(label.parentElement).toBe(container)
    expect(container.querySelector('div')).toBeNull()
  })

  it('shows the count beside the label in the display face when one is given', () => {
    const { container } = render(<SectionLabel count={12}>Quests disponíveis</SectionLabel>)
    expect(screen.getByText('12')).toHaveClass('font-display')
    expect(container.querySelector('div.flex')).not.toBeNull()
  })

  it('can speak at the live level in the hub display face', () => {
    render(<SectionLabel tone="live">Raids ativas</SectionLabel>)
    const label = screen.getByText('Raids ativas')
    expect(label).toHaveClass('font-display')
    expect(label).toHaveClass('text-figure')
    expect(label).toHaveClass('text-ink-bright')
  })
})
