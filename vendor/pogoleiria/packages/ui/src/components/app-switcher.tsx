import * as React from 'react';
import { Binoculars, MapPin } from 'lucide-react';
import { CountDot } from './count-dot';
import { PokedexIcon } from './pokedex-icon';

import { cn } from '../lib/utils';

type AppSwitcherItem = {
  /** Stable id for the tool. The active one is matched against `current`. */
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  /** A count on the icon, with its meaning for screen readers ("2 pedidos por aprovar"). */
  badge?: { count: number; label: string };
};

type AppSwitcherProps = {
  items: AppSwitcherItem[];
  /** `id` of the tool being rendered right now. */
  current: string;
  /** Accessible name for the <nav>. */
  ariaLabel: string;
  /**
   * Component used for same-origin hrefs — pass `next/link` from a shell that
   * serves the tools as routes and the switch becomes client-side, with no
   * reload and no reboot of React.
   *
   * It's a prop rather than an import because this package deliberately has no
   * `next` dependency; an href that isn't a root-relative path always renders
   * a plain anchor, since a router can't soft-navigate across origins anyway.
   */
  linkComponent?: React.ElementType;
  /**
   * Docked, the bar is a row in the layout and takes its own height, so it
   * can't cover anything. Floating, it sits over the content.
   *
   * Docked is the right default for a shell whose content is somebody else's
   * full-screen application: a floating bar over a map lands on the map's own
   * controls, and there's no way to know from out here where those are.
   */
  floating?: boolean;
  /** Compact horizontal links at lg+, inside the shell's branded desktop header. */
  desktopHeader?: boolean;
  className?: string;
};

/** Each tool's accent (tokens.css), for its switcher item when current. */
const TOOL_ACCENT: Record<string, string> = {
  home: 'var(--color-tool-home)',
  map: 'var(--color-tool-map)',
  quests: 'var(--color-tool-quests)',
  pokedex: 'var(--color-tool-pokedex)',
};

/**
 * The bottom switcher, shared by every tool in the suite.
 *
 * PRODUCT.md asks for "one identity, three tools — a player switching apps
 * should never feel lost", and the apps did the opposite. dex pinned a bottom
 * pill holding its *filters*, so the one persistent control on the screen
 * navigated nowhere. quests had no bottom bar at all: its BottomNav was
 * written, styled, exported and imported by nothing, which left the area map
 * reachable only by tapping an individual quest.
 *
 * So this navigates between the tools and nothing else. Per-app filters belong
 * at the top of the app, next to the search field they narrow.
 *
 * The current tool renders as a <span>: it's a label, not a link to where you
 * already are. `aria-current="page"` marks it for assistive tech.
 */
function AppSwitcher({
  items,
  current,
  ariaLabel,
  linkComponent,
  floating = false,
  desktopHeader = false,
  className,
}: AppSwitcherProps) {
  const InternalLink = linkComponent ?? 'a';
  return (
    <nav
      data-slot="app-switcher"
      aria-label={ariaLabel}
      className={cn(
        'grid gap-1 border-hairline bg-surface-raised',
        floating
          ? 'fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 mx-auto max-w-md rounded-xl border p-1.5 shadow-float backdrop-blur-2xl lg:hidden'
          : 'w-full shrink-0 border-t p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]',
        desktopHeader && 'lg:w-auto lg:border',
        className
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const isCurrent = item.id === current;
        const content = (
          <>
            <span className={cn('relative [&_svg]:size-5', desktopHeader && 'lg:flex lg:size-8 lg:items-center lg:justify-center lg:rounded-lg')}>
              {item.icon}
              {item.badge ? <CountDot count={item.badge.count} label={item.badge.label} className="absolute -right-2.5 -top-1.5" /> : null}
            </span>{' '}
            <span>{item.label}</span>
          </>
        );

        const shared = cn(
          'relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg border border-transparent px-2 py-1 text-label font-semibold transition-[color,background-color,border-color,transform] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-bright',
          desktopHeader && 'lg:flex-row lg:gap-2 lg:px-3 lg:py-1.5 lg:text-body'
        );

        if (isCurrent) {
          return (
            <span
              key={item.id}
              data-slot="app-switcher-item"
              aria-current="page"
              className={cn(shared, 'bg-[color-mix(in_oklab,var(--tool)_16%,transparent)] text-[var(--tool)]')}
              style={{ '--tool': TOOL_ACCENT[item.id] ?? 'var(--color-tool-home)' } as React.CSSProperties}
            >
              {content}
            </span>
          );
        }

        const Comp = item.href.startsWith('/') ? InternalLink : 'a';

        return (
          <Comp
            key={item.id}
            data-slot="app-switcher-item"
            href={item.href}
            className={cn(shared, 'text-ink-muted hover:border-hairline hover:bg-surface-hover hover:text-ink-hover active:scale-[0.96] active:bg-surface-hover motion-reduce:active:scale-100')}
          >
            {content}
          </Comp>
        );
      })}
    </nav>
  );
}

/**
 * The four tools, in the order a player meets them.
 *
 * These URLs live here rather than in each app so the switcher can't say one
 * thing in quests and another in dex. The landing page's own tool grid is the
 * one other place they appear.
 *
 * All three live in the shell now; no tool has a hostname of its own.
 */
const POGO_TOOLS: AppSwitcherItem[] = [
  { id: 'map', label: 'Mapa', href: 'https://pogoleiria.pt', icon: <MapPin /> },
  { id: 'quests', label: 'Quests', href: 'https://pogoleiria.pt/quests', icon: <Binoculars /> },
  { id: 'pokedex', label: 'Pokédex', href: 'https://pogoleiria.pt/pokedex', icon: <PokedexIcon /> },
];

/**
 * The same three tools as routes inside the shell, where they're one app and
 * the switch costs no reload. Kept beside POGO_TOOLS so the two can't drift on
 * order, labels or icons while the standalone apps are still deployed.
 */
const POGO_ROUTES: AppSwitcherItem[] = [
  { id: 'map', label: 'Mapa', href: '/', icon: <MapPin /> },
  { id: 'quests', label: 'Quests', href: '/quests', icon: <Binoculars /> },
  { id: 'pokedex', label: 'Pokédex', href: '/pokedex', icon: <PokedexIcon /> },
];

export { AppSwitcher, POGO_TOOLS, POGO_ROUTES };
export type { AppSwitcherItem };
