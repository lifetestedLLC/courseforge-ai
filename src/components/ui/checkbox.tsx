import React from 'react';
import { cn } from './utils';

export function Checkbox({ id, checked, onCheckedChange, className = '' }: { id?: string; checked?: boolean; onCheckedChange?: (checked: boolean) => void; className?: string }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn('h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-ring', className)}
    />
  );
}
