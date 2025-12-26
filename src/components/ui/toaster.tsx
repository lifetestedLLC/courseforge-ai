'use client'

import * as React from 'react'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 max-w-md p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative rounded-lg border p-4 shadow-lg ${
            toast.variant === 'destructive'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {toast.title && (
                <div className="font-semibold mb-1">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {toast.action && <div className="mt-3">{toast.action}</div>}
        </div>
      ))}
    </div>
  )
}
