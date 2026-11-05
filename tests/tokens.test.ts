import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { contrastOn } from '../lib/design/colour'
import {
  GEOMETRY_GROUPS,
  LAYER_META,
  geometryGroup,
  pageForToken,
  parseTokens,
  tokensForPage,
} from '../lib/design/tokens'

const css = readFileSync(join(process.cwd(), 'vendor/pogoleiria/packages/ui/src/tokens.css'), 'utf8')
const tokens = parseTokens(css)

describe('tokens.css reader', () => {
  it('reads every layer of the file', () => {
    expect(tokens.tokens.length).toBeGreaterThan(90)
    expect(tokens.byName.get('tone-950')?.layer).toBe('primitive')
    expect(tokens.byName.get('background')?.layer).toBe('semantic')
    expect(tokens.byName.get('color-ember')?.layer).toBe('alias')
    expect(tokens.byName.get('radius-step-lg')?.layer).toBe('layout')
    expect(tokens.byName.get('segmented-angle')?.layer).toBe('component')
  })

  it('resolves var() chains to the primitive value', () => {
    expect(tokens.byName.get('background')?.declared).toBe('var(--tone-950)')
    expect(tokens.byName.get('background')?.resolved).toBe('oklch(0.105 0.022 258)')
    expect(tokens.byName.get('color-ember')?.resolved).toBe('oklch(0.52 0.17 28)')
    expect(tokens.byName.get('color-tool-home')?.resolved).toBe('oklch(0.86 0.13 88)')
  })

  it('leaves no var() unresolved', () => {
    const unresolved = tokens.tokens.filter((token) => token.resolved.includes('var('))
    expect(unresolved).toEqual([])
  })

  it('computes the brief’s two spot checks', () => {
    expect(tokens.byName.get('tone-950')?.color?.hex).toBe('#01040A')
    const background = tokens.color('background')!
    const urgent = tokens.color('urgent-500')!
    expect(contrastOn(urgent, background.rgb)).toBeCloseTo(8.82, 2)
    expect(contrastOn(urgent, tokens.color('card')!.rgb)).toBeCloseTo(8.01, 2)
  })

  it('classifies every declaration into exactly one page', () => {
    const colour = tokensForPage(tokens, 'colour')
    const geometry = tokensForPage(tokens, 'geometry')
    expect(colour.length + geometry.length).toBe(tokens.tokens.length)
    expect(colour.every((token) => token.color !== null)).toBe(true)
    expect(geometry.every((token) => token.color === null)).toBe(true)
    const pages = new Set(tokens.tokens.map(pageForToken))
    expect([...pages].sort()).toEqual(['colour', 'geometry'])
  })

  it('gives every non-colour declaration a geometry group', () => {
    const ids = new Set(GEOMETRY_GROUPS.map((group) => group.id))
    for (const token of tokensForPage(tokens, 'geometry')) {
      expect(ids.has(geometryGroup(token)), `${token.name} has no group`).toBe(true)
    }
  })

  it('has metadata for every layer', () => {
    for (const token of tokens.tokens) {
      expect(LAYER_META[token.layer].label.length).toBeGreaterThan(0)
    }
  })

  it('keeps the component-scoped values from the segmented control', () => {
    expect(tokens.byName.get('segmented-angle')?.resolved).toBe('8deg')
    expect(tokens.byName.get('segmented-padding')?.resolved).toBe('4px')
    expect(tokens.byName.get('segmented-padding')?.variants.length).toBeGreaterThan(0)
    expect(tokens.byName.get('page-top')?.resolved).toContain('safe-area-inset-top')
  })
})
