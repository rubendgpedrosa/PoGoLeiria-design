import { Check } from 'lucide-react'

import { ContrastValue } from '@/components/site/contrast'
import { PageShell, Section } from '@/components/site/page-shell'
import { ColourTable, SemanticRoleCards } from '@/components/site/token-views'
import { contrastOn } from '@/lib/design/colour'
import { designTokens } from '@/lib/design/design'
import { COLOUR_SECTIONS, colourSection, tokensForPage } from '@/lib/design/tokens'

export const metadata = { title: 'Colour' }

export default function ColourPage() {
  const tokens = designTokens()
  const colour = tokensForPage(tokens, 'colour')
  const background = tokens.byName.get('background')!
  const card = tokens.byName.get('card')!

  const inSection = (id: (typeof COLOUR_SECTIONS)[number]['id']) => colour.filter((token) => colourSection(token) === id)
  const semantic = inSection('semantic')
  const primitive = inSection('primitive')
  const aliasesSemantic = inSection('alias-semantic')
  const aliasesSurface = inSection('alias-surface')
  const aliasesBrand = inSection('alias-brand')
  const aliasesOther = inSection('alias-other')
  const component = inSection('component')

  const tone950 = tokens.byName.get('tone-950')!.color!
  const urgent = tokens.color('urgent-500')!
  const backgroundColour = background.color!
  const cardColour = card.color!

  const checks = [
    { label: '--tone-950', value: `${tone950.hex} (from ${tone950.raw})` },
    { label: '--urgent-500 on --background', value: `${contrastOn(urgent, backgroundColour.rgb).toFixed(2)}:1` },
    { label: '--urgent-500 on --card', value: `${contrastOn(urgent, cardColour.rgb).toFixed(2)}:1` },
  ]

  return (
    <PageShell
      eyebrow="02 · Colour"
      title="Colour"
      lede={
        <>
          Every custom property in <span className="font-mono text-body text-ink-bright">tokens.css</span> that resolves to a colour:
          {' '}{colour.length} declarations across the primitive palette, the semantic roles and their Tailwind aliases. The hex and
          contrast columns are computed at build time from the vendored OKLCH values, not transcribed.
        </>
      }
      meta={
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{semantic.length} semantic roles</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">{primitive.length} primitives</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-label text-ink-label">
            {colour.length - semantic.length - primitive.length} aliases and component values
          </span>
        </div>
      }
    >
      <Section id="semantic" title={COLOUR_SECTIONS[0].label} intro={COLOUR_SECTIONS[0].description}>
        <SemanticRoleCards tokens={semantic} background={background} card={card} />
      </Section>

      <Section id="primitive" title={COLOUR_SECTIONS[1].label} intro={COLOUR_SECTIONS[1].description}>
        <ColourTable tokens={primitive} background={background} card={card} />
      </Section>

      <Section id="alias-semantic" title={COLOUR_SECTIONS[2].label} intro={COLOUR_SECTIONS[2].description}>
        <ColourTable tokens={aliasesSemantic} background={background} card={card} />
      </Section>

      <Section id="alias-surface" title={COLOUR_SECTIONS[3].label} intro={COLOUR_SECTIONS[3].description}>
        <ColourTable tokens={aliasesSurface} background={background} card={card} />
      </Section>

      <Section id="alias-brand" title={COLOUR_SECTIONS[4].label} intro={COLOUR_SECTIONS[4].description}>
        <ColourTable tokens={aliasesBrand} background={background} card={card} showMeaning />
      </Section>

      {aliasesOther.length > 0 ? (
        <Section id="alias-other" title={COLOUR_SECTIONS[5].label} intro={COLOUR_SECTIONS[5].description}>
          <ColourTable tokens={aliasesOther} background={background} card={card} showMeaning />
        </Section>
      ) : null}

      {component.length > 0 ? (
        <Section id="component" title={COLOUR_SECTIONS[6].label} intro={COLOUR_SECTIONS[6].description}>
          <ColourTable tokens={component} background={background} card={card} />
        </Section>
      ) : null}

      <Section
        id="reading-the-numbers"
        title="Reading the numbers"
        intro="The Colour page is also a check on the palette: it computes what a browser will show and what WCAG will measure. The token tables show the ratio only — a surface is not a text colour, and a deliberate 1.10:1 step between surfaces is not a failure — while the checks below grade the signal colours as text."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="lit rounded-xl border border-hairline bg-surface-raised p-4">
            <h3 className="font-display text-title font-bold text-ink-bright">OKLCH → sRGB</h3>
            <p className="mt-2 text-body leading-relaxed text-ink-label">
              OKLCH is converted to OKLab, then through the linear-sRGB matrix and the sRGB transfer function. Channels outside the
              gamut are clamped per channel. Hex values are 8-bit sRGB, uppercase.
            </p>
            <p className="mt-3 rounded-lg border border-hairline bg-surface-sunken p-3 font-mono text-label text-ink-muted">
              oklch(0.105 0.022 258) → {tone950.hex}
            </p>
          </div>
          <div className="lit rounded-xl border border-hairline bg-surface-raised p-4">
            <h3 className="font-display text-title font-bold text-ink-bright">WCAG contrast</h3>
            <p className="mt-2 text-body leading-relaxed text-ink-label">
              Ratios use WCAG 2.1 relative luminance. The suite’s floor is AA (4.5:1 for body text, 3:1 for large text); AAA is
              7:1. A translucent token is composited over the surface it is measured on before the ratio is taken.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="text-label text-ink-muted">On background</span>
              <ContrastValue ratio={contrastOn(urgent, backgroundColour.rgb)} />
              <span className="text-label text-ink-muted">On card</span>
              <ContrastValue ratio={contrastOn(urgent, cardColour.rgb)} />
            </div>
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {checks.map((check) => (
            <li key={check.label} className="flex flex-wrap items-baseline gap-2 text-body text-ink-label">
              <Check aria-hidden="true" className="size-4 shrink-0 text-success" />
              <span className="font-mono text-label text-ink-muted">{check.label}</span>
              <span className="font-display font-bold tabular-nums text-ink-bright">{check.value}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 max-w-[70ch] text-label leading-relaxed text-ink-subtle">
          The two <span className="font-mono">--urgent-500</span> checks are the brief’s: hue 58 must stay readable outdoors on both
          surfaces. <span className="font-mono">--tone-950</span> is the page background and must be the documented {tone950.hex}.
        </p>
      </Section>
    </PageShell>
  )
}
