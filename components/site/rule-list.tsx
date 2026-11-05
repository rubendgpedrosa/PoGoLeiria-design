import { designParagraph, designRules } from '@/lib/design/design'
import { InlineRun } from './markdown'

export function RuleList({ queries, title = 'Governing rule', limit = 2 }: { queries: string[]; title?: string; limit?: number }) {
  const rules = designRules(queries, limit)
  const fallback = rules.length === 0 ? designParagraph('New components belong') : null

  return (
    <aside className="border-l-2 border-ember pl-4">
      <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">{title}</p>
      {rules.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-2">
          {rules.map((rule, index) => (
            <li key={index} className="text-body leading-relaxed text-ink-label">
              “<InlineRun content={rule} />”
            </li>
          ))}
        </ul>
      ) : fallback ? (
        <ul className="mt-2 flex flex-col gap-2">
          <li className="text-body leading-relaxed text-ink-label">
            “<InlineRun content={fallback} />”
          </li>
        </ul>
      ) : (
        <p className="mt-2 text-body leading-relaxed text-ink-muted">No rule in DESIGN.md names this export.</p>
      )}
    </aside>
  )
}
