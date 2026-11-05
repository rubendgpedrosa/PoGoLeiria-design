import Link from 'next/link'
import { ArrowRight, Compass, LayoutGrid, PanelTop, TextCursorInput, Wrench, Zap } from 'lucide-react'

import { PageShell } from '@/components/site/page-shell'
import { COMPONENT_DOCS, COMPONENT_GROUPS, docsInGroup, type ComponentGroup } from '@/lib/design/component-docs'

export const metadata = { title: 'Components' }

const GROUP_ICON: Record<ComponentGroup, typeof Zap> = {
  Actions: Zap,
  Forms: TextCursorInput,
  Content: LayoutGrid,
  Navigation: Compass,
  Layout: PanelTop,
  Utilities: Wrench,
}

export default function ComponentsPage() {
  return (
    <PageShell
      eyebrow="05 · Components"
      title="Components"
      lede={
        <>
          Every value exported by <span className="font-mono text-body text-ink-bright">@pogoleiria/ui</span>, rendered live from the
          vendored package with its variants and states. {COMPONENT_DOCS.length} pages cover the whole public surface; the guard test
          fails if an export loses its page.
        </>
      }
      meta={
        <p className="text-label text-ink-muted">
          Props tables are written next to each example because the package publishes no extracted API docs. The governing rule on
          every page is quoted from DESIGN.md.
        </p>
      }
    >
      <div className="flex flex-col gap-10">
        {COMPONENT_GROUPS.map((group) => {
          const Icon = GROUP_ICON[group]
          const docs = docsInGroup(group)
          if (docs.length === 0) return null
          return (
            <section key={group} aria-labelledby={`group-${group}`}>
              <h2 id={`group-${group}`} className="flex items-center gap-2 font-display text-figure font-extrabold tracking-[-0.02em] text-ink-bright">
                <Icon aria-hidden="true" className="size-5 text-ember-bright" />
                {group}
                <span className="font-display text-label font-bold tabular-nums text-ink-subtle">{docs.length}</span>
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/components/${doc.slug}`}
                      className="lit flex h-full min-h-11 flex-col gap-3 rounded-xl border border-hairline bg-surface-raised p-4 transition-colors hover:border-hairline-hover motion-reduce:transition-none"
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-display text-title font-bold text-ink-bright">{doc.title}</span>
                        <ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ember-bright" />
                      </span>
                      <span className="text-body leading-relaxed text-ink-muted">{doc.summary}</span>
                      <span className="mt-auto flex flex-wrap gap-1 pt-1">
                        {doc.covers.map((name) => (
                          <span key={name} className="rounded-full border border-hairline px-2 py-0.5 font-mono text-micro text-ink-subtle">
                            {name}
                          </span>
                        ))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
