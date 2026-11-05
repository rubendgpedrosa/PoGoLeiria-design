/**
 * The component catalogue.
 *
 * This is documentation *metadata* only: titles, the exports each page owns,
 * hand-written props tables (the package has no extracted API docs) and the
 * DESIGN.md queries that print the governing rule. Every example itself is
 * rendered live from the vendored package in components/demos.
 *
 * tests/coverage.test.ts proves that every value exported by
 * packages/ui/src/index.ts is in one of these `covers` lists.
 */

export const COMPONENT_SLUGS = [
  'button',
  'badge',
  'card',
  'input',
  'search-field',
  'segmented-control',
  'section-label',
  'empty-state',
  'count-dot',
  'progress',
  'type-wash',
  'pokedex-icon',
  'back-link',
  'tabs',
  'tab-pill',
  'app-switcher',
  'dock',
  'app-shell',
  'sidebar',
  'page-header',
  'utilities',
] as const

export type ComponentSlug = (typeof COMPONENT_SLUGS)[number]

export const COMPONENT_GROUPS = ['Actions', 'Forms', 'Content', 'Navigation', 'Layout', 'Utilities'] as const
export type ComponentGroup = (typeof COMPONENT_GROUPS)[number]

export type PropRow = { name: string; type: string; defaultValue?: string; description: string }
export type PropTable = { title: string; rows: PropRow[] }

export type ComponentDoc = {
  slug: ComponentSlug
  title: string
  group: ComponentGroup
  /** Value exports from @pogoleiria/ui that this page documents. */
  covers: string[]
  summary: string
  props: PropTable[]
  /** Substrings searched in DESIGN.md's bullets; the matched text is rendered. */
  ruleQueries: string[]
  /** Vendored files shown read-only under the example. */
  sourceFiles: string[]
  notes?: string[]
}

export const COMPONENT_DOCS: ComponentDoc[] = [
  {
    slug: 'button',
    title: 'Button',
    group: 'Actions',
    covers: ['Button', 'buttonVariants'],
    summary:
      'The suite’s action. Six variants, four sizes, a 44px minimum target and the one ember focus ring. `buttonVariants` is the cva function behind both the component and link-shaped buttons.',
    props: [
      {
        title: 'Button',
        rows: [
          { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", defaultValue: "'default'", description: 'Ember is what you touch; destructive is irreversible or invalid.' },
          { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'All sizes keep a 44px minimum; icon is exactly 44×44.' },
          { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Renders the child element (usually a link) with the button classes.' },
          { name: 'disabled', type: 'boolean', description: 'Native disabled state: dimmed and non-interactive.' },
          { name: 'className', type: 'string', description: 'Merged through cn(), so a later utility wins.' },
        ],
      },
    ],
    ruleQueries: ['Standalone secondary buttons are `Button outline`', 'Use `Button`, `Input`, `SearchField`', 'One focus treatment'],
    sourceFiles: ['packages/ui/src/components/button.tsx'],
  },
  {
    slug: 'badge',
    title: 'Badge',
    group: 'Actions',
    covers: ['Badge', 'badgeVariants'],
    summary:
      'A small inline label, not a count on an icon (that is CountDot). Four variants, a full-radius pill, and a 2px offset focus ring.',
    props: [
      {
        title: 'Badge',
        rows: [
          { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", defaultValue: "'default'", description: 'Outline keeps the page surface and draws a hairline.' },
          { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Renders a link or other element with the badge classes.' },
          { name: 'className', type: 'string', description: 'Merged through cn().' },
        ],
      },
    ],
    ruleQueries: ['Prefer `Button`, `Input`, `SearchField`, `Tabs`, `Badge`', 'One focus treatment'],
    sourceFiles: ['packages/ui/src/components/badge.tsx'],
  },
  {
    slug: 'card',
    title: 'Card',
    group: 'Content',
    covers: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardAction', 'CardContent', 'CardFooter'],
    summary:
      'A panel with a header slot, an action pinned opposite the title, content and a footer. The card radius steps up on desktop; the pieces are slots, not a second system.',
    props: [
      {
        title: 'Card family',
        rows: [
          { name: 'Card', type: "React.ComponentProps<'div'>", description: 'The surface: bg-card, hairline, rounded-xl.' },
          { name: 'CardHeader', type: "React.ComponentProps<'div'>", description: 'Two-row header grid with an optional CardAction column.' },
          { name: 'CardTitle', type: 'React.ComponentProps<"div">', description: 'Semibold title, leading-none.' },
          { name: 'CardDescription', type: 'React.ComponentProps<"div">', description: 'Supporting copy in ink-muted at label size.' },
          { name: 'CardAction', type: 'React.ComponentProps<"div">', description: 'Top-right slot spanning both header rows.' },
          { name: 'CardContent', type: 'React.ComponentProps<"div">', description: 'Padded body; the parent owns the vertical rhythm.' },
          { name: 'CardFooter', type: 'React.ComponentProps<"div">', description: 'Row for the card’s trailing actions.' },
        ],
      },
    ],
    ruleQueries: ['cards and the desktop navigation container use `radius-xl`', 'Phone cards are 24px'],
    sourceFiles: ['packages/ui/src/components/card.tsx'],
  },
  {
    slug: 'input',
    title: 'Input',
    group: 'Forms',
    covers: ['Input'],
    summary:
      'The base text field. 48px tall, the control radius, a visible focus border and an invalid state that switches to destructive.',
    props: [
      {
        title: 'Input',
        rows: [
          { name: 'type', type: 'string', description: 'Any native input type; search inputs share this primitive.' },
          { name: 'aria-invalid', type: 'boolean', description: 'Turns the border destructive.' },
          { name: 'disabled', type: 'boolean', description: 'Dimmed and non-interactive.' },
          { name: 'className', type: 'string', description: 'Merged through cn().' },
        ],
      },
    ],
    ruleQueries: ['Prefer `Button`, `Input`, `SearchField`', 'One focus treatment'],
    sourceFiles: ['packages/ui/src/components/input.tsx'],
  },
  {
    slug: 'search-field',
    title: 'SearchField',
    group: 'Forms',
    covers: ['SearchField'],
    summary:
      'The shared search box: a filled field with no frame at rest, an ember frame while typing, and a clear button that appears only for a query. It draws its own focus treatment, so the shell’s global outline is explicitly excluded.',
    props: [
      {
        title: 'SearchField',
        rows: [
          { name: 'value', type: 'string', description: 'Controlled query.' },
          { name: 'onChange', type: '(value: string) => void', description: 'Called with the new value, not the event.' },
          { name: 'placeholder', type: 'string', description: 'Visible when empty.' },
          { name: 'ariaLabel', type: 'string', description: 'Required accessible name; the visual label is icon-only.' },
          { name: 'clearLabel', type: 'string', description: 'Required accessible name for the clear button.' },
          { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the clear button.' },
        ],
      },
    ],
    ruleQueries: ['Search fields, textareas'],
    sourceFiles: ['packages/ui/src/components/search-field.tsx'],
    notes: [
      'DESIGN.md names the field’s geometry alongside inputs, textareas and menu rows; the focus rule is implemented in tokens.css, which excludes [data-slot="search-field"] from the shell outline so the field draws its own frame-level ring.',
    ],
  },
  {
    slug: 'segmented-control',
    title: 'SegmentedControl',
    group: 'Forms',
    covers: ['SegmentedControl'],
    summary:
      'Joined choices with the owner’s 8° seam: level labels, a single ember fill on the selected segment, and the semantics of whatever each child already is (button, link or Radix trigger).',
    props: [
      {
        title: 'SegmentedControl',
        rows: [
          { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Wraps an existing element (a nav or Radix tablist) instead of adding a div.' },
          { name: 'columns', type: 'number', description: 'Equal-width grid; omitted for choices sized to their labels.' },
          { name: 'children', type: 'React.ReactNode', description: 'Each child becomes one segment; state stays in aria-current/aria-pressed/data-state.' },
        ],
      },
    ],
    ruleQueries: ['Joined choices use `SegmentedControl`'],
    sourceFiles: ['packages/ui/src/components/segmented-control.tsx'],
  },
  {
    slug: 'section-label',
    title: 'SectionLabel',
    group: 'Content',
    covers: ['SectionLabel'],
    summary:
      'The label above a list, at two named levels: ambient (10px, tracked capitals, ink-subtle) for what will still be true tonight, live (display face, figure size, ink-bright) for what expires. An optional count sits opposite in the display face.',
    props: [
      {
        title: 'SectionLabel',
        rows: [
          { name: 'tone', type: "'ambient' | 'live'", defaultValue: "'ambient'", description: 'Case and colour carry the two levels.' },
          { name: 'count', type: 'React.ReactNode', description: 'Optional figure opposite the label, set in the display face with tabular-nums.' },
          { name: 'children', type: 'React.ReactNode', description: 'The label text. Capitalisation is applied only by the ambient tone.' },
        ],
      },
    ],
    ruleQueries: ['Section labels carry two levels', '`SectionLabel` carries the same two named levels'],
    sourceFiles: ['packages/ui/src/components/section-label.tsx'],
  },
  {
    slug: 'empty-state',
    title: 'EmptyState',
    group: 'Content',
    covers: ['EmptyState'],
    summary:
      'A shared empty result: title, optional description and action, on a dashed sunken panel. The title is never smaller than the description.',
    props: [
      {
        title: 'EmptyState',
        rows: [
          { name: 'title', type: 'React.ReactNode', description: 'What is empty. Body-size and semibold, in ink-bright.' },
          { name: 'description', type: 'React.ReactNode', description: 'Optional supporting line, label size in ink-muted.' },
          { name: 'action', type: 'React.ReactNode', description: 'Optional way forward, usually a Button.' },
        ],
      },
    ],
    ruleQueries: ['title is never smaller'],
    sourceFiles: ['packages/ui/src/components/empty-state.tsx'],
  },
  {
    slug: 'count-dot',
    title: 'CountDot',
    group: 'Content',
    covers: ['CountDot'],
    summary:
      'A count pinned to an icon. Neutral by owner decision — a count is not a reward, so it is never gold. The number is decoration; the label carries the meaning for screen readers.',
    props: [
      {
        title: 'CountDot',
        rows: [
          { name: 'count', type: 'number', description: 'Rendered as-is to 99, then “99+”. Clamped visually only; the accessible label is the truth.' },
          { name: 'label', type: 'string', description: 'Required meaning in words, e.g. “2 trade requests”.' },
          { name: 'className', type: 'string', description: 'Positioning is the caller’s (absolute pin).' },
        ],
      },
    ],
    ruleQueries: ['a count on an icon is `CountDot`', 'Counts are `ink-label`'],
    sourceFiles: ['packages/ui/src/components/count-dot.tsx'],
  },
  {
    slug: 'progress',
    title: 'Progress',
    group: 'Content',
    covers: ['Progress'],
    summary:
      'A gold fill on a sunken track, and consumers no longer override its colour. Gold means progress toward a reward; an indeterminate spinner is a different idiom.',
    props: [
      {
        title: 'Progress',
        rows: [
          { name: 'value', type: 'number | null', description: '0–100. Null makes the indicator indeterminate.' },
          { name: 'max', type: 'number', defaultValue: '100', description: 'Radix Root maximum.' },
          { name: 'getValueLabel', type: '(value, max) => string', description: 'Accessible value text when the default is not enough.' },
        ],
      },
    ],
    ruleQueries: ['**`Progress` defaults to a gold fill'],
    sourceFiles: ['packages/ui/src/components/progress.tsx'],
  },
  {
    slug: 'type-wash',
    title: 'TypeWash',
    group: 'Content',
    covers: ['TypeWash'],
    summary:
      'A Pokémon’s art on a glow of its type colour. `wash` is an RGB triplet from @pogoleiria/pokemon’s washFor(); the tile is decorative, so the name beside it carries the meaning.',
    props: [
      {
        title: 'TypeWash',
        rows: [
          { name: 'wash', type: 'string', description: 'RGB triplet such as "122 199 76"; set as the --wash custom property.' },
          { name: 'breakout', type: 'boolean', defaultValue: 'false', description: 'Lets art stand out of the tile’s top, a size larger (the map pin idiom).' },
          { name: 'className', type: 'string', description: 'Size and corners are the caller’s: a 52px list tile or a 120px profile tile.' },
        ],
      },
    ],
    ruleQueries: ['Pokémon-type', 'domain data'],
    sourceFiles: ['packages/ui/src/components/type-wash.tsx'],
  },
  {
    slug: 'pokedex-icon',
    title: 'PokedexIcon',
    group: 'Content',
    covers: ['PokedexIcon'],
    summary:
      'The Pokédex drawn to sit among lucide’s 24px grid: 2px round stroke, no fill, a device closed. Used by the switcher, side menu and dock, at 18px.',
    props: [
      {
        title: 'PokedexIcon',
        rows: [{ name: 'className', type: 'string', description: 'Size and colour; the SVG inherits currentColor.' }],
      },
    ],
    ruleQueries: ['Icons are lucide'],
    sourceFiles: ['packages/ui/src/components/pokedex-icon.tsx'],
  },
  {
    slug: 'back-link',
    title: 'BackLink',
    group: 'Navigation',
    covers: ['BackLink'],
    summary:
      'The one back affordance: ChevronLeft and a word, 44px tall, ink-label. An href renders a link; onClick renders a button for a sheet.',
    props: [
      {
        title: 'BackLink',
        rows: [
          { name: 'href', type: 'string', description: 'Renders an <a>; omit to render a button.' },
          { name: 'onClick', type: '() => void', description: 'Renders a <button> when given without href.' },
          { name: 'label', type: 'React.ReactNode', description: 'The visible word, always required — an unlabelled arrow is a guess.' },
        ],
      },
    ],
    ruleQueries: ['`BackLink` is the one back affordance'],
    sourceFiles: ['packages/ui/src/components/back-link.tsx'],
  },
  {
    slug: 'tabs',
    title: 'Tabs',
    group: 'Navigation',
    covers: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    summary:
      'Radix tabs with a raised 44px list and a background-filled active trigger. For joined primary navigation the suite uses SegmentedControl instead; Tabs is the local, in-panel choice.',
    props: [
      {
        title: 'Tabs family',
        rows: [
          { name: 'Tabs', type: 'Radix Tabs.Root props', description: 'value / defaultValue / onValueChange.' },
          { name: 'TabsList', type: 'Radix Tabs.List props', description: 'The raised track.' },
          { name: 'TabsTrigger', type: 'Radix Tabs.Trigger props', description: 'One tab; active state comes from data-state.' },
          { name: 'TabsContent', type: 'Radix Tabs.Content props', description: 'The panel.' },
        ],
      },
    ],
    ruleQueries: ['Prefer `Button`, `Input`, `SearchField`, `Tabs`', 'Use `primary` for actions and selected state'],
    sourceFiles: ['packages/ui/src/components/tabs.tsx'],
  },
  {
    slug: 'tab-pill',
    title: 'TabPill',
    group: 'Navigation',
    covers: ['TabPill', 'PillTabsList', 'PillTabsTrigger'],
    summary:
      'The segmented container used for the desktop view toggle and filter tabs: a sunken well, a hairline and an ember thumb, sharing SegmentedControl’s 8° joins.',
    props: [
      {
        title: 'TabPill family',
        rows: [
          { name: 'TabPill', type: "React.ComponentProps<'div'>", description: 'A rounded track for any content.' },
          { name: 'PillTabsList', type: "TabsList props & { cols: 2 | 3 | 5 | 6 }", description: 'Equal-width tabs with the shared join geometry.' },
          { name: 'PillTabsTrigger', type: 'TabsTrigger props', description: 'Trigger with the canonical active treatment.' },
        ],
      },
    ],
    ruleQueries: ['Joined choices use `SegmentedControl`', 'the same 8° joins'],
    sourceFiles: ['packages/ui/src/components/tab-pill.tsx'],
  },
  {
    slug: 'app-switcher',
    title: 'AppSwitcher',
    group: 'Navigation',
    covers: ['AppSwitcher', 'POGO_TOOLS', 'POGO_ROUTES'],
    summary:
      'Navigation between the three tools, and nothing else goes in it. Docked in a shell, floating over content, or compact in a desktop header. The current item takes its tool’s accent; everything else you touch stays ember.',
    props: [
      {
        title: 'AppSwitcher',
        rows: [
          { name: 'items', type: 'AppSwitcherItem[]', description: 'In order: label, href, icon and an optional badge { count, label }.' },
          { name: 'current', type: 'string', description: 'id of the tool being rendered; that item becomes a label with aria-current="page".' },
          { name: 'ariaLabel', type: 'string', description: 'Accessible name for the nav.' },
          { name: 'linkComponent', type: 'React.ElementType', description: 'Pass next/link for same-origin client navigation; root-relative hrefs only.' },
          { name: 'floating', type: 'boolean', defaultValue: 'false', description: 'Floats above content with the one allowed shadow; the docked form takes its own height.' },
          { name: 'desktopHeader', type: 'boolean', defaultValue: 'false', description: 'Compact horizontal links at lg+.' },
        ],
      },
      {
        title: 'Constants',
        rows: [
          { name: 'POGO_TOOLS', type: 'AppSwitcherItem[]', description: 'Absolute URLs for the standalone tools.' },
          { name: 'POGO_ROUTES', type: 'AppSwitcherItem[]', description: 'The same three tools as routes inside the shell.' },
        ],
      },
    ],
    ruleQueries: ['Navigation between the three tools belongs to `AppSwitcher`', 'Each tool has an accent'],
    sourceFiles: ['packages/ui/src/components/app-switcher.tsx'],
  },
  {
    slug: 'dock',
    title: 'Dock',
    group: 'Navigation',
    covers: ['Dock', 'DockArea', 'DockSearch', 'DockButton', 'DockSeparator'],
    summary:
      'On a phone, a tool’s own controls live in its dock: one floating bar with search, filters and the ways out, above the switcher and in thumb reach. It is one of the things that genuinely floats, so it takes --shadow-float and the lit edge.',
    props: [
      {
        title: 'Dock family',
        rows: [
          { name: 'Dock', type: "React.ComponentProps<'div'>", description: 'The floating bar itself, role="toolbar".' },
          { name: 'DockArea', type: "React.ComponentProps<'div'>", description: 'Where the dock sits, over the foot of the tool’s area. Phones only.' },
          { name: 'DockSearch', type: '{ value, onChange, placeholder, ariaLabel, clearLabel, disabled? }', description: 'The dock’s search field without a frame of its own.' },
          { name: 'DockButton', type: "Button props & { active?, tone?: 'plain' | 'gold' }", description: 'A 44px icon button; asChild for a link.' },
          { name: 'DockSeparator', type: '—', description: 'The hairline between search and buttons.' },
        ],
      },
    ],
    ruleQueries: ['On a phone, a tool’s own controls live in its dock'],
    sourceFiles: ['packages/ui/src/components/dock.tsx'],
  },
  {
    slug: 'app-shell',
    title: 'AppShell',
    group: 'Layout',
    covers: ['AppShell', 'AppShellMobile', 'AppShellDesktop'],
    summary:
      'The full-viewport shell: the main landmark, a single-column phone layout and the sidebar-plus-content desktop layout. No painted texture and no bottom fade — the page carries its atmosphere with one ember light.',
    props: [
      {
        title: 'AppShell family',
        rows: [
          { name: 'AppShell', type: "React.ComponentProps<'main'>", description: '100dvh, overflow-hidden, bg-background. The <main> landmark.' },
          { name: 'AppShellMobile', type: "React.ComponentProps<'div'>", description: 'Single column with safe-area padding, hidden from lg.' },
          { name: 'AppShellDesktop', type: "React.ComponentProps<'div'>", description: 'Sidebar + content row, from lg only.' },
        ],
      },
    ],
    ruleQueries: ['separate surfaces with light', 'Keep interactive targets'],
    sourceFiles: ['packages/ui/src/components/app-shell.tsx'],
  },
  {
    slug: 'sidebar',
    title: 'Sidebar',
    group: 'Layout',
    covers: ['Sidebar'],
    summary:
      'The desktop rail: 320px (384px at xl), full height, a hairline on the right. It holds the Pokédex filters, the collection progress and Quests’ rewards, not global navigation.',
    props: [
      {
        title: 'Sidebar',
        rows: [{ name: 'className', type: "React.ComponentProps<'aside'>", description: 'Width and padding are part of the component; a caller can still adjust spacing.' }],
      },
    ],
    ruleQueries: ['Pokédex filters live in the desktop sidebar'],
    sourceFiles: ['packages/ui/src/components/sidebar.tsx'],
  },
  {
    slug: 'page-header',
    title: 'PageHeader',
    group: 'Layout',
    covers: ['PageHeader'],
    summary:
      'The top of every page: optional logo, title over one meta line, optional trailing control, and the faint brand behind it on a phone. One component so the tools stop drifting on title and header heights.',
    props: [
      {
        title: 'PageHeader',
        rows: [
          { name: 'logo', type: 'React.ReactNode', description: 'Optional leading mark; hidden on desktop by default.' },
          { name: 'title', type: 'React.ReactNode', description: 'A string becomes the h1; pass nodes to set your own.' },
          { name: 'meta', type: 'React.ReactNode', description: 'One truncating meta line under the title.' },
          { name: 'trailing', type: 'React.ReactNode', description: 'Optional control at the end; stays on every width.' },
          { name: 'titleDesktopHidden', type: 'boolean', defaultValue: 'false', description: 'Hides the title at lg+ (the hub, whose title is the brand).' },
          { name: 'logoDesktopHidden', type: 'boolean', defaultValue: 'true', description: 'False for a trainer avatar, which keeps its profile role.' },
          { name: 'children', type: 'React.ReactNode', description: 'Anything under the row, e.g. a progress bar.' },
        ],
      },
    ],
    ruleQueries: ['On a phone, the brand sits behind every page’s title'],
    sourceFiles: ['packages/ui/src/components/page-header.tsx'],
    notes: [
      'The brand artwork arrives through the app’s --brand-mark custom property; the demo has none, so the faint page-brand layer draws nothing. Omitting the logo is the desktop direction, not a missing asset.',
    ],
  },
  {
    slug: 'utilities',
    title: 'Utilities and routes',
    group: 'Utilities',
    covers: ['cn', 'POKEDEX_PUBLIC_ROUTE', 'parseQuestsSearch', 'questsSearchHref'],
    summary:
      'Non-component exports. `cn` is the class merger that knows the type scale; the route helpers keep addresses in one place instead of retyped strings.',
    props: [
      {
        title: 'Exports',
        rows: [
          { name: 'cn', type: '(...inputs: ClassValue[]) => string', description: 'clsx + tailwind-merge, extended so text-body is a font size and not dropped beside a text colour.' },
          { name: 'POKEDEX_PUBLIC_ROUTE', type: 'string', description: '“/pokedex”, the Pokédex’s address in the hub.' },
          { name: 'parseQuestsSearch', type: '(search: string) => QuestsSearch | null', description: 'Bounded parse of ?q=…&zona=… from an address.' },
          { name: 'questsSearchHref', type: '(q: string, zone?: QuestsZone | null) => string', description: 'The shell’s address for Quests already searched.' },
        ],
      },
    ],
    ruleQueries: ['Use semantic roles first', 'New components belong in'],
    sourceFiles: ['packages/ui/src/lib/utils.ts', 'packages/ui/src/lib/pokedex-route.ts', 'packages/ui/src/lib/quests-search.ts'],
  },
]

export function docBySlug(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug)
}

export function docsInGroup(group: ComponentGroup): ComponentDoc[] {
  return COMPONENT_DOCS.filter((doc) => doc.group === group)
}

/** Every export named by at least one page. */
export function coveredExports(): Set<string> {
  return new Set(COMPONENT_DOCS.flatMap((doc) => doc.covers))
}
