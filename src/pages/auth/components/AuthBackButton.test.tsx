import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AuthBackButton } from './AuthBackButton'

describe('AuthBackButton', () => {
  it('calls the back handler when activated', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(<AuthBackButton onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
