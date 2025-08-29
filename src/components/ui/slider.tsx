'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import type * as React from 'react';
import { cn } from '@/lib/utils';

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full bg-gray-200">
        <SliderPrimitive.Range className="absolute h-full bg-gray-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-none border border-gray-300 bg-white outline-none ring-0 focus-visible:ring-2 focus-visible:ring-gray-300" />
      <SliderPrimitive.Thumb className="block size-4 rounded-none border border-gray-300 bg-white outline-none ring-0 focus-visible:ring-2 focus-visible:ring-gray-300" />
    </SliderPrimitive.Root>
  );
}

export { Slider };

