import * as React from 'react';

import { cn } from '../lib/utils';

/** A shared empty result treatment for the tool lists. */
function EmptyState({ title, description, action, className }: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-hairline bg-surface-sunken px-4 py-8 text-center',
        className,
      )}
    >
      <p className="text-body font-semibold text-ink-bright">{title}</p>
      {description ? <p className="max-w-[34ch] text-label leading-relaxed text-ink-muted">{description}</p> : null}
      {action}
    </article>
  );
}

export { EmptyState };
