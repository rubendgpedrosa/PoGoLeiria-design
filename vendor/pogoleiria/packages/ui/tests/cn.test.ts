import { describe, expect, it } from 'vitest';

import { cn } from '../src/lib/utils';

describe('cn', () => {
  it('keeps a type-scale size beside a text colour', () => {
    // Unregistered, tailwind-merge took text-body for a colour and dropped it.
    expect(cn('text-body text-ink-bright')).toBe('text-body text-ink-bright');
    expect(cn('text-micro', 'text-gold')).toBe('text-micro text-gold');
  });

  it('still lets a later size replace an earlier one', () => {
    expect(cn('text-label', 'text-body')).toBe('text-body');
    expect(cn('text-sm', 'text-tier')).toBe('text-tier');
  });
});
