'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';

type Props = React.ComponentProps<'div'> & {
  /** Preserve a nav or Radix tablist instead of adding another wrapper. */
  asChild?: boolean;
  /** Equal columns; omitted for choices sized to their labels. */
  columns?: number;
};

/** One pill with the suite's 8° joins; each child keeps its own semantics. */
function SegmentedControl({ asChild = false, columns, children, className, style, ...props }: Props) {
  const root = asChild
    ? React.Children.only(children) as React.ReactElement<{ children?: React.ReactNode }>
    : null;
  const items = React.Children.toArray(root ? root.props.children : children);
  const count = columns ?? items.length;
  const segments = items.map((child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        'data-segment-start': index % count === 0 ? '' : undefined,
        'data-segment-end': index % count === count - 1 || index === items.length - 1 ? '' : undefined,
      })
      : child
  );
  const Component = asChild ? Slot : 'div';
  const layout: React.CSSProperties & { '--segmented-columns'?: number } = { ...style };
  if (columns !== undefined) layout['--segmented-columns'] = columns;

  return (
    <Component
      data-slot="segmented-control"
      data-layout={columns === undefined ? 'flex' : 'grid'}
      data-wrapped={items.length > count ? '' : undefined}
      {...(asChild ? {} : { role: 'group' })}
      className={cn('segmented-control', className)}
      style={layout}
      {...props}
    >
      {root ? React.cloneElement(root, undefined, segments) : segments}
    </Component>
  );
}

export { SegmentedControl };
