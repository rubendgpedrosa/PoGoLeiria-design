import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The vendored monorepo checkout. scripts/sync-source.sh exports exactly these
 * files from a committed SHA; every page reads them at build time.
 */
export const VENDOR_ROOT = join(process.cwd(), 'vendor', 'pogoleiria')

export function readVendor(relativePath: string): string {
  return readFileSync(join(VENDOR_ROOT, relativePath), 'utf8')
}

/** The pinned monorepo commit recorded by scripts/sync-source.sh. */
export function vendorSha(): string {
  try {
    return readFileSync(join(process.cwd(), 'vendor', 'SOURCE'), 'utf8').trim()
  } catch {
    return 'unknown'
  }
}

export function shortSha(sha: string): string {
  return sha.slice(0, 7)
}
