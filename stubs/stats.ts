/**
 * Type-only stub for the vendored team-colour module.
 *
 * apps/landing/lib/team-colors.ts imports `TeamSplit` from `@/lib/stats` only
 * to type its keys (`Exclude<keyof TeamSplit, 'neutral'>`). The import is
 * erased at runtime; this stub exists so TypeScript can check the real values.
 */
export type TeamSplit = {
  mystic: number;
  valor: number;
  instinct: number;
  neutral: number;
};
