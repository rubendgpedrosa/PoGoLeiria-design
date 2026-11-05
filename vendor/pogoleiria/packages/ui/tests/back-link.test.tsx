import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { BackLink } from '../src/components/back-link'

describe('BackLink', () => {
  it('renders a link with a chevron and its label when given an href', () => {
    render(<BackLink href="/pokedex" label="A minha Pokédex" />)
    const link = screen.getByRole('link', { name: 'A minha Pokédex' })
    expect(link).toHaveAttribute('data-slot', 'back-link')
    expect(link).toHaveAttribute('href', '/pokedex')
    expect(link.querySelector('svg')).not.toBeNull()
  })

  it('renders a button that calls onClick', () => {
    const onClick = vi.fn()
    render(<BackLink onClick={onClick} label="Voltar" />)
    const button = screen.getByRole('button', { name: 'Voltar' })
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is one 44px ink-label style either way', () => {
    render(<BackLink href="/" label="Voltar" />)
    const link = screen.getByRole('link', { name: 'Voltar' })
    expect(link).toHaveClass('min-h-11')
    expect(link).toHaveClass('text-ink-label')
  })
})
