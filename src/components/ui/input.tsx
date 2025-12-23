import React from 'react';
import { cn } from './utils';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      className={cn('block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring', className)}
      {...rest}
    />
  );
}
