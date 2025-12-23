import React from 'react';
import { cn } from './utils';

export function Label({ children, className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('block text-sm font-medium text-gray-700', className)} {...props}>
      {children}
    </label>
  );
}
