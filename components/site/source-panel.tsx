import { FileCode2 } from 'lucide-react'

import { componentSource } from '@/lib/design/design'

/** Read-only source panels for vendored files. Always collapsed by default. */
export function SourcePanel({ files }: { files: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="flex items-center gap-2 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">
        <FileCode2 aria-hidden="true" className="size-4 text-ember-bright" />
        Source, read-only
      </h3>
      {files.map((file) => (
        <details key={file} className="group rounded-xl border border-hairline bg-surface-raised">
          <summary className="flex min-h-11 cursor-pointer items-center gap-2 px-4 py-3 marker:content-none">
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
  )
}
