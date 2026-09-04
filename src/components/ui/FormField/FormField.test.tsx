import { render, screen } from '@testing-library/react'

import { Input } from '../Input/Input'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates the label and exposes an invalid input with its error', () => {
    render(
      <FormField id="email" label="Email" requiredMark error="Укажите email">
        <Input id="email" error="Укажите email" required />
      </FormField>
    )

    const input = screen.getByRole('textbox', { name: 'Email *' })

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Укажите email')
    expect(screen.getByText('Укажите email')).toBeInTheDocument()
  })
})
