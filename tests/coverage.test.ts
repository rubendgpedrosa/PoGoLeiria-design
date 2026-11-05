import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { COMPONENT_DOCS, COMPONENT_GROUPS, coveredExports, docsInGroup } from '../lib/design/component-docs'
import { exportedTypes, exportedValues, parseUiIndex } from '../lib/design/ui-index'
import { pageForToken, parseTokens, tokensForPage } from '../lib/design/tokens'

const vendor = (...parts: string[]) => join(process.cwd(), 'vendor', 'pogoleiria', ...parts)
const indexSource = readFileSync(vendor('packages/ui/src/index.ts'), 'utf8')
const tokenSet = parseTokens(readFileSync(vendor('packages/ui/src/tokens.css'), 'utf8'))

describe('the component catalogue is the whole public surface', () => {
  it('covers every value exported by @pogoleiria/ui', () => {
    const values = exportedValues(indexSource)
    const covered = coveredExports()
    const missing = values.filter((name) => !covered.has(name))
    expect(missing, `undocumented exports: ${missing.join(', ')}`).toEqual([])
  })

  it('does not document exports that no longer exist', () => {
    const values = new Set(exportedValues(indexSource))
    const phantom = [...coveredExports()].filter((name) => !values.has(name))
    expect(phantom, `documented but not exported: ${phantom.join(', ')}`).toEqual([])
  })

  it('reads types separately from values', () => {
    expect(exportedValues(indexSource)).toContain('Button')
    expect(exportedValues(indexSource)).toContain('POGO_ROUTES')
    expect(exportedTypes(indexSource)).toEqual(expect.arrayContaining(['AppSwitcherItem', 'QuestsSearch', 'QuestsZone']))
    expect(parseUiIndex(indexSource).filter((entry) => entry.name === 'Button' && !entry.typeOnly)).toHaveLength(1)
  })

  it('has unique slugs and valid groups', () => {
    const slugs = COMPONENT_DOCS.map((doc) => doc.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const doc of COMPONENT_DOCS) {
      expect(COMPONENT_GROUPS).toContain(doc.group)
      expect(docsInGroup(doc.group)).toContain(doc)
    }
  })

  it('quotes a rule for every component page', () => {
    for (const doc of COMPONENT_DOCS) {
      expect(doc.ruleQueries.length, `${doc.slug} has no rule query`).toBeGreaterThan(0)
    }
  })

  it('shows only files that exist in the vendor tree', () => {
    for (const doc of COMPONENT_DOCS) {
      for (const file of doc.sourceFiles) {
        expect(existsSync(vendor(file)), `${doc.slug}: ${file} missing`).toBe(true)
      }
    }
  })
})

describe('the token catalogue is the whole tokens.css surface', () => {
  it('gives every declaration a documented page', () => {
    expect(tokensForPage(tokenSet, 'colour').length).toBeGreaterThan(0)
    expect(tokensForPage(tokenSet, 'geometry').length).toBeGreaterThan(0)
    expect(tokensForPage(tokenSet, 'colour').length + tokensForPage(tokenSet, 'geometry').length).toBe(tokenSet.tokens.length)
  })

  it('does not let a new custom property fall between the pages', () => {
    for (const token of tokenSet.tokens) {
      expect(['colour', 'geometry']).toContain(pageForToken(token))
    }
  })
})

describe('colour sections leave nothing behind', () => {
  it('places every colour token in one named section', async () => {
    const { COLOUR_SECTIONS, colourSection, tokensForPage } = await import('../lib/design/tokens')
    const colourTokens = tokensForPage(tokenSet, 'colour')
    const ids = new Set(COLOUR_SECTIONS.map((section) => section.id))
    for (const token of colourTokens) {
      expect(ids.has(colourSection(token)), `${token.name} has no colour section`).toBe(true)
    }
    const covered = new Set(colourTokens.map((token) => colourSection(token)))
    for (const id of covered) {
      expect(colourTokens.filter((token) => colourSection(token) === id).length).toBeGreaterThan(0)
    }
  })
})

describe('the catalogue and its demos agree', () => {
  it('documents every declared slug', async () => {
    const { COMPONENT_SLUGS } = await import('../lib/design/component-docs')
    expect(COMPONENT_DOCS).toHaveLength(COMPONENT_SLUGS.length)
    expect(new Set(COMPONENT_DOCS.map((doc) => doc.slug))).toEqual(new Set(COMPONENT_SLUGS))
  })
})

describe('the pages render what the catalogue contains', () => {
  const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

  it('renders a block for every colour section', async () => {
    const { COLOUR_SECTIONS } = await import('../lib/design/tokens')
    const page = read('app/colour/page.tsx')
    expect(page).toContain("tokensForPage(tokens, 'colour')")
    for (const section of COLOUR_SECTIONS) {
      expect(page, `colour section ${section.id} is not rendered`).toContain(`id="${section.id}"`)
    }
  })

  it('renders a block for every geometry group', async () => {
    const { GEOMETRY_GROUPS } = await import('../lib/design/tokens')
    const page = read('app/geometry/page.tsx')
    expect(page).toContain("tokensForPage(tokens, 'geometry')")
    for (const group of GEOMETRY_GROUPS) {
      expect(page, `geometry group ${group.id} is not rendered`).toContain(`id="${group.id}"`)
    }
  })

  it('builds a static page for every component document', () => {
    const page = read('app/components/[slug]/page.tsx')
    expect(page).toContain('generateStaticParams')
    expect(page).toContain('COMPONENT_DOCS.map')
    expect(page).toContain('<ComponentDemo slug={doc.slug} />')
  })
})
