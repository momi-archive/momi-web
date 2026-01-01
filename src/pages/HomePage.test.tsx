import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('should render the main heading', () => {
    renderWithProviders(<HomePage />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Momi')
  })

  it('should render the description text', () => {
    renderWithProviders(<HomePage />)

    expect(
      screen.getByText(/your personal archiving service/i)
    ).toBeInTheDocument()
  })

  it('should have centered layout', () => {
    renderWithProviders(<HomePage />)

    const container = screen.getByRole('heading', { level: 1 }).parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'items-center')
  })
})
