'use client'

import * as React from 'react'
import {
  AppShell,
  AppShellDesktop,
  AppShellMobile,
  AppSwitcher,
  BackLink,
  Badge,
  badgeVariants,
  Button,
  buttonVariants,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  CountDot,
  Dock,
  DockArea,
  DockButton,
  DockSearch,
  DockSeparator,
  EmptyState,
  Input,
  PageHeader,
  POGO_ROUTES,
  POGO_TOOLS,
  PillTabsList,
  PillTabsTrigger,
  PokedexIcon,
  POKEDEX_PUBLIC_ROUTE,
  Progress,
  SearchField,
  SectionLabel,
  SegmentedControl,
  Sidebar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabPill,
  TypeWash,
  parseQuestsSearch,
  questsSearchHref,
} from '@pogoleiria/ui'
import {
  Bell,
  ChevronDown,
  Gift,
  Grid2X2,
  Inbox,
  LayoutList,
  MapPin,
  Plus,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'

import type { ComponentSlug } from '@/lib/design/component-docs'

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline py-5 first:border-t-0 first:pt-0">
      <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
      {note ? <p className="mt-3 max-w-[70ch] text-label leading-relaxed text-ink-muted">{note}</p> : null}
    </div>
  )
}

function ButtonDemo() {
  return (
    <div>
      <Row label="Variants" note="Ember is the default action. Destructive is for what cannot be undone; the others step back without becoming a second palette.">
        <Button>Ember</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </Row>

      <Row label="Sizes" note="Every size keeps the 44px floor. The icon size is exactly 44×44, and an icon-only button needs an aria-label.">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add a filter">
          <Plus aria-hidden="true" />
        </Button>
      </Row>

      <Row label="States" note="Hover, pressed and focus are forced here with the classes the browser applies on those states, so the row shows them without a pointer.">
        <Button>Rest</Button>
        <Button className="bg-primary/90">Hover (forced)</Button>
        <Button className="scale-[0.97] brightness-125">Pressed (forced)</Button>
        <Button disabled>Disabled</Button>
        <Button className="outline-solid outline-2 outline-offset-2 outline-ember-bright">Focus (forced)</Button>
      </Row>

      <Row label="As a link" note="asChild hands the classes to the child, so navigation keeps a link’s semantics and middle-click behaviour.">
        <Button asChild>
          <a href="#button-demo">Open the map</a>
        </Button>
        <a
          href="#button-demo"
          className={buttonVariants({ variant: 'outline' })}
        >
          buttonVariants on a link
        </a>
      </Row>
    </div>
  )
}

function BadgeDemo() {
  return (
    <div>
      <Row label="Variants">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </Row>
      <Row label="With an icon and as a link">
        <Badge>
          <Sparkles aria-hidden="true" />
          Reward
        </Badge>
        <a href="#badge-demo" className={badgeVariants({ variant: 'outline' })}>
          badgeVariants on a link
        </a>
      </Row>
      <Row label="Not a count" note="A count on an icon is CountDot, and it is never gold: a count of matching rows is not a reward.">
        <span className="relative inline-flex size-11 items-center justify-center rounded-lg border border-hairline bg-surface-raised">
          <Bell aria-hidden="true" className="size-5 text-ink-label" />
          <CountDot count={3} label="3 unread" className="absolute -right-1 -top-1" />
        </span>
      </Row>
    </div>
  )
}

function CardDemo() {
  return (
    <div>
      <Row label="A complete card">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Raid hour</CardTitle>
            <CardDescription>Leiria · 18:00–19:00</CardDescription>
            <CardAction>
              <Badge variant="outline">Today</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-body leading-relaxed text-ink-label">
              Five tier-five raids on the castle loop, and one Mega. The card is a surface, not a second system: its slots carry the
              layout so every app arranges the same pieces.
            </p>
            <Progress value={62} aria-label="Route progress" className="mt-4" />
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Open route</Button>
            <Button size="sm" variant="outline">
              Share
            </Button>
          </CardFooter>
        </Card>
      </Row>
      <Row label="Phone and desktop radius" note="Phone cards are 24px; desktop steps to radius-xl. The control inside sits one step tighter than its surface.">
        <div className="w-full max-w-md rounded-2xl border border-hairline bg-surface-raised p-4 lit lg:rounded-xl">
          <p className="text-body text-ink-label">rounded-2xl on a phone, lg:rounded-xl on desktop</p>
        </div>
      </Row>
    </div>
  )
}

function InputDemo() {
  return (
    <div>
      <Row label="Default, filled and hint">
        <Input aria-label="Trainer name" placeholder="Trainer name" className="max-w-xs" />
        <Input aria-label="Friend code" defaultValue="1234 5678 9012" className="max-w-xs" />
      </Row>
      <Row label="Invalid and disabled">
        <Input aria-label="Invalid friend code" aria-invalid="true" defaultValue="0000" className="max-w-xs" />
        <Input aria-label="Disabled input" disabled placeholder="Disabled" className="max-w-xs" />
      </Row>
      <Row label="Focus (forced)" note="The real field gets the same 2px ember-bright outline from focus-visible.">
        <Input
          aria-label="Focused input"
          defaultValue="Focus is ember"
          className="max-w-xs border-ring outline-solid outline-2 outline-offset-2 outline-ember-bright"
        />
      </Row>
    </div>
  )
}

function SearchFieldDemo() {
  const [query, setQuery] = React.useState('')
  const [filled, setFilled] = React.useState('Shiny')

  return (
    <div>
      <Row label="Empty" note="A filled field, no frame at rest. Typing turns the frame ember and the magnifier bright.">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search quests"
          ariaLabel="Search quests"
          clearLabel="Clear search"
          className="w-full max-w-sm"
        />
      </Row>
      <Row label="With a query">
        <SearchField
          value={filled}
          onChange={setFilled}
          placeholder="Search quests"
          ariaLabel="Search quests, filled"
          clearLabel="Clear search"
          className="w-full max-w-sm"
        />
      </Row>
      <Row label="Disabled">
        <SearchField
          value=""
          onChange={() => undefined}
          placeholder="Unavailable"
          ariaLabel="Disabled search"
          clearLabel="Clear search"
          disabled
          className="w-full max-w-sm"
        />
      </Row>
    </div>
  )
}

function SegmentedControlDemo() {
  const [choice, setChoice] = React.useState('all')
  const options = [
    { id: 'all', label: 'Tudo' },
    { id: 'raids', label: 'Raids' },
    { id: 'quests', label: 'Quests' },
  ]

  return (
    <div>
      <Row label="Selection" note="The ember fill follows the same 8° join on every segment. State stays in aria-pressed; geometry belongs to the component and tokens.css.">
        <SegmentedControl className="w-full max-w-md">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={choice === option.id}
              onClick={() => setChoice(option.id)}
              className="px-4 text-body font-semibold text-ink-muted transition-colors hover:text-ink-bright motion-reduce:transition-none"
            >
              {option.label}
            </button>
          ))}
        </SegmentedControl>
      </Row>
      <Row label="As navigation">
        <SegmentedControl className="max-w-md" aria-label="Views">
          <a href="#segmented-demo" aria-current="page" className="px-4 text-body font-semibold">
            Mapa
          </a>
          <a href="#segmented-demo" className="px-4 text-body font-semibold text-ink-muted">
            Quests
          </a>
        </SegmentedControl>
      </Row>
    </div>
  )
}

function SectionLabelDemo() {
  return (
    <div className="max-w-lg">
      <Row label="Ambient">
        <SectionLabel>Active now</SectionLabel>
      </Row>
      <Row label="Live">
        <SectionLabel tone="live">Ends tonight</SectionLabel>
      </Row>
      <Row label="With a count">
        <div className="w-full">
          <SectionLabel tone="live" count="12">
            Raids
          </SectionLabel>
        </div>
      </Row>
    </div>
  )
}

function EmptyStateDemo() {
  return (
    <div>
      <Row label="With an action">
        <EmptyState
          title="No quests match"
          description="Try another reward type, or clear the filters to see every stop again."
          action={
            <Button size="sm" variant="outline">
              Clear filters
            </Button>
          }
          className="w-full max-w-md"
        />
      </Row>
      <Row label="Title only">
        <EmptyState title="Nothing here yet" className="w-full max-w-md" />
      </Row>
    </div>
  )
}

function CountDotDemo() {
  return (
    <div>
      <Row label="Counts" note="The number is decoration above 99 and stays out of the accessibility tree; the label carries the meaning.">
        <span className="relative inline-flex size-11 items-center justify-center rounded-lg border border-hairline bg-surface-raised">
          <Inbox aria-hidden="true" className="size-5 text-ink-label" />
          <CountDot count={2} label="2 pending requests" className="absolute -right-1 -top-1" />
        </span>
        <span className="relative inline-flex size-11 items-center justify-center rounded-lg border border-hairline bg-surface-raised">
          <Inbox aria-hidden="true" className="size-5 text-ink-label" />
          <CountDot count={120} label="120 pending requests" className="absolute -right-1 -top-1" />
        </span>
      </Row>
      <Row label="Neutral by rule" note="Ink-bright on a sunken surface. Gold is reserved for rewards and progress, never for a count.">
        <CountDot count={7} label="7 filters active" />
      </Row>
    </div>
  )
}

function ProgressDemo() {
  return (
    <div className="max-w-md">
      <Row label="Values">
        <div className="flex w-full flex-col gap-4">
          <div>
            <p className="text-label text-ink-muted">0%</p>
            <Progress value={0} aria-label="0 percent" className="mt-1" />
          </div>
          <div>
            <p className="text-label text-ink-muted">33%</p>
            <Progress value={33} aria-label="33 percent" className="mt-1" />
          </div>
          <div>
            <p className="text-label text-ink-muted">100%</p>
            <Progress value={100} aria-label="100 percent" className="mt-1" />
          </div>
        </div>
      </Row>
      <Row label="Colour" note="Progress defaults to a gold fill on a sunken track; consumers no longer override its colour.">
        <Progress value={75} aria-label="75 percent, reward progress" />
      </Row>
    </div>
  )
}

function TypeWashDemo() {
  return (
    <div>
      <Row label="Type washes" note="The wash is an RGB triplet, usually from washFor(). The tile is decorative; the name beside it carries the meaning.">
        <TypeWash wash="122 199 76" className="size-16 text-title text-ink-bright">
          Gr
        </TypeWash>
        <TypeWash wash="250 130 60" className="size-16 text-title text-ink-bright">
          Fi
        </TypeWash>
        <TypeWash wash="120 160 220" className="size-16 text-title text-ink-bright">
          Wa
        </TypeWash>
        <div className="flex items-center gap-2">
          <TypeWash wash="180 140 240" className="size-12 text-label text-ink-bright">
            Ps
          </TypeWash>
          <span className="text-body text-ink-label">Psychic</span>
        </div>
      </Row>
      <Row label="Breakout" note="With breakout, art stands a size larger than its tile and out of the top — the map-pin silhouette. This demo has no sprite, so the tile shows the option and the code shows the class.">
        <TypeWash wash="122 199 76" breakout className="size-16 text-title text-ink-bright">
          Gr
        </TypeWash>
        <code className="rounded-md border border-hairline bg-surface-raised px-2 py-1 font-mono text-label text-ink-label">
          .wash-tile--out
        </code>
      </Row>
    </div>
  )
}

function PokedexIconDemo() {
  return (
    <div>
      <Row label="Sizes" note="Drawn to sit among lucide’s 24px icons: 2px round stroke, no fill, and few marks because it is drawn at 18px.">
        <span className="flex flex-col items-center gap-2 text-ink-label">
          <PokedexIcon className="size-[18px]" />
          <span className="text-label">18px</span>
        </span>
        <span className="flex flex-col items-center gap-2 text-ink-bright">
          <PokedexIcon className="size-6" />
          <span className="text-label">24px</span>
        </span>
        <span className="flex flex-col items-center gap-2 text-ember-bright">
          <PokedexIcon className="size-8" />
          <span className="text-label">32px</span>
        </span>
      </Row>
    </div>
  )
}

function BackLinkDemo() {
  const [closed, setClosed] = React.useState(false)

  return (
    <div>
      <Row label="As a link">
        <BackLink href="#back-link-demo" label="Back to Quests" />
      </Row>
      <Row label="As a button, for a sheet" note="The same 44px, ChevronLeft and word, whichever element holds it.">
        <BackLink onClick={() => setClosed((value) => !value)} label={closed ? 'Closed' : 'Close sheet'} />
      </Row>
    </div>
  )
}

function TabsDemo() {
  return (
    <div>
      <Row label="Tabs" note="Radix tabs with a raised track. For primary, joined navigation the suite uses SegmentedControl instead.">
        <Tabs defaultValue="today" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This week</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="rounded-xl border border-hairline bg-surface-raised p-4 text-body text-ink-label">
            12 raids and 3 quests end before midnight.
          </TabsContent>
          <TabsContent value="week" className="rounded-xl border border-hairline bg-surface-raised p-4 text-body text-ink-label">
            44 raids across the week, with a raid hour on Thursday.
          </TabsContent>
          <TabsContent value="all" className="rounded-xl border border-hairline bg-surface-raised p-4 text-body text-ink-label">
            Everything the scanner currently knows about.
          </TabsContent>
        </Tabs>
      </Row>
    </div>
  )
}

function TabPillDemo() {
  return (
    <div>
      <Row label="Grid / list" note="The desktop view toggle: a sunken well, a hairline and an ember thumb, with the same 8° joins as the other segmented controls.">
        <Tabs defaultValue="grid" className="w-full max-w-md">
          <PillTabsList cols={2}>
            <PillTabsTrigger value="grid">
              <Grid2X2 aria-hidden="true" />
              Grid
            </PillTabsTrigger>
            <PillTabsTrigger value="list">
              <LayoutList aria-hidden="true" />
              List
            </PillTabsTrigger>
          </PillTabsList>
          <TabsContent value="grid" className="mt-3 rounded-xl border border-hairline bg-surface-raised p-4 text-body text-ink-label">
            A grid of cards.
          </TabsContent>
          <TabsContent value="list" className="mt-3 rounded-xl border border-hairline bg-surface-raised p-4 text-body text-ink-label">
            A list of rows.
          </TabsContent>
        </Tabs>
      </Row>
      <Row label="Plain track">
        <TabPill className="px-4 py-2 text-body text-ink-label">TabPill is the track; compose it when the tabs are not the standard pair.</TabPill>
      </Row>
    </div>
  )
}

function AppSwitcherDemo() {
  return (
    <div>
      <Row label="Docked, current tool" note="The current item is a label, not a link, and takes its tool’s accent. Everything else you touch stays ember.">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-hairline">
          <AppSwitcher items={POGO_ROUTES} current="map" ariaLabel="Tools, docked" />
        </div>
      </Row>
      <Row label="Desktop header">
        <div className="rounded-xl border border-hairline bg-surface-raised p-2">
          <AppSwitcher items={POGO_ROUTES} current="quests" ariaLabel="Tools, desktop" desktopHeader />
        </div>
      </Row>
      <Row label="Standalone URLs" note="POGO_TOOLS holds absolute addresses for the standalone tools; POGO_ROUTES holds the same three as routes inside the shell. Both live in the package so the switcher cannot say one thing in one app and another elsewhere.">
        <ul className="flex w-full flex-col gap-1">
          {POGO_TOOLS.map((tool) => (
            <li key={tool.id} className="flex items-baseline gap-2 text-label">
              <span className="w-16 shrink-0 font-semibold text-ink-label">{tool.label}</span>
              <code className="break-all font-mono text-ink-muted">{tool.href}</code>
            </li>
          ))}
        </ul>
      </Row>
    </div>
  )
}

function DockDemo() {
  const [query, setQuery] = React.useState('')
  return (
    <div>
      <Row label="The dock" note="It floats, so it takes --shadow-float and the lit edge. The page leaves room for it at the end of its list.">
        <div className="flex w-full justify-center rounded-xl border border-hairline bg-surface-sunken p-4">
          <Dock className="w-full max-w-md">
            <DockSearch
              value={query}
              onChange={setQuery}
              placeholder="Search quests"
              ariaLabel="Search quests in the dock"
              clearLabel="Clear search"
            />
            <DockSeparator />
            <DockButton aria-label="Filters">
              <SlidersHorizontal aria-hidden="true" />
            </DockButton>
            <DockButton tone="gold" aria-label="Rewards">
              <Gift aria-hidden="true" />
            </DockButton>
          </Dock>
        </div>
      </Row>
      <Row label="Placement and active state" note="DockArea is where the dock sits, over the foot of the tool’s area on phones. The active button is a flat ember fill.">
        <div className="relative h-52 w-full overflow-hidden rounded-xl border border-hairline bg-background">
          <p className="p-4 text-label text-ink-muted">The list runs under the dock.</p>
          <DockArea className="lg:flex">
            <Dock>
              <DockSearch
                value={query}
                onChange={setQuery}
                placeholder="Search quests"
                ariaLabel="Search quests in the placed dock"
                clearLabel="Clear search"
              />
              <DockSeparator />
              <DockButton active aria-label="Filters, active">
                <SlidersHorizontal aria-hidden="true" />
              </DockButton>
              <DockButton aria-label="More">
                <ChevronDown aria-hidden="true" />
              </DockButton>
            </Dock>
          </DockArea>
        </div>
      </Row>
    </div>
  )
}

function AppShellDemo() {
  return (
    <div>
      <Row label="The shell" note="The <main> landmark with its two layouts. The phone column is hidden from lg, where the sidebar layout takes over. This demo constrains the height; in the product it is 100dvh.">
        <div className="h-80 w-full overflow-hidden rounded-xl border border-hairline">
          <AppShell className="h-full">
            <AppShellMobile>
              <p className="font-display text-figure font-extrabold text-ink-bright">Quests</p>
              <p className="mt-2 text-body leading-relaxed text-ink-label">
                A single column with safe-area padding, scrolling inside the shell.
              </p>
            </AppShellMobile>
            <AppShellDesktop>
              <Sidebar className="w-56 p-4">
                <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Filters</p>
                <ul className="mt-3 flex flex-col gap-2 text-body text-ink-label">
                  <li>Recompensas</li>
                  <li>Categorias</li>
                  <li>Limpar filtros</li>
                </ul>
              </Sidebar>
              <div className="flex-1 p-4">
                <p className="font-display text-figure font-extrabold text-ink-bright">Desktop layout</p>
                <p className="mt-2 max-w-[60ch] text-body leading-relaxed text-ink-label">
                  Sidebar plus content, from lg up. The shell carries no painted texture and no bottom fade.
                </p>
              </div>
            </AppShellDesktop>
          </AppShell>
        </div>
      </Row>
    </div>
  )
}

function SidebarDemo() {
  return (
    <div>
      <Row label="The desktop rail" note="It holds a tool’s own filters and progress, not global navigation. The switcher owns navigation.">
        <div className="h-72 w-full max-w-sm overflow-hidden rounded-xl border border-hairline">
          <Sidebar className="w-full">
            <p className="font-display text-title font-bold text-ink-bright">Pokédex</p>
            <p className="mt-4 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Mostrar</p>
            <ul className="mt-2 flex flex-col gap-2 text-body text-ink-label">
              <li>Coleção</li>
              <li>Megas</li>
              <li>Costumes</li>
            </ul>
            <p className="mt-6 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Progresso</p>
            <Progress value={68} aria-label="Collection progress" className="mt-2" />
          </Sidebar>
        </div>
      </Row>
    </div>
  )
}

function PageHeaderDemo() {
  return (
    <div>
      <Row label="A phone header" note="The title row is 44px tall whatever it holds. On a phone the brand sits behind it — this demo has no --brand-mark, so there is no artwork to show.">
        <div className="relative w-full overflow-hidden rounded-xl border border-hairline bg-background p-4">
          <PageHeader
            title="Quest"
            meta="Leiria · 12 active"
            logo={<MapPin aria-hidden="true" className="size-5 text-ember-bright" />}
            trailing={
              <Button size="icon" variant="ghost" aria-label="Open filters">
                <SlidersHorizontal aria-hidden="true" />
              </Button>
            }
          >
            <Progress value={60} aria-label="Collection progress" className="mt-3" />
          </PageHeader>
          <p className="mt-4 text-body text-ink-label">The page content follows the header.</p>
        </div>
      </Row>
    </div>
  )
}

function UtilitiesDemo() {
  const merged = cn('px-2 text-body', 'text-ink-muted', 'text-ink-bright')
  const parsed = parseQuestsSearch('?q=shiny&zona=leiria')
  const href = questsSearchHref('shiny', 'leiria')

  return (
    <div>
      <Row label="cn()" note="clsx plus tailwind-merge, extended so text-body is read as a font size and not dropped when a text colour sits beside it in the same call.">
        <pre className="w-full overflow-x-auto rounded-xl border border-hairline bg-surface-sunken p-4 font-mono text-label text-ink-label">
          <code>{`cn('px-2 text-body', 'text-ink-muted', 'text-ink-bright')\n→ ${merged}`}</code>
        </pre>
      </Row>
      <Row label="Route helpers">
        <dl className="grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-surface-raised p-3">
            <dt className="font-mono text-label text-ink-subtle">POKEDEX_PUBLIC_ROUTE</dt>
            <dd className="mt-1 font-mono text-body text-ink-bright">{POKEDEX_PUBLIC_ROUTE}</dd>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-raised p-3">
            <dt className="font-mono text-label text-ink-subtle">questsSearchHref(&apos;shiny&apos;, &apos;leiria&apos;)</dt>
            <dd className="mt-1 break-all font-mono text-body text-ink-bright">{href}</dd>
          </div>
          <div className="rounded-xl border border-hairline bg-surface-raised p-3 sm:col-span-2">
            <dt className="font-mono text-label text-ink-subtle">parseQuestsSearch(&apos;?q=shiny&amp;zona=leiria&apos;)</dt>
            <dd className="mt-1 font-mono text-body text-ink-bright">{parsed ? JSON.stringify(parsed) : 'null'}</dd>
          </div>
        </dl>
      </Row>
    </div>
  )
}

const DEMOS: Record<ComponentSlug, React.ComponentType> = {
  button: ButtonDemo,
  badge: BadgeDemo,
  card: CardDemo,
  input: InputDemo,
  'search-field': SearchFieldDemo,
  'segmented-control': SegmentedControlDemo,
  'section-label': SectionLabelDemo,
  'empty-state': EmptyStateDemo,
  'count-dot': CountDotDemo,
  progress: ProgressDemo,
  'type-wash': TypeWashDemo,
  'pokedex-icon': PokedexIconDemo,
  'back-link': BackLinkDemo,
  tabs: TabsDemo,
  'tab-pill': TabPillDemo,
  'app-switcher': AppSwitcherDemo,
  dock: DockDemo,
  'app-shell': AppShellDemo,
  sidebar: SidebarDemo,
  'page-header': PageHeaderDemo,
  utilities: UtilitiesDemo,
}

export function ComponentDemo({ slug }: { slug: ComponentSlug }) {
  const Demo = DEMOS[slug]
  return <Demo />
}
