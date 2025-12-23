import React, { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...props };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss
  };
}

export function Toast({ toast, onDismiss }: { toast: Toast; onDismiss?: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
      {toast.action && (
        <div className="mt-2">{toast.action}</div>
      )}
    </div>
  );
}
