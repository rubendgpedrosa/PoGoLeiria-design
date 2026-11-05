import { describe, expect, it } from 'vitest';
import { parseQuestsSearch, questsSearchHref } from '../src/lib/quests-search';

describe('quests search links', () => {
  it('round-trips a search and its zone', () => {
    const href = questsSearchHref('Nickit', 'marinha');
    expect(href).toBe('/quests?q=Nickit&zona=marinha');
    expect(parseQuestsSearch(href.slice(href.indexOf('?')))).toEqual({ q: 'Nickit', zone: 'marinha' });
  });

  it('ignores an unknown zone and an empty search', () => {
    expect(parseQuestsSearch('?q=Eevee&zona=lisboa')).toEqual({ q: 'Eevee', zone: null });
    expect(parseQuestsSearch('?q=%20')).toBeNull();
  });

});
