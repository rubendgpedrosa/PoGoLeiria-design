import { Markdown } from '@/components/site/markdown'
import { PageShell, Section } from '@/components/site/page-shell'
import { SourcePanel } from '@/components/site/source-panel'
import { Swatch } from '@/components/site/swatch'
import { contrastOn, parseColor, type ColorValue } from '@/lib/design/colour'
import { designBlocks, designTokens } from '@/lib/design/design'
import { sections } from '@/lib/design/markdown'
import type { TokenSet } from '@/lib/design/tokens'
import {
  CATEGORY_COLORS,
  EVENT_TYPE_COLORS,
  HUNDRED_GOLD,
  LURE_COLOR_FALLBACK,
  LURE_COLORS,
  MEGA_PINK,
  NEST_TONE,
  POKESTOP_BLUE,
  POWER_SPOT_FACES,
  POWER_SPOT_MAGENTA,
  REWARD_TYPE_COLORS,
  ROCKET_GLOW,
  ROCKET_RED,
  ROCKET_STOP_OUTLINE,
  SHADOW_TINT,
  SHADOW_VIOLET,
  STOP_POST_METAL,
  STOP_STAND_INK,
} from '@vendor/domain-colors'
import { TEAM_META } from '@vendor/team-colors'

export const metadata = { title: 'Domain colours' }

type Entry = { label: string; value: string; note?: string }

function asColour(value: string, tokens: TokenSet): ColorValue | null {
  const reference = /^var\((--[A-Za-z0-9_-]+)\)$/.exec(value.trim())
  if (reference) return tokens.color(reference[1])
  return parseColor(value)
}

function Palette({ id, title, intro, entries, tokens }: { id: string; title: string; intro: string; entries: Entry[]; tokens: TokenSet }) {
  const background = tokens.color('background')!

  return (
    <Section id={id} title={title} intro={intro}>
      <ul className="rounded-xl border border-hairline bg-surface-raised px-4 lit">
        {entries.map((entry) => {
          const colour = asColour(entry.value, tokens)
          return (
            <li key={`${entry.label}-${entry.value}`} className="flex flex-wrap items-center gap-3 border-t border-hairline py-3 first:border-t-0">
              {colour ? <Swatch hex={colour.hex} alpha={colour.alpha} label={entry.label} /> : <span className="inline-block size-10 rounded-lg border border-hairline" />}
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-ink-bright">{entry.label}</p>
                <code className="break-words font-mono text-label text-ink-muted">{entry.value}</code>
                {entry.note ? <p className="mt-1 text-label text-ink-subtle">{entry.note}</p> : null}
              </div>
              {colour ? (
                <div className="text-right">
                  <p className="font-display text-body font-bold tabular-nums text-ink-bright">{colour.hex}</p>
                  <p className="text-micro text-ink-subtle">
                    {colour.alpha < 1 ? `alpha ${colour.alpha}` : `${contrastOn(colour, background.rgb).toFixed(2)}:1 on background`}
                  </p>
                </div>
              ) : (
                <p className="max-w-[24ch] text-right text-label text-ink-subtle">resolves through a token at use</p>
              )}
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export default function DomainColoursPage() {
  const tokens = designTokens()
  const migration = sections(designBlocks()).find((section) => section.heading.id === 'current-migration-note')

  return (
    <PageShell
      eyebrow="06 · Domain colours"
      title="Domain colours"
      lede={
        <>
          Game and place colours that belong to a domain, not to the global UI theme. They are imported live from the vendored{' '}
          <span className="font-mono text-body text-ink-bright">apps/landing/lib/domain-colors.ts</span> and{' '}
          <span className="font-mono text-body text-ink-bright">team-colors.ts</span>, and labelled here as domain-owned.
        </>
      }
      meta={
        <p className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">Domain-owned, not global tokens</p>
      }
    >
      <section aria-labelledby="migration" className="rounded-xl border border-hairline bg-surface-raised p-5 lit">
        <h2 id="migration" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
          DESIGN.md · current migration note
        </h2>
        <div className="mt-3">
          <Markdown blocks={migration?.blocks ?? []} />
        </div>
      </section>

      <Palette
        id="lures"
        title="Lures"
        intro="Lure tints, keyed by lure id. The Golden Lure is gold as in the game (M11b); its dark accent in the stop’s art is #A16207."
        tokens={tokens}
        entries={[
          ...Object.entries(LURE_COLORS).map(([id, value]) => ({ label: `Lure ${id}`, value })),
          { label: 'Fallback', value: LURE_COLOR_FALLBACK, note: 'A lure id the game added ahead of the module still gets the base pink.' },
        ]}
      />

      <Palette
        id="rewards"
        title="Quest rewards"
        intro="The four kinds of quest reward, as on the reward chips. Domain keys, not semantic roles: they tint a chip, never a paragraph."
        tokens={tokens}
        entries={Object.entries(REWARD_TYPE_COLORS).map(([key, value]) => ({ label: key.replace(/_/g, ' '), value }))}
      />

      <Palette
        id="categories"
        title="Quest categories"
        intro="The five quest categories, as on the filter dots and a row’s category dot."
        tokens={tokens}
        entries={Object.entries(CATEGORY_COLORS).map(([key, value]) => ({ label: key, value }))}
      />

      <Palette
        id="event-types"
        title="Event types"
        intro="The scrape’s event-type tints. Six are OKLCH, spread around the wheel to stay apart at 20px and clear of gold’s band because none of these is a reward. A Season takes the page’s own ink."
        tokens={tokens}
        entries={Object.entries(EVENT_TYPE_COLORS).map(([key, value]) => ({ label: key.replace(/_/g, ' '), value }))}
      />

      <Palette
        id="rocket"
        title="Rocket and Shadow"
        intro="Team GO Rocket’s red and the Shadow violet: a glow, a dot ring, a map cube outline and the Shadow chip tint. All are domain values."
        tokens={tokens}
        entries={[
          { label: 'Rocket glow', value: ROCKET_GLOW },
          { label: 'Rocket red', value: ROCKET_RED },
          { label: 'Rocket stop outline', value: ROCKET_STOP_OUTLINE },
          { label: 'Shadow violet', value: SHADOW_VIOLET },
          { label: 'Shadow tint', value: SHADOW_TINT },
        ]}
      />

      <Palette
        id="native-map"
        title="Native map"
        intro="Place colours for the map: the game’s Pokéstop blue, a Power Spot’s magenta and its crystal faces, a nest’s neutral tone, a Mega’s pink and the 100IV gold."
        tokens={tokens}
        entries={[
          { label: 'Pokéstop blue', value: POKESTOP_BLUE },
          { label: 'Stop stand ink', value: STOP_STAND_INK },
          ...STOP_POST_METAL.map((value, index) => ({ label: `Stop post metal ${index + 1}`, value })),
          { label: 'Power Spot magenta', value: POWER_SPOT_MAGENTA },
          ...POWER_SPOT_FACES.map((value, index) => ({ label: `Power Spot face ${index + 1}`, value })),
          { label: 'Nest tone', value: NEST_TONE },
          { label: 'Mega pink', value: MEGA_PINK, note: 'The same tint as the hub’s raid events.' },
          { label: '100IV gold', value: HUNDRED_GOLD },
        ]}
      />

      <Section
        id="teams"
        title="Teams"
        intro="The three team identities, owned in one module rather than retyped in each component. Digits on a team colour are dark (text-surface-sunken): white on Instinct yellow measures 1.52:1."
      >
        <ul className="rounded-xl border border-hairline bg-surface-raised px-4 lit">
          {TEAM_META.map((team) => {
            const colour = parseColor(team.color)
            return (
              <li key={team.key} className="flex flex-wrap items-center gap-3 border-t border-hairline py-3 first:border-t-0">
                {colour ? <Swatch hex={colour.hex} label={team.label} /> : null}
                <div className="min-w-0 flex-1">
                  <p className="text-body font-semibold text-ink-bright">{team.label}</p>
                  <code className="font-mono text-label text-ink-muted">{team.key}</code>
                </div>
                <div className="text-right">
                  <p className="font-display text-body font-bold tabular-nums text-ink-bright">{colour?.hex ?? team.color}</p>
                  <p className="text-micro text-ink-subtle">raw {team.color}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Section>

      <p className="mt-2 max-w-[72ch] text-label leading-relaxed text-ink-subtle">
        Contrast figures are shown as a reference only: these values tint a glyph, a dot, a chip border or a wash, and are never a text
        colour on their own. The migration note above is the rule — they stay domain-owned until their contrast and semantic roles are
        deliberately audited.
      </p>

      <div className="mt-8">
        <SourcePanel files={['apps/landing/lib/domain-colors.ts', 'apps/landing/lib/team-colors.ts']} />
      </div>
    </PageShell>
  )
}
