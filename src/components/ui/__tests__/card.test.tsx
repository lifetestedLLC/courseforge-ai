import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent } from '../card'

describe('Card', () => {
  it('renders children and header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    )

    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(screen.getByText(/body/i)).toBeInTheDocument()
  })
})
