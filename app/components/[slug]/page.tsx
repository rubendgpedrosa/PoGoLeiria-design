import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, FileCode2 } from 'lucide-react'

import { ComponentDemo } from '@/components/demos/component-demos'
import { PageShell } from '@/components/site/page-shell'
import { RuleList } from '@/components/site/rule-list'
import { COMPONENT_DOCS, docBySlug } from '@/lib/design/component-docs'
import { componentSource } from '@/lib/design/design'

export const dynamicParams = false

export function generateStaticParams() {
  return COMPONENT_DOCS.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = docBySlug(slug)
  return doc ? { title: `${doc.title} · Components` } : {}
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = docBySlug(slug)
  if (!doc) notFound()

  const index = COMPONENT_DOCS.findIndex((entry) => entry.slug === doc.slug)
  const previous = index > 0 ? COMPONENT_DOCS[index - 1] : null
  const next = index < COMPONENT_DOCS.length - 1 ? COMPONENT_DOCS[index + 1] : null

  return (
    <PageShell
      eyebrow={`05 · Components · ${doc.group}`}
      title={doc.title}
      lede={doc.summary}
      meta={
        <div className="flex flex-wrap gap-1.5">
          {doc.covers.map((name) => (
            <code key={name} className="rounded-full border border-hairline px-2.5 py-1 font-mono text-label text-ink-label">
              {name}
            </code>
          ))}
        </div>
      }
    >
      <section aria-labelledby="examples">
        <h2 id="examples" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
          Live examples
        </h2>
        <div className="mt-4 rounded-xl border border-hairline bg-surface-raised p-4 lit sm:p-5">
          <ComponentDemo slug={doc.slug} />
        </div>
        <p className="mt-3 text-label leading-relaxed text-ink-subtle">
          Rendered by the vendored package at the pinned commit. Hover and pressed states are forced with classes where a static
          screenshot would otherwise hide them; focus can be checked with Tab.
        </p>
      </section>

      <section aria-labelledby="rules" className="mt-10">
        <h2 id="rules" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
          Governing rule
        </h2>
        <div className="mt-3">
          <RuleList queries={doc.ruleQueries} title="From DESIGN.md" limit={2} />
        </div>
      </section>

      {doc.props.length > 0 ? (
        <section aria-labelledby="props" className="mt-10">
          <h2 id="props" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
            Props
          </h2>
          <div className="mt-3 flex flex-col gap-6">
            {doc.props.map((table) => (
              <div key={table.title}>
                <h3 className="font-display text-title font-bold text-ink-bright">{table.title}</h3>
                <div className="mt-2 overflow-x-auto rounded-xl border border-hairline">
                  <table className="w-full min-w-[680px] border-collapse text-left">
                    <thead>
                      <tr className="bg-surface-raised">
                        <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Prop</th>
                        <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Type</th>
                        <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Default</th>
                        <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row) => (
                        <tr key={row.name} className="border-t border-hairline align-top">
                          <td className="px-3 py-3">
                            <code className="font-mono text-body font-semibold text-ink-bright">{row.name}</code>
                          </td>
                          <td className="max-w-[32ch] px-3 py-3">
                            <code className="break-words font-mono text-label text-ink-label">{row.type}</code>
                          </td>
                          <td className="px-3 py-3">
                            <code className="font-mono text-label text-ink-subtle">{row.defaultValue ?? '—'}</code>
                          </td>
                          <td className="px-3 py-3 text-label leading-relaxed text-ink-muted">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {doc.notes && doc.notes.length > 0 ? (
        <section aria-labelledby="notes" className="mt-10">
          <h2 id="notes" className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
            Notes
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {doc.notes.map((note) => (
              <li key={note} className="text-body leading-relaxed text-ink-label">
                {note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="source" className="mt-10">
        <h2 id="source" className="flex items-center gap-2 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
          <FileCode2 aria-hidden="true" className="size-4 text-ember-bright" />
          Source, read-only
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {doc.sourceFiles.map((file) => (
            <details key={file} className="group rounded-xl border border-hairline bg-surface-raised">
              <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-4 py-3 text-body text-ink-label marker:content-none">
                <span className="font-mono text-label text-ink-label">{file}</span>
                <span className="ml-auto text-label text-ink-subtle group-open:hidden">Show</span>
                <span className="ml-auto hidden text-label text-ink-subtle group-open:inline">Hide</span>
              </summary>
              <pre className="max-h-[32rem] overflow-auto border-t border-hairline bg-surface-sunken p-4 font-mono text-label leading-relaxed text-ink-label">
                <code>{componentSource(file)}</code>
              </pre>
            </details>
          ))}
        </div>
      </section>

      <nav aria-label="Component pages" className="mt-12 flex flex-wrap items-stretch justify-between gap-3 border-t border-hairline pt-5">
        {previous ? (
          <Link
            href={`/components/${previous.slug}`}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-hairline bg-surface-raised px-4 text-body text-ink-label transition-colors hover:border-hairline-hover hover:text-ink-bright motion-reduce:transition-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4 text-ink-subtle" />
            {previous.title}
          </Link>
        ) : (
          <Link
            href="/components"
            className="flex min-h-11 items-center gap-2 rounded-lg border border-hairline bg-surface-raised px-4 text-body text-ink-label transition-colors hover:border-hairline-hover hover:text-ink-bright motion-reduce:transition-none"
          >
            <ArrowLeft aria-hidden="true" className="size-4 text-ink-subtle" />
            All components
          </Link>
        )}
        {next ? (
          <Link
            href={`/components/${next.slug}`}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-hairline bg-surface-raised px-4 text-body text-ink-label transition-colors hover:border-hairline-hover hover:text-ink-bright motion-reduce:transition-none"
          >
            {next.title}
            <ArrowRight aria-hidden="true" className="size-4 text-ink-subtle" />
          </Link>
        ) : null}
      </nav>
    </PageShell>
  )
}
