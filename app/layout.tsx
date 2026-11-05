import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'

import { SiteNav } from '@/components/site/site-nav'
import { vendorSha } from '@/lib/source'

import './globals.css'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' })
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })

export const metadata: Metadata = {
  title: { default: 'PoGoLeiria design system', template: 'PoGoLeiria design system · %s' },
  description: 'The single source of truth for the PoGoLeiria design language and components.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sha = vendorSha()

  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable}`}>
      <body className="min-h-[100dvh]">
        <a
          href="#main-content"
          className="sr-only rounded-lg border border-hairline bg-surface-raised px-4 py-3 text-body text-ink-bright focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col lg:flex-row">
          <SiteNav sha={sha} />
          <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-5 pb-24 pt-5 outline-none sm:px-8 lg:px-12 lg:pt-10">
            {children}
            <footer className="mx-auto mt-16 w-full max-w-5xl border-t border-hairline pt-4 text-label leading-relaxed text-ink-subtle">
              Generated from the pinned monorepo commit <span className="font-mono text-ink-muted">{sha.slice(0, 7)}</span>:
              tokens.css, DESIGN.md, apps/landing’s type and domain files and @pogoleiria/ui.
            </footer>
          </main>
        </div>
      </body>
    </html>
  )
}
