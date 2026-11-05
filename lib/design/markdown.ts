/**
 * A deliberately small Markdown reader for DESIGN.md.
 *
 * The site renders the rules from the vendored file instead of copying them
 * into components, so this parser only needs the constructs DESIGN.md uses:
 * headings, paragraphs, bullet lists, fenced code, bold, italics, inline code
 * and links. Returning a block tree (rather than JSX) keeps it unit-testable
 * without a DOM.
 */

export type Inline =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'strong'; children: Inline[] }
  | { type: 'em'; children: Inline[] }
  | { type: 'link'; href: string; children: Inline[] }

export type Block =
  | { type: 'heading'; level: number; id: string; content: Inline[] }
  | { type: 'paragraph'; content: Inline[] }
  | { type: 'list'; ordered: boolean; items: Inline[][] }
  | { type: 'code'; language: string; text: string }

export function inlineText(content: Inline[]): string {
  return content
    .map((node) => {
      if (node.type === 'text' || node.type === 'code') return node.text
      return inlineText(node.children)
    })
    .join('')
}

export function slugify(text: string): string {
  const slug = text
    .replace(/[`*_[\]()]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

export function parseInline(source: string): Inline[] {
  const nodes: Inline[] = []
  let text = ''
  let index = 0

  const flush = () => {
    if (text) {
      nodes.push({ type: 'text', text })
      text = ''
    }
  }

  while (index < source.length) {
    const rest = source.slice(index)

    if (rest.startsWith('**')) {
      const end = source.indexOf('**', index + 2)
      if (end !== -1) {
        flush()
        nodes.push({ type: 'strong', children: parseInline(source.slice(index + 2, end)) })
        index = end + 2
        continue
      }
    }

    if (rest.startsWith('`')) {
      const end = source.indexOf('`', index + 1)
      if (end !== -1) {
        flush()
        nodes.push({ type: 'code', text: source.slice(index + 1, end) })
        index = end + 1
        continue
      }
    }

    if (rest.startsWith('*')) {
      const end = source.indexOf('*', index + 1)
      if (end > index + 1) {
        flush()
        nodes.push({ type: 'em', children: parseInline(source.slice(index + 1, end)) })
        index = end + 1
        continue
      }
    }

    if (rest.startsWith('[')) {
      const close = source.indexOf('](', index)
      if (close !== -1) {
        const hrefEnd = source.indexOf(')', close + 2)
        if (hrefEnd !== -1) {
          flush()
          nodes.push({
            type: 'link',
            href: source.slice(close + 2, hrefEnd),
            children: parseInline(source.slice(index + 1, close)),
          })
          index = hrefEnd + 1
          continue
        }
      }
    }

    text += source[index]
    index += 1
  }

  flush()
  return nodes
}

function heading(level: number, raw: string): Block {
  const content = parseInline(raw.trim())
  return { type: 'heading', level, id: slugify(inlineText(content)), content }
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let code: { language: string; lines: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', content: parseInline(paragraph.join(' ').trim()) })
      paragraph = []
    }
  }
  const flushList = () => {
    if (list) {
      blocks.push({ type: 'list', ordered: list.ordered, items: list.items.map((item) => parseInline(item.trim())) })
      list = null
    }
  }

  for (const line of lines) {
    if (code) {
      if (line.trim().startsWith('```')) {
        blocks.push({ type: 'code', language: code.language, text: code.lines.join('\n') })
        code = null
      } else {
        code.lines.push(line)
      }
      continue
    }

    const fence = /^\s*```(\w*)\s*$/.exec(line)
    if (fence) {
      flushParagraph()
      flushList()
      code = { language: fence[1], lines: [] }
      continue
    }

    if (line.trim() === '') {
      flushParagraph()
      flushList()
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line)
    if (headingMatch) {
      flushParagraph()
      flushList()
      blocks.push(heading(headingMatch[1].length, headingMatch[2]))
      continue
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (bullet || ordered) {
      flushParagraph()
      const isOrdered = Boolean(ordered)
      if (!list || list.ordered !== isOrdered) {
        flushList()
        list = { ordered: isOrdered, items: [] }
      }
      list.items.push((bullet ?? ordered)?.[1] ?? '')
      continue
    }

    if (list) {
      // A wrapped list item continues the previous line.
      if (/^\s{2,}\S/.test(line)) {
        list.items[list.items.length - 1] += ` ${line.trim()}`
        continue
      }
      flushList()
    }

    paragraph.push(line.trim())
  }

  flushParagraph()
  flushList()
  if (code) blocks.push({ type: 'code', language: code.language, text: code.lines.join('\n') })

  return blocks
}

/** All bullet items whose plain text mentions any query, in document order. */
export function findBullets(blocks: Block[], queries: string[]): Inline[][] {
  const matches: Inline[][] = []
  // Queries are written the way DESIGN.md writes them (`--success`), but the
  // parsed text has already lost its inline markers — and DESIGN.md mixes
  // straight and typographic apostrophes. Compare one normal form.
  const normalise = (text: string) =>
    text
      .replace(/[`*_]/g, '')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .toLowerCase()
  const needles = queries.map(normalise)
  for (const block of blocks) {
    if (block.type !== 'list') continue
    for (const item of block.items) {
      const text = normalise(inlineText(item))
      if (needles.some((needle) => text.includes(needle))) matches.push(item)
    }
  }
  return matches
}

/** The first bold run in an inline sequence — DESIGN.md's one-line rule names. */
export function leadingStrong(content: Inline[]): string | null {
  for (const node of content) {
    if (node.type === 'strong') return inlineText(node.children)
    if (node.type === 'em' || node.type === 'link') {
      const nested = leadingStrong(node.children)
      if (nested) return nested
    }
  }
  return null
}

export type Section = { heading: Block & { type: 'heading' }; blocks: Block[] }

/** Split a document at its headings, for the Overview page. */
export function sections(blocks: Block[]): Section[] {
  const result: Section[] = []
  let current: Section | null = null
  for (const block of blocks) {
    if (block.type === 'heading') {
      current = { heading: block, blocks: [] }
      result.push(current)
    } else if (current) {
      current.blocks.push(block)
    }
  }
  return result
}
