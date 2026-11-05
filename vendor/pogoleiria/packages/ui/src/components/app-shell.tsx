import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * The full-viewport shell both apps sit in: the <main> landmark, and nothing
 * else.
 *
 * It used to paint a hexagon lattice behind everything, shared with the hub
 * through `.hex-grid`. That texture ran at three percent of the page's own ink
 * over a near-black background — a four percent luminance delta, invisible on
 * a phone outdoors and close to it anywhere else — so it was a full-page
 * painted element that nobody had ever actually seen. Turning it up made the
 * problem plain rather than fixing it: a hex lattice on a dark game-adjacent
 * UI is the first thing anyone reaches for, and PRODUCT.md rules out both the
 * Niantic pastiche and the dark-mode-template look by name. The page carries
 * its atmosphere with one ember light at the top instead.
 *
 * It used to carry a 128px bottom fade as well, to lift content off the bottom
 * nav. These apps are embedded in the landing shell now and its bar is docked
 * outside their frame, so there was nothing underneath for the fade to lift
 * content off — it only dimmed the last rows of a list.
 */
function AppShell({ className, children, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="app-shell"
      className={cn('relative h-[100dvh] overflow-hidden bg-background text-foreground', className)}
      {...props}
    >
      {children}
    </main>
  );
}

/**
 * Single-column phone layout. Hidden at lg, where AppShellDesktop takes over.
 *
 * No bottom padding, so a list runs right up to the switcher docked below the
 * frame — the gap was space doing nothing.
 *
 * It is env(safe-area-inset-bottom) rather than 0 because that resolves to 0
 * inside an iframe, where the shell already owns the safe area, and to the
 * home indicator when this app is opened directly on its own subdomain.
 */
function AppShellMobile({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-mobile"
      className={cn(
        'relative mx-auto flex h-full w-full max-w-md flex-col overflow-y-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] lg:hidden',
        className
      )}
      {...props}
    />
  );
}

/** Sidebar + content layout, from lg up. */
function AppShellDesktop({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="app-shell-desktop"
      className={cn('relative hidden h-full lg:flex', className)}
      {...props}
    />
  );
}

export { AppShell, AppShellMobile, AppShellDesktop };
