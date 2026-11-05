import { contrastOn } from '@/lib/design/colour'
import { tokenMeaning } from '@/lib/design/design'
import type { Token } from '@/lib/design/tokens'
import { ContrastValue } from './contrast'
import { Swatch } from './swatch'

function TokenName({ token }: { token: Token }) {
  return (
    <div className="min-w-0">
      <code className="break-words font-mono text-body font-semibold text-ink-bright">--{token.name}</code>
      {token.declared.startsWith('var(') ? (
        <p className="mt-1 break-words font-mono text-label text-ink-subtle">{token.declared}</p>
      ) : null}
      {token.variants.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1">
          {token.variants.map((variant, index) => (
            <li key={index} className="break-words font-mono text-micro text-ink-subtle">
              {variant.selector} → {variant.declared}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function ValueCell({ token }: { token: Token }) {
  if (!token.color) {
    return <p className="break-words font-mono text-label text-ink-label whitespace-pre-wrap">{token.resolved}</p>
  }
  return (
    <div className="flex flex-col gap-1">
      {token.oklch ? <p className="font-mono text-label text-ink-label">{token.oklch}</p> : null}
      <p className="font-display text-figure font-bold tabular-nums text-ink-bright">{token.color.hex}</p>
      {token.color.alpha < 1 ? <p className="font-mono text-micro text-ink-subtle">alpha {token.color.alpha}</p> : null}
    </div>
  )
}

function ContrastCells({ token, background, card }: { token: Token; background: Token; card: Token }) {
  if (!token.color || !background.color || !card.color) {
    return (
      <>
        <td className="px-3 py-4 text-label text-ink-subtle">—</td>
        <td className="px-3 py-4 text-label text-ink-subtle">—</td>
      </>
    )
  }
  return (
    <>
      <td className="px-3 py-4">
        <ContrastValue ratio={contrastOn(token.color, background.color.rgb)} showGrade={false} />
      </td>
      <td className="px-3 py-4">
        <ContrastValue ratio={contrastOn(token.color, card.color.rgb)} showGrade={false} />
      </td>
    </>
  )
}

/**
 * The compact table used for the primitive palette, the compatibility aliases
 * and the component-scoped colour. Contrast is always measured against
 * --background and --card, the two surfaces the palette is composed on.
 */
export function ColourTable({
  tokens,
  background,
  card,
  showMeaning = false,
}: {
  tokens: Token[]
  background: Token
  card: Token
  showMeaning?: boolean
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead>
          <tr className="bg-surface-raised">
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Token</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Swatch</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Value</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">On background</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">On card</th>
            {showMeaning ? (
              <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Meaning</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => {
            const meaning = showMeaning ? tokenMeaning(token.name) : null
            return (
              <tr key={token.name} className="border-t border-hairline align-top">
                <td className="px-3 py-4">
                  <TokenName token={token} />
                </td>
                <td className="px-3 py-4">
                  {token.color ? <Swatch hex={token.color.hex} alpha={token.color.alpha} label={token.name} /> : null}
                </td>
                <td className="px-3 py-4">
                  <ValueCell token={token} />
                </td>
                <ContrastCells token={token} background={background} card={card} />
                {showMeaning ? (
                  <td className="max-w-[26ch] px-3 py-4 text-label leading-relaxed text-ink-muted">{meaning?.lead ?? '—'}</td>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** The semantic roles get cards: the meaning is as important as the value. */
export function SemanticRoleCards({
  tokens,
  background,
  card,
}: {
  tokens: Token[]
  background: Token
  card: Token
}) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {tokens.map((token) => {
        const color = token.color
        if (!color || !background.color || !card.color) return null
        const meaning = tokenMeaning(token.name)
        return (
          <li key={token.name} className="lit flex flex-col gap-4 rounded-xl border border-hairline bg-surface-raised p-4">
            <div className="flex items-start gap-3">
              <Swatch hex={color.hex} alpha={color.alpha} label={token.name} />
              <div className="min-w-0 flex-1">
                <code className="break-words font-mono text-body font-semibold text-ink-bright">--{token.name}</code>
                <p className="mt-1 break-words font-mono text-label text-ink-subtle">{token.declared}</p>
                {token.oklch && token.oklch !== token.declared ? (
                  <p className="break-words font-mono text-label text-ink-muted">{token.oklch}</p>
                ) : null}
              </div>
              <p className="font-display text-figure font-bold tabular-nums text-ink-bright">{color.hex}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline pt-3">
              <div>
                <p className="text-micro font-bold uppercase tracking-[0.12em] text-ink-subtle">On background</p>
                <ContrastValue ratio={contrastOn(color, background.color.rgb)} showGrade={false} />
              </div>
              <div>
                <p className="text-micro font-bold uppercase tracking-[0.12em] text-ink-subtle">On card</p>
                <ContrastValue ratio={contrastOn(color, card.color.rgb)} showGrade={false} />
              </div>
            </div>

            {meaning ? (
              <p className="text-label leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink-label">Meaning in DESIGN.md: </span>
                {meaning.lead}
              </p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/** Geometry declarations: no swatches, but the exact declared and computed value. */
export function GeometryTokenTable({ tokens }: { tokens: Token[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="bg-surface-raised">
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Token</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Declared</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Computed</th>
            <th scope="col" className="px-3 py-3 text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">Declared in</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name} className="border-t border-hairline align-top">
              <td className="px-3 py-4">
                <code className="break-words font-mono text-body font-semibold text-ink-bright">--{token.name}</code>
                {token.variants.length > 0 ? (
                  <ul className="mt-2 flex flex-col gap-1">
                    {token.variants.map((variant, index) => (
                      <li key={index} className="break-words font-mono text-micro text-ink-subtle">
                        {variant.selector} → {variant.declared}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </td>
              <td className="max-w-[34ch] px-3 py-4">
                <p className="break-words whitespace-pre-wrap font-mono text-label text-ink-label">{token.declared}</p>
              </td>
              <td className="max-w-[34ch] px-3 py-4">
                <p className="break-words whitespace-pre-wrap font-mono text-label text-ink-muted">{token.resolved}</p>
              </td>
              <td className="px-3 py-4">
                <code className="break-words font-mono text-label text-ink-subtle">{token.selector}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
