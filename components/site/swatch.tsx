export function Swatch({ hex, alpha = 1, label }: { hex: string; alpha?: number; label: string }) {
  return (
    <span
      aria-hidden="true"
      title={`${label}: ${hex}`}
      className="inline-block size-10 shrink-0 rounded-lg border border-hairline-strong"
      style={{ backgroundColor: hex, opacity: alpha }}
    />
  )
}
