import type { Category, RewardTypeFilter } from "@/lib/quests/pogo-types"

/**
 * Domain colours, not UI tokens.
 *
 * DESIGN.md lets a domain keep its own palette but asks for it to be owned in
 * one place and contrast-audited, rather than retyped beside each use. These
 * were spread over six files — the lure tints in the hub, the reward-type and
 * category tints in the quests app, the event-type table, the Rocket glow and
 * raid-board's Shadow violet — so they live here once now, the same call
 * lib/team-colors.ts makes for the three teams.
 *
 * None of them is a role the design system owes anyone, so none is a semantic
 * token: they tint a glyph, a dot, a chip border or a wash, never a text colour
 * on its own. Every value is unchanged from where it was first owned, except
 * the Golden Lure's (M11b, below).
 */

/**
 * Lure tints, keyed by lure id. The Golden Lure is gold, as in the game
 * (owner, 2026-11-03, M11b): its old lavender read as Shadow, which is the
 * map's violet. A domain colour, not `--color-gold` (that token means a
 * reward); its dark accent in the stop's art is `#A16207`.
 */
export const LURE_COLORS: Record<number, string> = {
  501: "#F9A8D4",
  502: "#93C5FD",
  503: "#86EFAC",
  504: "#D1D5DB",
  505: "#60A5FA",
  506: "#FACC15",
}

/** A lure id the game added ahead of us still gets the base module's pink. */
export const LURE_COLOR_FALLBACK = LURE_COLORS[501]

/** The four kinds of quest reward, as on the reward chips. */
export const REWARD_TYPE_COLORS: Record<RewardTypeFilter, string> = {
  stardust: "#ffdf6b",
  encounter: "#f97316",
  mega_energy: "#a78bfa",
  items: "#6cc3a7",
}

/** The five quest categories, as on the filter dots and the row's category dot. */
export const CATEGORY_COLORS: Record<Category, string> = {
  catching: "#efc94e",
  throwing: "#6cc3a7",
  battling: "#f08a5c",
  buddy: "#7f6cff",
  others: "#db77ad",
}

/**
 * Event-type tints, keyed by the scrape's event type.
 *
 * The six are oklch rather than hex so they sit on the same axis as everything
 * else here, spread around the wheel to stay apart at 20px, and kept clear of
 * gold's band at hue 88, because none of these is a reward. A Season is the
 * container the others happen inside rather than a kind of thing to go and do,
 * so it takes the page's own ink instead of a colour; an unknown type
 * ("choose-your-path") is a code, and takes that same ink.
 */
export const EVENT_TYPE_COLORS: Record<string, string> = {
  event: "oklch(0.78 0.10 250)",
  community_day: "oklch(0.80 0.14 145)",
  spotlight: "oklch(0.80 0.13 300)",
  raid: "oklch(0.78 0.14 350)",
  "raid-battles": "oklch(0.78 0.14 350)",
  research: "oklch(0.80 0.11 195)",
  season: "var(--color-ink-muted)",
}

/** The glow a Rocket leader's portrait sits on. */
export const ROCKET_GLOW = "rgb(226 85 63 / 0.35)"

/** The same Rocket red at full strength: the ring of a Team GO Rocket stop's dot on the native map (its art from 15 is the designer's, in the same red). */
export const ROCKET_RED = "rgb(226 85 63)"

/**
 * A thin light line round a Team GO Rocket stop's dark cube on Dark Matter
 * (the native map, M8a), where the cube was a hole in the map. Not drawn on
 * the light basemap, where the cube already reads.
 */
export const ROCKET_STOP_OUTLINE = "oklch(0.92 0.01 260)"

/**
 * The game's Pokéstop blue, as the native map draws a stop's dot below zoom
 * 15 (from 15 a stop is the designer's art, public/map-pins). The value is
 * the one --color-tool-quests happens to share, named here so the map does
 * not borrow the switcher's accent (DESIGN.md, one accent per tool).
 */
export const POKESTOP_BLUE = "oklch(0.72 0.13 232)"

/**
 * The designer's stop files' own navy outline and metal post
 * (public/map-pins/pokestop.svg), for the one stand the canvas draws itself:
 * a Power Spot's, so it stands on the same post as the stops round it.
 */
export const STOP_STAND_INK = "#08345f"
export const STOP_POST_METAL = ["#cfe0ea", "#7f95a6", "#4d6172"] as const

/**
 * A Power Spot, where Max Battles happen: the game's Dynamax magenta, as the
 * native map draws a station: its dot below zoom 15, the three faces of its
 * crystal (lit, side, shaded) and the same three down its collar and base.
 * Hue 340 sits apart from the Pokéstop blue and, at the crystal's
 * saturation, from the Mega pink a raid's glow wears.
 */
export const POWER_SPOT_MAGENTA = "oklch(0.62 0.22 345)"
export const POWER_SPOT_FACES = ["oklch(0.8 0.14 345)", POWER_SPOT_MAGENTA, "oklch(0.47 0.19 340)"] as const

/** A nest's outline and faint fill on the map: a neutral tone, since a nest is a place, not an event. */
export const NEST_TONE = "oklch(0.5 0.04 260)"

/**
 * A Mega raid's glow on the native map (its coin's ring below zoom 15): the
 * game's Mega pink, the same tint the hub's raid events wear
 * (EVENT_TYPE_COLORS.raid), so a Mega reads apart from a plain tier at pin
 * size without a word.
 */
export const MEGA_PINK = EVENT_TYPE_COLORS.raid

/**
 * Shadow is violet in the game; the chip tint is the same violet at 14%, which
 * the glyph colour alone cannot say once two tiers share a star count.
 */
export const SHADOW_VIOLET = "oklch(0.74 0.11 305)"
export const SHADOW_TINT = "oklch(0.74 0.11 305 / 0.14)"

/**
 * A 100IV on the native map (owner, 2026-11-05, option 4 of the 100% board):
 * the gold of the ripple that spreads from its feet, and of the heart in its
 * "Falta-te" notch. Red meant 100% until then; the shiny map keeps its own.
 */
export const HUNDRED_GOLD = "#f5b300"
