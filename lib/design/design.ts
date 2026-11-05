import { readVendor } from '../source'
import { findBullets, inlineText, leadingStrong, parseMarkdown, type Block, type Inline } from './markdown'
import { parseTokens, type TokenSet } from './tokens'

/**
 * DESIGN.md, parsed once per build. Pages render its blocks; components cite
 * the bullets that govern them. No rule text is copied into a component.
 */

let cachedBlocks: Block[] | null = null
let cachedTokens: TokenSet | null = null

export function designBlocks(): Block[] {
  if (!cachedBlocks) cachedBlocks = parseMarkdown(readVendor('DESIGN.md'))
  return cachedBlocks
}

/** The vendored tokens.css, parsed once. */
export function designTokens(): TokenSet {
  if (!cachedTokens) cachedTokens = parseTokens(readVendor('packages/ui/src/tokens.css'))
  return cachedTokens
}

/** The DESIGN.md rule that states a token's meaning, if one does. */
export function tokenMeaning(name: string): { lead: string; full: Inline[] } | null {
  const queries = tokenRuleQueries(name)
  if (queries.length === 0) return null
  const rules = designRules(queries, 2)
  if (rules.length === 0) return null
  const full = rules[0]
  const strong = leadingStrong(full)
  const text = inlineText(full).trim()
  const firstSentence = text.split(/(?<=[.!?])\s/)[0] ?? text
  const lead = strong ?? (firstSentence.length > 160 ? `${firstSentence.slice(0, 157).trimEnd()}…` : firstSentence)
  return { lead, full }
}

/** Bullets whose text mentions any query, deduplicated, in document order. */
export function designRules(queries: string[], limit = 3): Inline[][] {
  const seen = new Set<string>()
  const matches: Inline[][] = []
  for (const bullet of findBullets(designBlocks(), queries)) {
    const key = inlineText(bullet)
    if (seen.has(key)) continue
    seen.add(key)
    matches.push(bullet)
    if (matches.length >= limit) break
  }
  return matches
}

/**
 * The DESIGN.md queries behind a token's stated meaning. Primitive values have
 * no meaning to state; the roles and the loud aliases do.
 */
export function tokenRuleQueries(name: string): string[] {
  const key = name.replace(/^--/, '')

  if (/^(color-)?ember(-deep|-bright)?$|^brand-\d+$/.test(key)) return ['Ember means what you touch']
  if (/^(color-)?gold(-dim)?$|^signal-\d+$|^color-tool-home$/.test(key)) return ['Gold means a reward']
  if (/^(color-)?urgent(-500)?$/.test(key)) return ['Urgent means it runs out soon']
  if (/^(color-)?success(-400)?$/.test(key)) return ['`--success` is a semantic role']
  if (/^(color-)?discord(-deep|-bright)?$/.test(key)) return ['Discord purple opens Discord']
  if (/^color-tool-(map|quests|pokedex)$/.test(key)) return ['Each tool has an accent']
  if (/^(card|popover|primary|secondary|muted|accent|destructive)-foreground$/.test(key)) return []
  if (/^primary$/.test(key)) return ['Use `primary` for actions', 'Ember means what you touch']
  if (/^(accent|accent-foreground)$/.test(key)) return ['`accent` for attention/progress', 'Gold means a reward']
  if (/^(destructive|destructive-foreground|danger-500)$/.test(key)) return ['destructive` for irreversible']
  if (/^(background|card|popover|surface-.*)$/.test(key)) return ['separate surfaces with light']
  if (/^(foreground|ink-.*|muted-foreground)$/.test(key)) return ['Use `text-foreground`', 'supporting copy']
  if (/^(border|hairline.*|input|control-border)$/.test(key)) return ['separate surfaces with light', 'Search fields']
  if (/^(ring)$/.test(key)) return ['One focus treatment']
  if (/^(muted|secondary|secondary-foreground)$/.test(key)) return ['Use semantic roles first']
  if (/^(card-foreground|popover-foreground)$/.test(key)) return ['Use `text-foreground`']
  return []
}

/** A paragraph (not a bullet) whose text mentions a phrase, for rule fallbacks. */
export function designParagraph(needle: string): Inline[] | null {
  const wanted = needle.toLowerCase()
  for (const block of designBlocks()) {
    if (block.type !== 'paragraph') continue
    if (inlineText(block.content).toLowerCase().includes(wanted)) return block.content
  }
  return null
}

/** A vendored file's source, for the read-only panels. */
export function componentSource(path: string): string {
  return readVendor(path)
}
