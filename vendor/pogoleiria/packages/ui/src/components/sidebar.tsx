import * as React from 'react';

import { cn } from '../lib/utils';

function Sidebar({ className, ...props }: React.ComponentProps<'aside'>) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        'flex h-full w-80 shrink-0 flex-col overflow-y-auto border-r border-hairline p-4 xl:w-96',
        className
      )}
      {...props}
    />
  );
}

export { Sidebar };
