import { MessageSquare, Smartphone } from 'lucide-react'

import { PageShell, Section } from '@/components/site/page-shell'

export const metadata = { title: 'Other surfaces' }

export default function SurfacesPage() {
  return (
    <PageShell
      eyebrow="07 · Other surfaces"
      title="Other surfaces"
      lede={
        <>
          The design language has to hold outside the web app too. These surfaces are described here, not rendered: they live in other
          repositories and are not part of the pinned web source.
        </>
      }
    >
      <Section
        id="android"
        title="Android app"
        intro="pogoleiria.pt in a WebView of its own, package pt.pogoleiria.app. There is no second implementation of the tools: it loads the live site, so a deploy reaches it at once."
      >
        <div className="lit rounded-xl border border-hairline bg-surface-raised p-4">
          <p className="flex items-center gap-2 font-display text-title font-bold text-ink-bright">
            <Smartphone aria-hidden="true" className="size-5 text-ember-bright" />
            The web rules apply directly
          </p>
          <p className="mt-2 max-w-[70ch] text-body leading-relaxed text-ink-label">
            Because the wrapper renders the same HTML and CSS, tokens, radii, the type scale, focus and reduced motion all arrive with
            the site. The wrapper adds native chrome around that content: the launch state, the “Sem ligação” offline page and the
            update prompt. Those are the places to watch — they must use the same background, surface and ink roles rather than invent
            a second palette.
          </p>
          <p className="mt-3 text-label leading-relaxed text-ink-muted">
            Reference: <span className="font-mono">android/README.md</span> in the monorepo. Rebuilds change only the icon, the name or
            the wrapper; visual changes belong in the site, where every surface gets them.
          </p>
        </div>
      </Section>

      <Section
        id="discord"
        title="Discord images"
        intro="Poliswag renders HTML templates to images for Discord. The files are templates/*.html in the Poliswag repository; they are not part of this site’s vendored source."
      >
        <div className="lit rounded-xl border border-hairline bg-surface-raised p-4">
          <p className="flex items-center gap-2 font-display text-title font-bold text-ink-bright">
            <MessageSquare aria-hidden="true" className="size-5 text-ember-bright" />
            An image, but still the same language
          </p>
          <p className="mt-2 max-w-[70ch] text-body leading-relaxed text-ink-label">
            The stage is transparent on purpose so the card composites on Discord’s light and dark chat backgrounds; only the card
            paints an opaque surface. The current templates are Discord-native rather than suite-native: Inter instead of Figtree and
            Bricolage, an 18px card radius (not one of 8/12/16/20/24), a gradient card, glow shadows and Discord’s own status colours.
          </p>
          <p className="mt-3 max-w-[70ch] text-body leading-relaxed text-ink-label">
            That is a known gap, not a second system to copy. The migration is the same one the web made: take the radius steps and
            type scale from tokens, keep gold for rewards and progress only, and replace the glow with the card’s own lightness step
            and a hairline. Because an image has no DOM, the values have to be copied into the template — so the template should name
            the token it mirrors, and a check should flag drift.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-label leading-relaxed text-ink-muted">
            <li>— Surface: the same sunken → background → raised ramp, no drop shadow.</li>
            <li>— Type: the documented scale, two faces, tabular figures for counts.</li>
            <li>— Radius: 8 / 12 / 16 / 20 / 24, chosen by surface, not 18px.</li>
            <li>— Colour: ember for what you touch, gold only for a reward or progress, urgent only for “runs out soon”.</li>
            <li>— No emoji in the template; lucide icons are drawn in HTML, not rendered from the host OS font.</li>
          </ul>
        </div>
      </Section>

      <p className="mt-2 max-w-[72ch] text-label leading-relaxed text-ink-subtle">
        Both surfaces are linked rather than embedded: the Android wrapper and the Discord templates are outside the pinned checkout,
        and rendering either here would be a copy that could silently drift.
      </p>
    </PageShell>
  )
}
