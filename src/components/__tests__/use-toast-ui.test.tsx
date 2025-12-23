import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toast } from '../use-toast-impl'

const sampleToast = { id: '1', title: 'Hello', description: 'World' }

describe('Toast UI', () => {
  it('renders title and description and dismiss button', () => {
    render(<Toast toast={sampleToast} onDismiss={() => {}} />)
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
    expect(screen.getByText(/world/i)).toBeInTheDocument()
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })
})
