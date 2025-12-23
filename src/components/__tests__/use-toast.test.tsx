import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '../use-toast-impl'

describe('useToast', () => {
  it('adds and removes toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Hi' })
    })

    expect(result.current.toasts.length).toBe(1)
    const id = result.current.toasts[0].id

    act(() => {
      result.current.dismiss(id)
    })

    expect(result.current.toasts.length).toBe(0)
  })
})
