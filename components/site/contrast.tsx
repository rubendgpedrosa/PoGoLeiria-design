import { contrastGrade, formatRatio, type ContrastGrade } from '@/lib/design/colour'

const GRADE_CLASS: Record<ContrastGrade, string> = {
  AAA: 'text-success',
  AA: 'text-ink-label',
  'AA Large': 'text-ink-muted',
  Fail: 'text-destructive',
}

export function ContrastValue({ ratio }: { ratio: number }) {
  if (ratio < 1.001) {
    return <span className="text-label text-ink-subtle">same surface (1.00:1)</span>
  }
  const grade = contrastGrade(ratio)
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span className="font-display text-body font-bold tabular-nums text-ink-bright">{formatRatio(ratio)}</span>
      <span className={`text-micro font-bold uppercase tracking-[0.1em] ${GRADE_CLASS[grade]}`}>{grade}</span>
    </span>
  )
}
