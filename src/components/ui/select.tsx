import React from 'react';
import { cn } from './utils';

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode }) {
  // Extract SelectItem components from children (may be nested inside SelectContent)
  const items: { value: string; label: React.ReactNode }[] = [];
  const walk = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child: any) => {
      if (!child) return;
      if (child.type && child.type.displayName === 'SelectItem') {
        items.push({ value: child.props.value, label: child.props.children });
      } else if (child.props && child.props.children) {
        walk(child.props.children);
      }
    });
  };
  walk(children);

  return (
    <select className={cn('rounded-md border border-gray-300 px-3 py-2', '')} value={value} onChange={(e) => onValueChange?.(e.target.value)}>
      {items.map((it) => (
        <option key={it.value} value={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  );
}

export function SelectTrigger({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SelectContent({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SelectValue() {
  return null;
}

export function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  return null; // handled by Select
}

(SelectItem as any).displayName = 'SelectItem';
