import type { Block, Inline } from '@/lib/design/markdown'

/**
 * Renders the parsed DESIGN.md blocks. Links in DESIGN.md point at monorepo
 * files that have no public address, so they are shown with their target as a
 * title rather than as dead links.
 */
export function InlineRun({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((node, index) => {
        switch (node.type) {
          case 'text':
            return <span key={index}>{node.text}</span>
          case 'code':
            return (
              <code
                key={index}
                className="rounded-md border border-hairline bg-surface-raised px-1.5 py-0.5 font-mono text-label text-ink-label"
              >
                {node.text}
              </code>
            )
          case 'strong':
            return (
              <strong key={index} className="font-semibold text-ink-bright">
                <InlineRun content={node.children} />
              </strong>
            )
          case 'em':
            return (
              <em key={index} className="italic">
                <InlineRun content={node.children} />
              </em>
            )
          case 'link':
            return (
              <span
                key={index}
                title={`Monorepo reference: ${node.href}`}
                className="text-ink-label underline decoration-hairline-active underline-offset-2"
              >
                <InlineRun content={node.children} />
              </span>
            )
        }
      })}
    </>
  )
}

export function Markdown({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level <= 1) return null
          if (block.level === 2) {
            return (
              <h3
                key={index}
                id={block.id}
                className="mt-2 scroll-mt-24 font-display text-figure font-extrabold tracking-[-0.02em] text-ink-bright"
              >
                <InlineRun content={block.content} />
              </h3>
            )
          }
          return (
            <h4 key={index} className="mt-1 font-display text-title font-bold tracking-[-0.02em] text-ink-bright">
              <InlineRun content={block.content} />
            </h4>
          )
        }

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="max-w-[70ch] text-body leading-relaxed text-ink-label">
              <InlineRun content={block.content} />
            </p>
          )
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag key={index} className="flex max-w-[72ch] list-none flex-col gap-3">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`relative pl-5 text-body leading-relaxed text-ink-label ${
                    block.ordered ? '' : 'before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-hairline-active'
                  }`}
                >
                  {block.ordered ? (
                    <span className="mr-2 font-display text-label font-bold tabular-nums text-ink-subtle">{itemIndex + 1}.</span>
                  ) : null}
                  <InlineRun content={item} />
                </li>
              ))}
            </ListTag>
          )
        }

        return (
          <pre
            key={index}
            className="overflow-x-auto rounded-xl border border-hairline bg-surface-sunken p-4 font-mono text-label leading-relaxed text-ink-label"
          >
            <code>{block.text}</code>
          </pre>
        )
      })}
    </div>
  )
}
