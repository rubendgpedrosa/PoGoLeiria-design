import type { TeamSplit } from "@/lib/stats"

/**
 * Domain colours, not UI tokens — the same call DESIGN.md makes for category
 * and Pokémon-type colours. They were retyped independently in three
 * components instead of living here once, which is exactly the case
 * DESIGN.md's extension rule covers: a repeated value earns a shared home
 * after its second real use.
 */
export const TEAM_META: { key: Exclude<keyof TeamSplit, "neutral">; label: string; color: string }[] = [
  { key: "mystic", label: "Mystic", color: "#3B82F6" },
  { key: "valor", label: "Valor", color: "#EF4444" },
  { key: "instinct", label: "Instinct", color: "#FBBF24" },
]
