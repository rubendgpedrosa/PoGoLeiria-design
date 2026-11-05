import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The type scale's names (tokens.css), registered as font sizes. Unregistered,
 * tailwind-merge reads `text-body` as a colour and drops it whenever a
 * `text-ink-*` sits beside it in the same cn() call.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['micro', 'label', 'body', 'tier', 'title', 'figure', 'figure-lg', 'hero', 'hero-lg'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
