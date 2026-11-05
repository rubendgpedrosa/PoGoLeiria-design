import { describe, expect, it } from 'vitest'

import {
  compositeOver,
  contrastGrade,
  contrastOn,
  contrastRatio,
  formatOklch,
  hexToRgb01,
  oklchToRgb,
  parseColor,
  rgbToHex,
} from '../lib/design/colour'

const BACKGROUND = oklchToRgb(0.105, 0.022, 258).rgb
const CARD = oklchToRgb(0.185, 0.024, 258).rgb

describe('OKLCH to sRGB', () => {
  it('resolves --tone-950 to the documented #01040A', () => {
    expect(rgbToHex(oklchToRgb(0.105, 0.022, 258).rgb)).toBe('#01040A')
  })

  it('resolves the discord role to Discord’s own #5865F2', () => {
    expect(rgbToHex(oklchToRgb(0.577, 0.209, 273.9).rgb)).toBe('#5865F2')
  })

  it('does not clip an in-gamut tone', () => {
    expect(oklchToRgb(0.97, 0.01, 258).outOfGamut).toBe(false)
  })

  it('round-trips a hex through parseColor', () => {
    expect(parseColor('#01040A')?.hex).toBe('#01040A')
    expect(parseColor('#fff')?.hex).toBe('#FFFFFF')
  })

  it('formats an OKLCH triplet without trailing zeros', () => {
    expect(formatOklch({ l: 0.105, c: 0.022, h: 258 })).toBe('oklch(0.105 0.022 258)')
  })
})

describe('WCAG contrast', () => {
  it('gives --urgent-500 ~8.8:1 on --background', () => {
    const urgent = parseColor('oklch(0.75 0.165 58)')
    expect(urgent).not.toBeNull()
    expect(contrastOn(urgent!, BACKGROUND)).toBeCloseTo(8.82, 2)
  })

  it('gives --urgent-500 ~8.0:1 on --card', () => {
    const urgent = parseColor('oklch(0.75 0.165 58)')
    expect(contrastOn(urgent!, CARD)).toBeCloseTo(8.01, 2)
  })

  it('never reports less than 1:1, whatever the order', () => {
    const white = parseColor('#FFFFFF')!
    const black = parseColor('#000000')!
    expect(contrastRatio(white.rgb, black.rgb)).toBeCloseTo(21, 5)
    expect(contrastRatio(black.rgb, white.rgb)).toBeCloseTo(21, 5)
    expect(contrastRatio(white.rgb, white.rgb)).toBe(1)
  })

  it('composites alpha before measuring', () => {
    const half = parseColor('oklch(0.97 0.01 258 / 0.5)')!
    const composited = compositeOver(half.rgb, 0.5, BACKGROUND)
    expect(contrastOn(half, BACKGROUND)).toBeCloseTo(contrastRatio(composited, BACKGROUND), 6)
    expect(contrastOn(half, BACKGROUND)).toBeLessThan(contrastOn({ ...half, alpha: 1 }, BACKGROUND))
  })

  it('grades at the WCAG 2.1 thresholds', () => {
    expect(contrastGrade(7)).toBe('AAA')
    expect(contrastGrade(4.5)).toBe('AA')
    expect(contrastGrade(3)).toBe('AA Large')
    expect(contrastGrade(2.99)).toBe('Fail')
  })

  it('parses rgb() with a slash alpha and a comma form', () => {
    const slash = parseColor('rgb(226 85 63 / 0.35)')!
    expect(slash.rgb255).toEqual({ r: 226, g: 85, b: 63 })
    expect(slash.alpha).toBeCloseTo(0.35, 6)
    const comma = parseColor('rgb(226, 85, 63)')!
    expect(comma.hex).toBe('#E2553F')
  })

  it('refuses values that are not a bare colour', () => {
    expect(parseColor('linear-gradient(160deg, #000, #fff)')).toBeNull()
    expect(parseColor("'Bricolage Grotesque', monospace")).toBeNull()
    expect(parseColor('var(--tone-950)')).toBeNull()
  })

  it('converts hex to normalised channels', () => {
    expect(hexToRgb01('#01040A')![0]).toBeCloseTo(1 / 255, 8)
  })
})
