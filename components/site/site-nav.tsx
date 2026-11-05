'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Layers, Palette, Ruler, Smartphone, SwatchBook, Type } from 'lucide-react'

const ITEMS = [
  { href: '/', label: 'Overview', icon: Compass },
  { href: '/colour', label: 'Colour', icon: Palette },
  { href: '/type', label: 'Type', icon: Type },
  { href: '/geometry', label: 'Geometry', icon: Ruler },
  { href: '/components', label: 'Components', icon: Layers },
  { href: '/domain-colours', label: 'Domain colours', icon: SwatchBook },
  { href: '/surfaces', label: 'Other surfaces', icon: Smartphone },
]

function isCurrent(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav({ sha }: { sha: string }) {
  const pathname = usePathname()

  return (
    <>
      <div className="sticky top-0 z-30 bg-background lg:hidden">
        <header className="flex items-center gap-3 border-b border-hairline px-5 py-3">
          <Link href="/" className="flex min-h-11 flex-col justify-center">
            <span className="text-figure font-black uppercase leading-none tracking-[-0.055em]">PoGoLeiria</span>
            <span className="mt-0.5 text-label text-ink-muted">Design system</span>
          </Link>
        </header>
        <nav aria-label="Design system sections" className="flex flex-wrap gap-1 border-b border-hairline px-3 py-2">
          {ITEMS.map((item) => {
            const current = isCurrent(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`flex min-h-11 shrink-0 items-center rounded-lg px-3 text-label font-semibold ${
                  current ? 'bg-surface-raised text-ink-bright' : 'text-ink-muted'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <nav
        aria-label="Design system sections"
        className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-hairline px-5 py-8 lg:flex xl:w-72"
      >
        <Link href="/" className="flex min-h-11 flex-col justify-center">
          <span className="text-figure-lg font-black uppercase leading-none tracking-[-0.055em]">PoGoLeiria</span>
          <span className="mt-1 text-label text-ink-muted">Design system</span>
        </Link>

        <ul className="mt-9 flex flex-col gap-1">
          {ITEMS.map((item, index) => {
            const current = isCurrent(pathname, item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 text-body transition-colors motion-reduce:transition-none ${
                    current
                      ? 'border-hairline bg-surface-raised text-ink-bright'
                      : 'border-transparent text-ink-muted hover:bg-surface-raised hover:text-ink-bright'
                  }`}
                >
                  <Icon aria-hidden="true" className={`size-4 ${current ? 'text-ember-bright' : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  <span className="font-display text-label tabular-nums text-ink-subtle">{String(index + 1).padStart(2, '0')}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto border-t border-hairline pt-4">
          <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Pinned source</p>
          <p className="mt-1 font-mono text-label text-ink-muted">{sha.slice(0, 7)}</p>
          <p className="mt-1 text-label leading-relaxed text-ink-subtle">
            packages/ui, DESIGN.md and the landing domain files, exported from the monorepo commit.
          </p>
        </div>
      </nav>
    </>
  )
}
