export { Card, CardHeader, CardTitle, CardContent } from '../card';

import React from 'react';

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );
}
