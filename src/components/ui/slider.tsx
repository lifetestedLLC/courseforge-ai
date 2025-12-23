import React from 'react';
import { cn } from './utils';

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className = '' }: { value: number[]; onValueChange?: (val: number[]) => void; min?: number; max?: number; step?: number; className?: string }) {
  const val = Array.isArray(value) ? value[0] : value || 0;
  return (
    <input
      type="range"
      value={val}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={cn('w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer', className)}
    />
  );
}
