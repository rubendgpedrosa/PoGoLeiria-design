/**
 * Type-only stubs for the vendored domain-colour modules.
 *
 * apps/landing/lib/domain-colors.ts imports `Category` and `RewardTypeFilter`
 * from `@/lib/quests/pogo-types`, and team-colors.ts imports `TeamSplit` from
 * `@/lib/stats`. Those are type-only imports: they are erased from the emitted
 * bundle, but TypeScript still needs the names to check the vendored source.
 * These stubs keep the design site from pretending to own the landing app's
 * types, and they cannot drift into runtime values.
 */

export type Category = 'catching' | 'throwing' | 'battling' | 'buddy' | 'others';

export type RewardTypeFilter = 'stardust' | 'encounter' | 'mega_energy' | 'items';
