import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  it('reflects checked state and calls onCheckedChange', () => {
    const handle = jest.fn()
    render(<Checkbox id="chk" checked={false} onCheckedChange={handle} />)
    const cb = screen.getByRole('checkbox')
    expect(cb).toBeInTheDocument()
    fireEvent.click(cb)
    expect(handle).toHaveBeenCalled()
  })
})
