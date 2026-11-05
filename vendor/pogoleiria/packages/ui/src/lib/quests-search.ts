/**
 * Opening Quests already searched, from another tool (a Pokédex row's "quest
 * hoje" mark): a link to `/quests?q=…&zona=…`. Every tool is the hub's own
 * code, so it is a client navigation and Quests reads the search from the
 * address.
 */

export type QuestsZone = 'leiria' | 'marinha';
export type QuestsSearch = { q: string; zone: QuestsZone | null };

const ZONES: readonly QuestsZone[] = ['leiria', 'marinha'];

/** The shell's address for Quests searched for `q`, in `zone` when given. */
export function questsSearchHref(q: string, zone?: QuestsZone | null): string {
  const params = new URLSearchParams({ q });
  if (zone) params.set('zona', zone);
  return `/quests?${params}`;
}

/** A search from `?q=…&zona=…`, or null. Bounded: it comes from an address. */
export function parseQuestsSearch(search: string): QuestsSearch | null {
  const params = new URLSearchParams(search);
  const q = params.get('q')?.trim().slice(0, 60) ?? '';
  if (!q) return null;
  const zona = params.get('zona');
  return { q, zone: ZONES.includes(zona as QuestsZone) ? (zona as QuestsZone) : null };
}

