import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../select'

describe('Select', () => {
  it('renders options and triggers onValueChange', () => {
    const handle = jest.fn()
    render(
      <Select value="a" onValueChange={handle}>
        <SelectTrigger>
          <div>Trigger</div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    )

    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'b' } })
    expect(handle).toHaveBeenCalledWith('b')
  })
})
