import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * The suite's type scale is tokens in @pogoleiria/ui/tokens.css (micro 10 to
 * hero 44). The hub has held to it since 2026-09-22; this stops the shared UI
 * drifting back to half-pixel one-offs like text-[12.5px].
 */
describe("the type scale stays a scale", () => {
  it("has no hardcoded font sizes in the shared UI", async () => {
    const offenders: string[] = []
    const walk = async (at: string, prefix = "") => {
      for (const entry of await readdir(at, { withFileTypes: true })) {
        const next = join(at, entry.name)
        if (entry.isDirectory()) {
          await walk(next, `${prefix}${entry.name}/`)
          continue
        }
        if (!entry.name.endsWith(".tsx")) continue
        const source = await readFile(next, "utf8")
        for (const hit of source.match(/text-\[[0-9.]+px\]/g) ?? []) offenders.push(`${prefix}${entry.name}: ${hit}`)
      }
    }
    // vitest runs from the workspace root.
    await walk(join(process.cwd(), "src"))
    expect(offenders).toEqual([])
  })
})
