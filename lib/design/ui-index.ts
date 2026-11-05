/**
 * Read the public surface of @pogoleiria/ui from its index.
 *
 * The guard test compares this list with the component catalogue; nothing is
 * retyped, so exporting a new component without documenting it fails CI.
 */

export type UiExport = {
  name: string
  /** True for `export type { … }` and `type Foo` members. */
  typeOnly: boolean
}

export function parseUiIndex(source: string): UiExport[] {
  const exports: UiExport[] = []
  const statements = source.matchAll(/export\s+(type\s+)?\{([\s\S]*?)\}/g)

  for (const statement of statements) {
    const wholeStatementIsType = Boolean(statement[1])
    const names = statement[2]
      .split(',')
      .map((entry) => entry.replace(/\s+/g, ' ').trim())
      .filter(Boolean)

    for (const entry of names) {
      const memberIsType = /^type\s+/.test(entry)
      const cleaned = entry.replace(/^type\s+/, '').split(/\s+as\s+/).pop() ?? entry
      exports.push({ name: cleaned.trim(), typeOnly: wholeStatementIsType || memberIsType })
    }
  }

  return exports
}

export function exportedValues(source: string): string[] {
  return parseUiIndex(source).filter((entry) => !entry.typeOnly).map((entry) => entry.name)
}

export function exportedTypes(source: string): string[] {
  return parseUiIndex(source).filter((entry) => entry.typeOnly).map((entry) => entry.name)
}
