import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { PageShell } from '@/components/site/page-shell'

export default function NotFound() {
  return (
    <PageShell
      eyebrow="404 · Not found"
      title="No such page"
      lede="This address is not one of the design system sections. The navigation lists the seven that are."
    >
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-hairline bg-surface-raised px-4 text-body text-ink-label transition-colors hover:border-hairline-hover hover:text-ink-bright motion-reduce:transition-none"
      >
        <ArrowLeft aria-hidden="true" className="size-4 text-ember-bright" />
        Back to the overview
      </Link>
    </PageShell>
  )
}
