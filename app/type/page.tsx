import { PageShell, Section } from '@/components/site/page-shell'
import { RuleList } from '@/components/site/rule-list'
import { designTokens } from '@/lib/design/design'
import { readVendor } from '@/lib/source'

export const metadata = { title: 'Type' }

function pxValue(value: string): number | null {
  const match = /^([\d.]+)px$/.exec(value.trim())
  return match ? Number(match[1]) : null
}

export default function TypePage() {
  const tokens = designTokens()
  const scale = tokens.tokens
    .filter((token) => token.name.startsWith('text-'))
    .map((token) => ({ token, px: pxValue(token.resolved) }))
    .filter((entry): entry is { token: (typeof tokens.tokens)[number]; px: number } => entry.px !== null)
    .sort((a, b) => a.px - b.px)

  const fonts = tokens.tokens.filter((token) => token.name.startsWith('font-'))
  const globals = readVendor('apps/landing/app/globals.css')
  const importLine = globals
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.includes('@pogoleiria/ui/tokens.css')) ?? "/* @import '@pogoleiria/ui/tokens.css'; */"

  return (
    <PageShell
      eyebrow="03 · Type"
      title="Type"
      lede={
        <>
          Nine declared steps — seven base sizes plus the two <span className="font-mono text-body text-ink-bright">lg</span> steps
          — in Figtree for reading and Bricolage Grotesque for headings and figures. The sizes below are read from the token file,
          not retyped, and every figure sample is set with tabular numerals.
        </>
      }
      meta={
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{scale.length} steps</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{fonts.length} font roles</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">10px → {scale[scale.length - 1]?.px ?? 0}px</span>
        </div>
      }
    >
      <Section
        id="scale"
        title="The scale"
        intro="Each row is the same specimen in both faces, at the exact px value the token declares. Where the product app steps a size up at lg, it steps to the next token — never to a new invented value."
      >
        <ol className="flex flex-col">
          {scale.map(({ token, px }) => (
            <li key={token.name} className="border-t border-hairline py-6 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <code className="font-mono text-body font-semibold text-ink-bright">--{token.name}</code>
                <span className="font-display text-label font-bold tabular-nums text-ink-subtle">{px}px</span>
              </div>

              <div className="mt-3 flex flex-col gap-3 overflow-x-auto">
                <div>
                  <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Figtree · font-sans</p>
                  <p
                    className="mt-1 whitespace-nowrap font-sans tabular-nums leading-tight text-ink-bright"
                    style={{ fontSize: `${px}px` }}
                  >
                    Aa 0123456789 · 1,204 · 87%
                  </p>
                </div>
                <div>
                  <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Bricolage Grotesque · font-display</p>
                  <p
                    className="mt-1 whitespace-nowrap font-display font-extrabold tabular-nums leading-tight text-ink-bright"
                    style={{ fontSize: `${px}px` }}
                  >
                    Aa 0123456789 · 1,204 · 87%
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="figures"
        title="Figures and tabular numerals"
        intro="Counts, ratios and percentages are set in the display face with tabular-nums, so digits line up between one row and the next. Proportional figures drift and turn a column into a ragged edge."
      >
        <div className="overflow-x-auto rounded-xl border border-hairline bg-surface-raised p-4 lit">
          <table className="border-collapse text-left">
            <thead>
              <tr className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
                <th scope="col" className="pr-8">Metric</th>
                <th scope="col" className="pr-8">Tabular</th>
                <th scope="col" className="pr-8">Proportional</th>
              </tr>
            </thead>
            <tbody className="font-display text-figure font-extrabold text-ink-bright">
              <tr>
                <td className="pr-8 text-label font-normal text-ink-muted">Pokémon seen</td>
                <td className="pr-8 tabular-nums">1,204</td>
                <td className="pr-8 [font-variant-numeric:proportional-nums]">1,204</td>
              </tr>
              <tr>
                <td className="pr-8 text-label font-normal text-ink-muted">Collection</td>
                <td className="pr-8 tabular-nums">87.1%</td>
                <td className="pr-8 [font-variant-numeric:proportional-nums]">87.1%</td>
              </tr>
              <tr>
                <td className="pr-8 text-label font-normal text-ink-muted">Raid tier 5</td>
                <td className="pr-8 tabular-nums">44 / 56</td>
                <td className="pr-8 [font-variant-numeric:proportional-nums]">44 / 56</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="faces" title="The two faces" intro="The display face is headings and figures; the text face is everything read as a sentence. The mono role resolves to the display face on purpose, not to a third family.">
        <ul className="grid gap-3 md:grid-cols-3">
          {fonts.map((token) => (
            <li key={token.name} className="lit rounded-xl border border-hairline bg-surface-raised p-4">
              <code className="font-mono text-label font-semibold text-ink-bright">--{token.name}</code>
              <p className="mt-1 break-words font-mono text-micro text-ink-subtle">{token.resolved}</p>
              <p
                className={`mt-4 text-ink-bright ${
                  token.name === 'font-display' || token.name === 'font-mono'
                    ? 'font-display text-figure font-extrabold'
                    : 'font-sans text-figure'
                }`}
              >
                Aa 0123456789
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <RuleList
            queries={['hub’s type scale is seven steps', 'Set figures in `font-display`', 'One figure gets the big jump']}
            title="Rules that govern the scale"
            limit={3}
          />
        </div>
      </Section>

      <Section
        id="provenance"
        title="Where the values come from"
        intro="The landing app imports the shared token file; the scale began there and now lives in the package so all three apps share it."
      >
        <div className="rounded-xl border border-hairline bg-surface-raised p-4 lit">
          <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">apps/landing/app/globals.css</p>
          <pre className="mt-2 overflow-x-auto font-mono text-label leading-relaxed text-ink-label">
            <code>{importLine}</code>
          </pre>
          <p className="mt-3 max-w-[70ch] text-label leading-relaxed text-ink-muted">
            The landing file declares no <span className="font-mono">--text-*</span> values of its own: it imports the package. The
            nine steps are read from the vendored <span className="font-mono">tokens.css</span> at the same pinned commit, which is
            what the landing renders.
          </p>
        </div>
      </Section>
    </PageShell>
  )
}
