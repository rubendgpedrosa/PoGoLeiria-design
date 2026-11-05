import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

/**
 * The vendor directory is not a copy someone edited: it is `git archive` of a
 * committed monorepo SHA. This test re-runs the export and compares every file
 * byte for byte, so a hand-edit, a partial sync or an accidental local change
 * cannot pass. It needs the monorepo checkout; elsewhere it skips loudly.
 */

const SYNCED_PATHS = [
  'packages/ui',
  'DESIGN.md',
  'apps/landing/app/globals.css',
  'apps/landing/lib/domain-colors.ts',
  'apps/landing/lib/team-colors.ts',
]

const SOURCE_REPO = process.env.POGOLEIRIA_REPO || '/root/PoGoLeiria'
const available = existsSync(join(SOURCE_REPO, '.git'))
const sha = readFileSync(join(process.cwd(), 'vendor', 'SOURCE'), 'utf8').trim()

function walk(root: string, directory = root): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name)
    return entry.isDirectory() ? walk(root, full) : [relative(root, full)]
  })
}

function describeTree(root: string) {
  return walk(root)
    .sort()
    .map((file) => {
      const full = join(root, file)
      const mode = statSync(full).mode & 0o777
      const hash = createHash('sha256').update(readFileSync(full)).digest('hex')
      return { file, mode, hash }
    })
}

describe.skipIf(!available)('vendor/pogoleiria is the pinned git archive', () => {
  let extracted = ''

  afterAll(() => {
    if (extracted) rmSync(extracted, { recursive: true, force: true })
  })

  it('records a full commit SHA', () => {
    expect(sha).toMatch(/^[0-9a-f]{40}$/)
  })

  it('matches the archive byte for byte', () => {
    extracted = mkdtempSync(join(tmpdir(), 'pogoleiria-design-vendor-'))
    const archive = execFileSync('git', ['-C', SOURCE_REPO, 'archive', '--format=tar', sha, '--', ...SYNCED_PATHS], {
      maxBuffer: 256 * 1024 * 1024,
    })
    const untar = spawnSync('tar', ['-x', '-C', extracted], { input: archive })
    expect(untar.status, untar.stderr?.toString()).toBe(0)

    const expected = describeTree(extracted)
    const actual = describeTree(join(process.cwd(), 'vendor', 'pogoleiria'))

    expect(actual.length).toBeGreaterThan(40)
    expect(actual).toEqual(expected)
  })

})
