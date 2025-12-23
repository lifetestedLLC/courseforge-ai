import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('renders and reacts to click', () => {
    const handle = jest.fn()
    render(<Button onClick={handle}>Click me</Button>)
    const btn = screen.getByRole('button', { name: /click me/i })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(handle).toHaveBeenCalled()
  })

  it('applies variant and size classes', () => {
    render(<Button variant="outline" size="lg">Styled</Button>)
    const btn = screen.getByRole('button', { name: /styled/i })
    expect(btn).toBeInTheDocument()
  })
})
