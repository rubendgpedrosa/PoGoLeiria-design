/**
 * Colour maths for the design system site.
 *
 * The site does not carry a palette: it reads `packages/ui/src/tokens.css` and
 * converts each declared colour into the two forms a builder needs — the sRGB
 * hex a design tool shows, and the WCAG contrast the role promises. This module
 * is deliberately dependency-free and unit-tested, because a wrong conversion
 * here would quietly misreport every token on the Colour page.
 *
 * OKLCH -> sRGB follows Björn Ottosson's OKLab matrices (oklab -> linear sRGB),
 * then the sRGB transfer function. Values outside sRGB are clamped per channel,
 * which is what the tokens' own gamut comments assume.
 */

export type Oklch = { l: number; c: number; h: number }

/** Linear-light-normalised sRGB, each channel 0..1. */
export type Rgb01 = readonly [number, number, number]

export type ColorValue = {
  /** The literal form that was parsed. */
  kind: 'oklch' | 'rgb' | 'hex'
  /** The declaration's own text, e.g. `oklch(0.105 0.022 258)`. */
  raw: string
  /** Present for `oklch(...)` sources. */
  oklch?: Oklch
  /** sRGB channels 0..1, after the transfer function and clamping. */
  rgb: Rgb01
  /** sRGB channels 0..255, integers. */
  rgb255: { r: number; g: number; b: number }
  /** #RRGGBB (uppercase, no alpha). */
  hex: string
  /** 0..1; 1 for an opaque colour. */
  alpha: number
  /** True when a channel had to be clamped into sRGB. */
  outOfGamut: boolean
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export function oklchToRgb(l: number, c: number, hDegrees: number): { rgb: Rgb01; outOfGamut: boolean } {
  const h = (hDegrees * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)

  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b

  const ll = lPrime ** 3
  const mm = mPrime ** 3
  const ss = sPrime ** 3

  const linear = [
    4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss,
    -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss,
    -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss,
  ] as const

  let outOfGamut = false
  const rgb = linear.map((channel) => {
    if (channel < 0 || channel > 1) outOfGamut = true
    const clipped = clamp01(channel)
    return clipped <= 0.0031308 ? 12.92 * clipped : 1.055 * clipped ** (1 / 2.4) - 0.055
  }) as unknown as Rgb01

  return { rgb, outOfGamut }
}

export function rgb01To255(rgb: Rgb01): { r: number; g: number; b: number } {
  return {
    r: Math.round(clamp01(rgb[0]) * 255),
    g: Math.round(clamp01(rgb[1]) * 255),
    b: Math.round(clamp01(rgb[2]) * 255),
  }
}

export function rgbToHex(rgb: Rgb01): string {
  const { r, g, b } = rgb01To255(rgb)
  const hex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

export function hexToRgb01(hex: string): Rgb01 | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return null
  const digits = match[1]
  const full = digits.length === 3 ? digits.split('').map((d) => d + d).join('') : digits
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255) as unknown as Rgb01
}

function makeColor(kind: ColorValue['kind'], raw: string, rgb: Rgb01, alpha: number, oklch?: Oklch, outOfGamut = false): ColorValue {
  return {
    kind,
    raw,
    ...(oklch ? { oklch } : {}),
    rgb,
    rgb255: rgb01To255(rgb),
    hex: rgbToHex(rgb),
    alpha,
    outOfGamut,
  }
}

/**
 * Parse the colour literals used by tokens.css and the domain colour modules:
 * `oklch(L C H)`, `oklch(L C H / A)`, `rgb(r g b)`, `rgb(r g b / A)`,
 * `rgb(r, g, b)` and `#RRGGBB`. Anything else (a gradient, a `color-mix()`, a
 * font stack) returns null: those are not colours to swatch.
 */
export function parseColor(input: string): ColorValue | null {
  const value = input.trim()

  const hex = hexToRgb01(value)
  if (hex && /^#[0-9a-f]{3,6}$/i.test(value)) return makeColor('hex', value, hex, 1)

  const oklchMatch = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i.exec(value)
  if (oklchMatch) {
    const number = (text: string) => (text.endsWith('%') ? Number(text.slice(0, -1)) / 100 : Number(text))
    const l = number(oklchMatch[1])
    const c = number(oklchMatch[2])
    const h = Number(oklchMatch[3])
    const alpha = oklchMatch[4] ? number(oklchMatch[4]) : 1
    const converted = oklchToRgb(l, c, h)
    return makeColor('oklch', value, converted.rgb, clamp01(alpha), { l, c, h }, converted.outOfGamut)
  }

  const rgbMatch = /^rgba?\(\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)\s*(?:(?:,|\/)\s*([\d.]+%?)\s*)?\)$/i.exec(value)
  if (rgbMatch) {
    const toByte = (text: string) => (text.endsWith('%') ? (Number(text.slice(0, -1)) / 100) * 255 : Number(text))
    const rgb = [toByte(rgbMatch[1]), toByte(rgbMatch[2]), toByte(rgbMatch[3])].map((channel) => clamp01(channel / 255)) as unknown as Rgb01
    const alphaText = rgbMatch[4]
    const alpha = alphaText === undefined ? 1 : clamp01(alphaText.endsWith('%') ? Number(alphaText.slice(0, -1)) / 100 : Number(alphaText))
    return makeColor('rgb', value, rgb, alpha)
  }

  return null
}

/** WCAG 2.x relative luminance, from sRGB 0..1 channels. */
export function relativeLuminance(rgb: Rgb01): number {
  const linear = rgb.map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

/** WCAG contrast ratio, 1..21. Order-independent. */
export function contrastRatio(a: Rgb01, b: Rgb01): number {
  const light = Math.max(relativeLuminance(a), relativeLuminance(b))
  const dark = Math.min(relativeLuminance(a), relativeLuminance(b))
  return (light + 0.05) / (dark + 0.05)
}

/** Composite a possibly-translucent foreground over an opaque background. */
export function compositeOver(foreground: Rgb01, alpha: number, background: Rgb01): Rgb01 {
  const mix = (fg: number, bg: number) => fg * alpha + bg * (1 - alpha)
  return [mix(foreground[0], background[0]), mix(foreground[1], background[1]), mix(foreground[2], background[2])] as unknown as Rgb01
}

/** Contrast of a token against an opaque surface, compositing alpha first. */
export function contrastOn(color: ColorValue, background: Rgb01): number {
  const foreground = color.alpha < 1 ? compositeOver(color.rgb, color.alpha, background) : color.rgb
  return contrastRatio(foreground, background)
}

export type ContrastGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail'

/** WCAG 2.1 AA is the suite's floor (PRODUCT.md); AAA is reported too. */
export function contrastGrade(ratio: number): ContrastGrade {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}

/** `oklch(0.105 0.022 258)` for a parsed OKLCH value, trailing zeros trimmed. */
export function formatOklch({ l, c, h }: Oklch): string {
  const trim = (value: number, digits: number) => Number(value.toFixed(digits)).toString()
  return `oklch(${trim(l, 3)} ${trim(c, 3)} ${trim(h, 1)})`
}
