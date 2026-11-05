import Link from 'next/link'
import { ArrowRight, Focus, Layers, Ruler, Sun } from 'lucide-react'

import { PageShell, Section } from '@/components/site/page-shell'
import { RuleList } from '@/components/site/rule-list'
import { GeometryTokenTable } from '@/components/site/token-views'
import { designTokens } from '@/lib/design/design'
import { GEOMETRY_GROUPS, geometryGroup, tokensForPage } from '@/lib/design/tokens'

export const metadata = { title: 'Geometry' }

export default function GeometryPage() {
  const tokens = designTokens()
  const geometry = tokensForPage(tokens, 'geometry')
  const group = (id: (typeof GEOMETRY_GROUPS)[number]['id']) => geometry.filter((token) => geometryGroup(token) === id)

  const radius = group('radius')
  const space = group('space')
  const control = group('control')
  const motion = group('motion')
  const elevation = group('elevation')
  const fonts = group('font')
  const type = group('type')
  const gradients = group('gradient')
  const component = group('component')
  const other = group('other')

  const radiusSteps = radius
    .filter((token) => token.name.startsWith('radius-step-'))
    .sort((a, b) => Number.parseFloat(a.resolved) - Number.parseFloat(b.resolved))

  const controlMin = tokens.byName.get('control-min')
  const shadow = tokens.byName.get('shadow-float')

  return (
    <PageShell
      eyebrow="04 · Geometry"
      title="Geometry"
      lede={
        <>
          Radius, control size, light, focus, spacing and motion — the declarations in <span className="font-mono text-body text-ink-bright">tokens.css</span>
          {' '}that are not colours ({geometry.length} of them). The site uses these values on this page; the radius boxes and bars below
          are drawn from the tokens themselves.
        </>
      }
      meta={
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{geometry.length} declarations</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{radiusSteps.length} radius steps</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">one shadow</span>
        </div>
      }
    >
      <Section
        id="radius"
        title="Radius"
        intro="Five steps, all declared. A control sits one step tighter than the surface holding it; desktop controls use radius-lg and cards radius-xl. Phone cards are 24px."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {radiusSteps.map((token) => (
            <div key={token.name} className="rounded-xl border border-hairline bg-surface-raised p-3 text-center">
              <div
                aria-hidden="true"
                className="lit mx-auto size-20 border border-hairline-strong bg-surface-sunken"
                style={{ borderRadius: token.resolved }}
              />
              <code className="mt-3 block font-mono text-label font-semibold text-ink-bright">--{token.name}</code>
              <span className="font-display text-label font-bold tabular-nums text-ink-subtle">{token.resolved}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <GeometryTokenTable tokens={radius} />
        </div>
        <div className="mt-6">
          <RuleList queries={['Radius steps run', 'Phone cards are 24px']} title="Radius rules" limit={2} />
        </div>
      </Section>

      <Section
        id="control"
        title="Control minimum"
        intro="Every interactive target is at least 44px. The token is 2.75rem, so it follows the root font size rather than pinning px."
      >
        <div className="flex flex-wrap items-center gap-4">
          <div
            aria-hidden="true"
            className="grid place-items-center rounded-xl border border-dashed border-hairline-active bg-surface-raised"
            style={{ minWidth: 'var(--control-min)', minHeight: 'var(--control-min)', height: 'var(--control-min)', width: 'var(--control-min)' }}
          >
            <Ruler className="size-5 text-ember-bright" />
          </div>
          <div>
            <p className="font-display text-figure-lg font-extrabold tabular-nums text-ink-bright">
              {controlMin?.resolved} ≈ 44px
            </p>
            <p className="text-label text-ink-muted">--control-min · the minimum, not the target size</p>
          </div>
        </div>
        <div className="mt-6">
          <GeometryTokenTable tokens={control} />
        </div>
        <div className="mt-6">
          <RuleList queries={['Keep interactive targets at least 44px']} title="Control rule" limit={1} />
        </div>
      </Section>

      <Section
        id="elevation"
        title="Light, not shadow"
        intro="Surfaces separate by a real lightness step and a hairline, not by a drop shadow: a shadow on a dark panel over a dark page disappears in the sunlight these apps are used in. The positive half is .lit, a 1px inset top highlight. --shadow-float is the one exception, for things that genuinely float."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-surface-raised p-4">
            <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Flat raised panel</p>
            <p className="mt-2 text-body leading-relaxed text-ink-label">
              A fill inside a hairline. The edge is there, but the top of the surface is not catching any light.
            </p>
          </div>
          <div className="lit rounded-xl border border-hairline bg-surface-raised p-4">
            <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">.lit on the same panel</p>
            <p className="mt-2 text-body leading-relaxed text-ink-label">
              One inset highlight along the top edge: the positive half of the rule, not a shadow, and not
              <span className="font-mono text-label"> --shadow-float</span>.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-hairline bg-surface-sunken p-6">
          <div
            className="mx-auto flex max-w-sm flex-col gap-1 rounded-xl border border-hairline-strong bg-surface-elevated p-4"
            style={shadow ? { boxShadow: 'var(--shadow-float)' } : undefined}
          >
            <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Allowed to float</p>
            <p className="font-display text-title font-bold text-ink-bright">--shadow-float</p>
            <p className="text-label leading-relaxed text-ink-muted">AppSwitcher and popovers, and nothing else.</p>
          </div>
        </div>

        <div className="mt-6">
          <GeometryTokenTable tokens={elevation} />
        </div>
        <div className="mt-6">
          <RuleList
            queries={['Separate surfaces with light, not shadow', ' .lit (in tokens.css) is the positive half', 'The hub’s three folds share one summary']}
            title="Light rules"
            limit={2}
          />
        </div>
      </Section>

      <Section
        id="focus"
        title="Focus"
        intro="One treatment: a 2px ember-bright outline at 2px offset, on buttons, links, textareas, selects and scrollers. It is never a ring, and the colour is the one reserved for what you touch."
      >
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="rounded-lg border border-hairline bg-surface-raised px-4 text-body font-medium text-ink-bright outline-solid outline-2 outline-offset-2 outline-ember-bright"
          >
            Forced focus-visible
          </button>
          <button type="button" className="rounded-lg border border-hairline bg-surface-raised px-4 text-body font-medium text-ink-label">
            Keyboard-focus me
          </button>
        </div>
        <p className="mt-3 max-w-[70ch] text-label leading-relaxed text-ink-muted">
          The first control has the focus classes applied permanently so the treatment is visible without tabbing. The second uses
          the site’s global <span className="font-mono">:focus-visible</span> rule — press Tab.
        </p>
        <div className="mt-6">
          <RuleList queries={['One focus treatment', 'Focus is `outline-ember-bright`']} title="Focus rule" limit={2} />
        </div>
      </Section>

      <Section
        id="space"
        title="Spacing"
        intro="A short rhythm declared with the palette. The bars are four times the token width, so the steps are legible on screen."
      >
        <ul className="flex flex-col gap-2">
          {space.map((token) => (
            <li key={token.name} className="flex items-center gap-3">
              <code className="w-32 shrink-0 font-mono text-label text-ink-label">--{token.name}</code>
              <span
                aria-hidden="true"
                className="block h-2 rounded-full bg-ember"
                style={{ width: `calc(${token.resolved} * 4)` }}
              />
              <span className="font-display text-label font-bold tabular-nums text-ink-subtle">{token.resolved}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <GeometryTokenTable tokens={space} />
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        intro="Two durations and one easing curve. Motion is feedback, never essential information, and everything stands still under prefers-reduced-motion — the site’s own stylesheet enforces the same contract it documents."
      >
        <div className="mt-0">
          <GeometryTokenTable tokens={motion} />
        </div>
        <div className="mt-6">
          <RuleList queries={['Respect `prefers-reduced-motion`']} title="Motion rule" limit={1} />
        </div>
      </Section>

      <Section
        id="font"
        title="Fonts"
        intro="Three roles, two families. The mono role resolves to the display face rather than adding a third family."
      >
        <GeometryTokenTable tokens={fonts} />
      </Section>

      <Section
        id="type"
        title="Type scale declarations"
        intro="The nine --text-* declarations, listed here so every non-colour custom property in tokens.css has a home on this page. The specimens are on the Type page."
      >
        <GeometryTokenTable tokens={type} />
        <Link
          href="/type"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-hairline bg-surface-raised px-4 text-body text-ink-label transition-colors hover:border-hairline-hover hover:text-ink-bright motion-reduce:transition-none"
        >
          See the scale in both faces
          <ArrowRight aria-hidden="true" className="size-4 text-ember-bright" />
        </Link>
      </Section>

      <Section
        id="gradient"
        title="Gradients"
        intro="Shared gradients, built from the surface and ember tokens. They are registered as background-image utilities so a palette change cannot desync a flat use from a gradient built from the same colour."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {gradients.map((token) => (
            <div key={token.name} className="overflow-hidden rounded-xl border border-hairline">
              <div className="h-24" style={{ backgroundImage: `var(--${token.name})` }} />
              <div className="bg-surface-raised p-3">
                <code className="break-words font-mono text-label font-semibold text-ink-bright">--{token.name}</code>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <GeometryTokenTable tokens={gradients} />
        </div>
      </Section>

      <Section
        id="component"
        title="Component-scoped"
        intro="Declarations inside component rules in tokens.css. They are private to the component, but they are still custom properties in the file, so the site shows them rather than pretending the file is only the palette."
      >
        <div className="mb-4 flex items-center gap-2 text-label text-ink-muted">
          <Layers aria-hidden="true" className="size-4 text-ember-bright" />
          SegmentedControl geometry and PageHeader’s phone gutter.
        </div>
        <GeometryTokenTable tokens={component} />
      </Section>

      {other.length > 0 ? (
        <Section id="other" title="Other declarations" intro="Any non-colour property that does not fit a named geometry group yet. It is visible here so it cannot be skipped.">
          <GeometryTokenTable tokens={other} />
        </Section>
      ) : null}

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-hairline bg-surface-raised p-4 text-label text-ink-muted lit">
        <Sun aria-hidden="true" className="size-4 shrink-0 text-ember-bright" />
        The page background is --background; panels are --surface-raised with a hairline. Nothing here carries a drop shadow except
        the one labelled --shadow-float.
        <Focus aria-hidden="true" className="ml-auto size-4 shrink-0 text-ink-subtle" />
      </div>
    </PageShell>
  )
}
