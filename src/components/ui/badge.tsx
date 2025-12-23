import React from 'react';
import { cn } from './utils';

export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800', className)}>{children}</span>;
}
