#!/usr/bin/env node
/**
 * Report whether the monorepo's committed HEAD has moved the files this site
 * vendors. This is a report, not a gate: drift is normal while the design
 * system evolves, and the site is pinned on purpose until someone runs
 * scripts/sync-source.sh with the new SHA.
 *
 * Exit codes: 0 when the report was produced (in sync or drifted);
 * 1 when the monorepo or the pinned commit cannot be read.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_REPO = process.env.POGOLEIRIA_REPO || '/root/PoGoLeiria'
const SYNCED_PATHS = [
  'packages/ui',
  'DESIGN.md',
  'apps/landing/app/globals.css',
  'apps/landing/lib/domain-colors.ts',
  'apps/landing/lib/team-colors.ts',
]

function git(args) {
  return execFileSync('git', ['-C', SOURCE_REPO, ...args], { encoding: 'utf8' }).trim()
}

let pinned
try {
  pinned = readFileSync(join(REPO_ROOT, 'vendor', 'SOURCE'), 'utf8').trim()
} catch {
  console.error('check-drift: vendor/SOURCE is missing; run scripts/sync-source.sh <sha>')
  process.exit(1)
}

try {
  const head = git(['rev-parse', 'HEAD'])
  const ahead = Number(git(['rev-list', '--count', `${pinned}..HEAD`]))
  const behind = Number(git(['rev-list', '--count', `HEAD..${pinned}`]))
  const changed = git(['diff', '--name-only', `${pinned}..HEAD`, '--', ...SYNCED_PATHS])
    .split('\n')
    .filter(Boolean)

  console.log(`pinned  ${pinned}`)
  console.log(`HEAD    ${head}`)

  if (changed.length === 0) {
    console.log(`status  in sync (${ahead} commit${ahead === 1 ? '' : 's'} ahead, none touching synced paths)`)
    process.exit(0)
  }

  console.log(`status  drifted: ${changed.length} synced file${changed.length === 1 ? '' : 's'} changed across ${ahead} commit${ahead === 1 ? '' : 's'}`)
  for (const file of changed) console.log(`        ${file}`)
  if (behind > 0) console.log(`note    HEAD is ${behind} commit${behind === 1 ? '' : 's'} behind the pinned SHA`)
  console.log('re-pin with: scripts/sync-source.sh <new-sha>')
  process.exit(0)
} catch (error) {
  console.error(`check-drift: cannot inspect ${SOURCE_REPO}: ${error.message}`)
  process.exit(1)
}
