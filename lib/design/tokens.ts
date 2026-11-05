import { formatOklch, parseColor, type ColorValue } from './colour'

/**
 * A reader for `packages/ui/src/tokens.css`.
 *
 * The Colour page must not carry a palette. It parses the vendored token file
 * at build time, resolves each `var()` chain the way the browser would, and
 * reports every declared custom property — including the component-scoped
 * ones inside tokens.css rules, which are easy to forget and are therefore the
 * first thing the coverage test checks.
 */

export type TokenLayer = 'primitive' | 'semantic' | 'alias' | 'layout' | 'component'

export type Token = {
  /** Custom property name without the leading `--`. */
  name: string
  /** The value exactly as declared. */
  declared: string
  /** The declaration after resolving every `var()` (fallbacks included). */
  resolved: string
  layer: TokenLayer
  /** The rule the declaration sits in (`:root`, `@theme`, `.segmented-control`, …). */
  selector: string
  /** Parsed colour, or null when the value is not a bare colour. */
  color: ColorValue | null
  /** `oklch(...)` for a colour, in the form a designer can paste. */
  oklch: string | null
  /** Other declarations of the same name (a base value plus its variants). */
  variants: { selector: string; declared: string }[]
}

export type TokenSet = {
  tokens: Token[]
  byName: Map<string, Token>
  /** Resolve a token's value, following `var()` chains. */
  resolve: (name: string) => string | null
  /** Resolve and parse a token as a colour. */
  color: (name: string) => ColorValue | null
}

export const LAYER_ORDER: TokenLayer[] = ['primitive', 'semantic', 'alias', 'layout', 'component']

export const LAYER_META: Record<TokenLayer, { label: string; description: string }> = {
  primitive: {
    label: 'Primitive palette',
    description: 'Private tone and brand values. Not for components: a solution that names a tone has skipped a role.',
  },
  semantic: {
    label: 'Semantic roles',
    description: 'The public contract for app surfaces. These names carry meaning, not a colour.',
  },
  alias: {
    label: 'Tailwind aliases',
    description: 'Utility-friendly names registered for existing consumers. They resolve to primitive values too.',
  },
  layout: {
    label: 'Layout and interaction',
    description: 'Geometry, rhythm and motion primitives declared alongside the palette.',
  },
  component: {
    label: 'Component-scoped',
    description: 'Custom properties declared inside component rules in tokens.css. They are private, but part of the file.',
  },
}

const SEMANTIC = new Set([
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'urgent',
  'border',
  'input',
  'ring',
])

const PRIMITIVE = /^--(tone|brand|signal|danger|success|urgent)-\d+$/
const LAYOUT = /^--(radius|space|motion)(-|$)|^--control-min$|^--shadow-float$/

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** Split on commas that are not inside parentheses. */
function splitTopLevel(input: string, separator = ','): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of input) {
    if (char === '(') depth += 1
    if (char === ')') depth -= 1
    if (char === separator && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  parts.push(current)
  return parts
}

/**
 * Replace `var(--name[, fallback])`, including a fallback that itself contains
 * a function call (the font stack does). Unresolvable references use their
 * fallback, or vanish, exactly as CSS would at computed-value time.
 */
function resolveVars(input: string, byName: Map<string, Token>): string {
  let value = input
  for (let guard = 0; guard < 40; guard += 1) {
    const start = value.indexOf('var(')
    if (start === -1) break

    let depth = 1
    let end = -1
    for (let index = start + 4; index < value.length; index += 1) {
      if (value[index] === '(') depth += 1
      if (value[index] === ')') {
        depth -= 1
        if (depth === 0) {
          end = index
          break
        }
      }
    }
    if (end === -1) break

    const inner = value.slice(start + 4, end)
    const [rawName, ...rest] = splitTopLevel(inner)
    const name = rawName.trim()
    const fallback = rest.join(',').trim()
    const referenced = byName.get(name.replace(/^--/, ''))
    const replacement = referenced ? referenced.declared : fallback
    value = value.slice(0, start) + replacement + value.slice(end + 1)
  }
  return value.trim()
}

function classify(name: string, selector: string): TokenLayer {
  if (selector.startsWith('@theme')) return 'alias'
  if (PRIMITIVE.test(`--${name}`)) return 'primitive'
  if (SEMANTIC.has(name)) return 'semantic'
  if (LAYOUT.test(`--${name}`)) return 'layout'
  return 'component'
}

export function parseTokens(css: string): TokenSet {
  const clean = stripComments(css)
  const raw: { name: string; declared: string; selector: string }[] = []

  // Innermost CSS rules. tokens.css nests at most one level (a rule inside
  // @media or @layer), so the selector captured here is the rule that owns the
  // declarations, not the at-rule around it.
  const blockPattern = /([^{}]*)\{([^{}]*)\}/g
  for (let match = blockPattern.exec(clean); match !== null; match = blockPattern.exec(clean)) {
    const selector = match[1].trim()
    const body = match[2]
    const declarationPattern = /(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]+);/g
    for (let declaration = declarationPattern.exec(body); declaration !== null; declaration = declarationPattern.exec(body)) {
      raw.push({ name: declaration[1].replace(/^--/, ''), declared: declaration[2].trim(), selector })
    }
  }

  const byName = new Map<string, Token>()
  const tokens: Token[] = []
  // A name can be declared more than once — the segmented control sets a base
  // value and its modifiers override it. Keep the first declaration as the
  // base and record the rest, rather than silently losing them to the map.
  for (const declaration of raw) {
    const existing = byName.get(declaration.name)
    if (existing) {
      existing.variants.push({ selector: declaration.selector, declared: declaration.declared })
      continue
    }
    const token: Token = {
      name: declaration.name,
      declared: declaration.declared,
      resolved: '',
      layer: classify(declaration.name, declaration.selector),
      selector: declaration.selector,
      color: null,
      oklch: null,
      variants: [],
    }
    byName.set(declaration.name, token)
    tokens.push(token)
  }
  for (const token of tokens) {
    token.resolved = resolveVars(token.declared, byName)
    token.color = parseColor(token.resolved)
    token.oklch = token.color?.oklch ? formatOklch(token.color.oklch) : null
  }

  return {
    tokens,
    byName,
    resolve: (name: string) => byName.get(name.replace(/^--/, ''))?.resolved ?? null,
    color: (name: string) => byName.get(name.replace(/^--/, ''))?.color ?? null,
  }
}

export type TokenPage = 'colour' | 'geometry'

/** Colour tokens belong to the Colour page; every other declaration to Geometry. */
export function pageForToken(token: Token): TokenPage {
  return token.color ? 'colour' : 'geometry'
}

export function tokensForPage(set: TokenSet, page: TokenPage): Token[] {
  return set.tokens.filter((token) => pageForToken(token) === page)
}

export function tokensByLayer(tokens: Token[], layer: TokenLayer): Token[] {
  return tokens.filter((token) => token.layer === layer)
}

export type ColourSection = 'primitive' | 'semantic' | 'alias-semantic' | 'alias-surface' | 'alias-brand' | 'alias-other' | 'component'

export const COLOUR_SECTIONS: { id: ColourSection; label: string; description: string }[] = [
  {
    id: 'semantic',
    label: 'Semantic roles',
    description:
      'The public contract: background, foreground, card, muted, primary, accent, destructive, border, input and ring, plus the roles success and urgent. Use these first.',
  },
  {
    id: 'primitive',
    label: 'Primitive palette',
    description:
      'The private values the roles resolve to. They are declared here because hiding them would make the theme opaque, not because a component may name one.',
  },
  {
    id: 'alias-semantic',
    label: 'Semantic Tailwind aliases',
    description: 'The role names again, registered for utility classes. Two names, one value: the alias is the Tailwind entry point.',
  },
  {
    id: 'alias-surface',
    label: 'Surfaces, hairlines and ink',
    description:
      'The compatibility names the current product language uses for its three surfaces, its hairlines and its ink ramp. Surface names are not a second palette.',
  },
  {
    id: 'alias-brand',
    label: 'Brand and signal aliases',
    description: 'Ember (what you touch), gold (reward and progress only), Discord (opens Discord, nothing else) and each tool’s one accent.',
  },
  {
    id: 'alias-other',
    label: 'Other aliases',
    description: 'Any alias that does not fall into a named family. Nothing is allowed to hide here silently: the coverage test sees it.',
  },
  {
    id: 'component',
    label: 'Component-scoped',
    description: 'Colour-valued custom properties declared inside tokens.css component rules.',
  },
]

const SEMANTIC_ALIAS = new Set(
  [...SEMANTIC].map((name) => `color-${name}`),
)

export function colourSection(token: Token): ColourSection {
  if (token.layer === 'semantic') return 'semantic'
  if (token.layer === 'primitive') return 'primitive'
  if (token.layer === 'component') return 'component'
  if (SEMANTIC_ALIAS.has(token.name)) return 'alias-semantic'
  if (/^--color-(surface|hairline|ink|control-border)/.test(`--${token.name}`)) return 'alias-surface'
  if (/^--color-(gold|ember|discord|tool)/.test(`--${token.name}`)) return 'alias-brand'
  return 'alias-other'
}

export type GeometryGroup =
  | 'radius'
  | 'space'
  | 'control'
  | 'motion'
  | 'elevation'
  | 'font'
  | 'type'
  | 'gradient'
  | 'component'
  | 'other'

export const GEOMETRY_GROUPS: { id: GeometryGroup; label: string }[] = [
  { id: 'radius', label: 'Radius' },
  { id: 'space', label: 'Spacing' },
  { id: 'control', label: 'Control size' },
  { id: 'motion', label: 'Motion' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'font', label: 'Fonts' },
  { id: 'type', label: 'Type scale' },
  { id: 'gradient', label: 'Gradients' },
  { id: 'component', label: 'Component-scoped' },
  { id: 'other', label: 'Other declarations' },
]

export function geometryGroup(token: Token): GeometryGroup {
  const name = `--${token.name}`
  if (/^--radius/.test(name)) return 'radius'
  if (/^--(space|spacing)/.test(name)) return 'space'
  if (name === '--control-min') return 'control'
  if (/^--(motion|animate)/.test(name)) return 'motion'
  if (name === '--shadow-float') return 'elevation'
  if (/^--font-/.test(name)) return 'font'
  if (/^--text-/.test(name)) return 'type'
  if (/^--background-image-/.test(name)) return 'gradient'
  if (/^--(segmented|page-top)/.test(name)) return 'component'
  return 'other'
}
