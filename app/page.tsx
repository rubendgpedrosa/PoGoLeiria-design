import Link from 'next/link'
import { ArrowRight, BookOpen, Boxes, Database } from 'lucide-react'

import { PageShell } from '@/components/site/page-shell'
import { InlineRun, Markdown } from '@/components/site/markdown'
import { componentSource, designBlocks, designTokens } from '@/lib/design/design'
import { sections } from '@/lib/design/markdown'
import { exportedValues } from '@/lib/design/ui-index'
import { shortSha, vendorSha } from '@/lib/source'

export const metadata = { title: 'Overview' }

const NEXT_PAGES = [
  { href: '/colour', label: 'Colour', description: 'Every colour declaration, its sRGB hex and its contrast.' },
  { href: '/type', label: 'Type', description: 'The nine-step scale in both faces, with tabular figures.' },
  { href: '/geometry', label: 'Geometry', description: 'Radius, control size, light, focus and motion.' },
  { href: '/components', label: 'Components', description: 'Every exported component, rendered live and ruled.' },
]

export default function OverviewPage() {
  const tokens = designTokens()
  const exports = exportedValues(componentSource('packages/ui/src/index.ts'))
  const doc = sections(designBlocks()).filter((section) => section.heading.level > 1)
  const sha = vendorSha()

  return (
    <PageShell
      eyebrow="01 · Overview"
      title="The design system"
      lede={
        <>
          PoGoLeiria’s enforceable visual rules, rendered from <span className="font-mono text-body text-ink-bright">DESIGN.md</span> at
          build time. Nothing on this page is copied into a component: change the file, rebuild, and the site changes with it.
        </>
      }
      meta={
        <p className="text-label text-ink-muted">
          Pinned to monorepo <span className="font-mono text-ink-label">{shortSha(sha)}</span>. The colour and component pages are
          generated from the same commit.
        </p>
      }
    >
      <section aria-labelledby="generated-from" className="rounded-xl border border-hairline bg-surface-raised p-5 lit">
        <h2 id="generated-from" className="font-display text-figure font-extrabold tracking-[-0.02em] text-ink-bright">
          Generated, not transcribed
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="border-t border-hairline pt-3">
            <dt className="flex items-center gap-2 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
              <Database aria-hidden="true" className="size-4 text-ember-bright" />
              tokens.css
            </dt>
            <dd className="mt-2 font-display text-figure-lg font-extrabold tabular-nums text-ink-bright">{tokens.tokens.length}</dd>
            <dd className="text-label text-ink-muted">custom properties read and classified</dd>
          </div>
          <div className="border-t border-hairline pt-3">
            <dt className="flex items-center gap-2 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
              <Boxes aria-hidden="true" className="size-4 text-ember-bright" />
              @pogoleiria/ui
            </dt>
            <dd className="mt-2 font-display text-figure-lg font-extrabold tabular-nums text-ink-bright">{exports.length}</dd>
            <dd className="text-label text-ink-muted">value exports, each with a page</dd>
          </div>
          <div className="border-t border-hairline pt-3">
            <dt className="flex items-center gap-2 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
              <BookOpen aria-hidden="true" className="size-4 text-ember-bright" />
              DESIGN.md
            </dt>
            <dd className="mt-2 font-display text-figure-lg font-extrabold tabular-nums text-ink-bright">{doc.length}</dd>
            <dd className="text-label text-ink-muted">sections parsed from the rules</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="next" className="mt-10">
        <h2 id="next" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
          Start here
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {NEXT_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="lit flex min-h-11 items-start gap-3 rounded-xl border border-hairline bg-surface-raised p-4 transition-colors hover:border-hairline-hover motion-reduce:transition-none"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-title font-bold text-ink-bright">{page.label}</span>
                  <span className="mt-1 block text-label leading-relaxed text-ink-muted">{page.description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-ember-bright" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 border-t border-hairline">
        {doc.map((section) => (
          <section key={section.heading.id} aria-labelledby={section.heading.id} className="scroll-mt-24 border-b border-hairline py-10">
            <h2
              id={section.heading.id}
              className="font-display text-figure-lg font-extrabold tracking-[-0.02em] text-ink-bright"
            >
              <InlineRun content={section.heading.content} />
            </h2>
            <div className="mt-4">
              <Markdown blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-label leading-relaxed text-ink-subtle">
        The parser understands the constructs DESIGN.md actually uses: headings, paragraphs, bullet lists, bold, italics, inline code
        and links. Links point at monorepo files with no public address, so they show their target instead of navigating nowhere.
      </p>
    </PageShell>
  )
}
