import { describe, expect, it } from 'vitest'

import { findBullets, inlineText, leadingStrong, parseInline, parseMarkdown, sections, slugify } from '../lib/design/markdown'

const DOC = `# Design system

Enforceable rules here.

## Direction

The visual language is dark, **high-contrast**, and precise.

## Usage rules

- Keep interactive targets at least 44px (\`--control-min\`).
- **\`--success\` is a semantic role**, from the private \`--success-400\`.
- A section where *everything* is expiring says so.
- [DESIGN.md](DESIGN.md) is the source.

## Extension rules

New components belong in \`packages/ui/src/components\`.
`

describe('DESIGN.md parser', () => {
  const blocks = parseMarkdown(DOC)

  it('splits headings, paragraphs and lists', () => {
    expect(blocks[0]).toMatchObject({ type: 'heading', level: 1, id: 'design-system' })
    expect(blocks.some((block) => block.type === 'paragraph')).toBe(true)
    expect(blocks.filter((block) => block.type === 'list')).toHaveLength(1)
  })

  it('parses bold, inline code, italics and links', () => {
    const direction = blocks.find((block) => block.type === 'heading' && block.id === 'direction')
    expect(direction).toBeDefined()
    const paragraph = blocks.find((block) => block.type === 'paragraph' && inlineText(block.content).includes('high-contrast'))
    expect(paragraph && paragraph.type === 'paragraph' ? paragraph.content.some((node) => node.type === 'strong') : false).toBe(true)

    const inline = parseInline('See `--urgent` and *now* and [the rules](DESIGN.md#usage-rules).')
    expect(inlineText(inline)).toBe('See --urgent and now and the rules.')
    expect(inline.some((node) => node.type === 'code')).toBe(true)
    expect(inline.some((node) => node.type === 'em')).toBe(true)
    expect(inline.some((node) => node.type === 'link')).toBe(true)
  })

  it('finds the bullet that governs a token, and its leading rule name', () => {
    const bullets = findBullets(blocks, ['`--success` is a semantic role'])
    expect(bullets).toHaveLength(1)
    expect(leadingStrong(bullets[0])).toBe('--success is a semantic role')
  })

  it('finds bullets by an ordinary substring', () => {
    expect(findBullets(blocks, ['interactive targets'])).toHaveLength(1)
    expect(findBullets(blocks, ['nothing here'])).toHaveLength(0)
  })

  it('splits a document into sections', () => {
    const result = sections(blocks)
    expect(result.map((section) => inlineText(section.heading.content))).toEqual([
      'Design system',
      'Direction',
      'Usage rules',
      'Extension rules',
    ])
  })

  it('slugifies headings', () => {
    expect(slugify('Public contract')).toBe('public-contract')
    expect(slugify('`--success` is a role')).toBe('success-is-a-role')
  })
})

describe('DESIGN.md query matching', () => {
  it('matches a typographic apostrophe in the source against a straight one in the query', () => {
    const blocks = parseMarkdown("- A tool’s controls live in its dock.\n\n- Owner's rule.\n")
    expect(findBullets(blocks, ["A tool's controls"])).toHaveLength(1)
    expect(findBullets(blocks, ["Owner's rule"])).toHaveLength(1)
  })

  it('matches a curly query against a straight source apostrophe', () => {
    const blocks = parseMarkdown("- The owner's rule.\n")
    expect(findBullets(blocks, ['The owner’s rule'])).toHaveLength(1)
  })
})
