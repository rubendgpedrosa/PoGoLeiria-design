import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountDot } from '../src/components/count-dot'

describe('CountDot', () => {
  it('shows the count and keeps its meaning in an accessible label', () => {
    render(<CountDot count={2} label="2 pedidos por aprovar" />)
    const dot = screen.getByText('2').parentElement!
    expect(dot).toHaveAttribute('data-slot', 'count-dot')
    expect(dot).toHaveTextContent('2 pedidos por aprovar')
  })

  it('is neutral, never gold', () => {
    render(<CountDot count={1} label="1 pedido" />)
    const dot = screen.getByText('1').parentElement!
    expect(dot).toHaveClass('bg-ink-bright')
    expect(dot).toHaveClass('text-surface-sunken')
    expect(dot.className).not.toContain('gold')
  })

  it('caps long counts at 99+', () => {
    render(<CountDot count={120} label="120 pedidos" />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})
