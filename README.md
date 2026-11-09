# PoGoLeiria design system

The single source of truth for PoGoLeiria's design language: tokens, type,
geometry, components and domain colours. It renders the real package rather
than a copy of it.

- Tokens come from `packages/ui/src/tokens.css`.
- Components come from `@pogoleiria/ui`.
- Rules come from `DESIGN.md`.
- The type scale, the landing's domain-colour modules and the app-level
  globals are read from the same pinned commit.

Nothing is retyped. If the package changes and the vendor is re-pinned, the
site changes on the next build. Two guard tests keep that honest: every custom
property in `tokens.css` must be shown on the Colour/Geometry pages, and every
value export in `packages/ui/src/index.ts` must have a component page.

The monorepo it pins is private. The vendored copy in `vendor/pogoleiria` is
everything the build needs, so this repo builds on its own.

## Quick start

```sh
npm install
npm run dev        # http://0.0.0.0:4090
```

Production build:

```sh
npm run build
npm start          # port 4090
```

## The pinned checkout

`vendor/pogoleiria` is not edited by hand. `scripts/sync-source.sh <sha>`
exports the committed tree of the monorepo with `git archive`:

```
packages/ui
DESIGN.md
apps/landing/app/globals.css
apps/landing/lib/domain-colors.ts
apps/landing/lib/team-colors.ts
```

The full commit SHA goes into `vendor/SOURCE`. Re-pin deliberately:

```sh
scripts/sync-source.sh "$(git -C /root/PoGoLeiria rev-parse HEAD)"
```

The monorepo is read-only for this project. `git archive` reads only committed
history, so another agent's uncommitted work can never leak into the site.

`scripts/check-drift.mjs` (or `npm run check-drift`) is a report, not a gate: it
prints whether the monorepo's `HEAD` has changed any synced path since the pin.
Drift is normal; re-pin when you want it. It exits 0 whether or not drift is
found, and 1 only when the monorepo cannot be read.

`tests/vendor.test.ts` re-runs the archive and compares every synced file byte
for byte against `vendor/`, including file modes. A hand edit, a partial sync
or a forgotten file fails the suite.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server on `0.0.0.0:4090` |
| `npm run build` | Production build; static generation for all pages |
| `npm start` | Serve the production build on 4090 |
| `npm run lint` | ESLint (the monorepo's `eslint-config-next` presets, copied) |
| `npm test` | Vitest: colour maths, token reader, markdown parser, guards, vendor identity |
| `npm run sync-source -- <sha>` | Re-pin and export the vendored source |
| `npm run check-drift` | Report monorepo drift since the pin |

## Structure

```
app/                     routes: overview, colour, type, geometry,
                         components (+ [slug]), domain-colours, surfaces
components/site/         site chrome, token tables, markdown renderer
components/demos/        live examples, one per component page
lib/design/              token reader, colour maths, DESIGN.md parser,
                         component catalogue, UI index reader
scripts/                 sync-source.sh, check-drift.mjs
stubs/                   type-only stubs for the vendored domain modules
tests/                   the guards and the maths
vendor/                  pinned monorepo export (generated, committed)
```

## Site rules

The site is its own first consumer: dark surfaces separated by light rather
than shadow, type sizes only from the documented scale, lucide icons, no
emoji, 44px targets, a visible ember focus ring and `prefers-reduced-motion`.
The only place a drop shadow appears is the geometry page's demonstration of
`--shadow-float`, the one shadow the system allows.

The live site is a production `next start` on port 4090. It is reachable only
on the home network, not from the internet.
