import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles its local state without an external handler', async () => {
    const user = userEvent.setup()

    render(<Switch defaultChecked label="Получать уведомления на email" />)

    const toggle = screen.getByRole('checkbox', {
      name: 'Получать уведомления на email',
    })

    expect(toggle).toBeChecked()

    await user.click(toggle)

    expect(toggle).not.toBeChecked()
  })
})
