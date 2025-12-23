import React from 'react';
import { cn } from './utils';

export function Progress({ value = 0, className = '' }: { value?: number; className?: string }) {
  return (
    <div className={cn('w-full bg-gray-200 h-2 rounded-full overflow-hidden', className)}>
      <div style={{ width: `${Math.min(100, Math.max(0, value))}%` }} className="h-full bg-blue-600" />
    </div>
  );
}
