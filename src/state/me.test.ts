import { describe, it, expect } from 'vitest'
import meReducer, { login, logout } from './me'
import { userDefaultRoles } from 'utils/userRoles'
import { MeState } from 'types'

const sampleUser: MeState = {
  username: 'jdoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  displayName: 'John Doe',
  userRights: userDefaultRoles
}

describe('me reducer', () => {
  it('returns the current state for an unknown action', () => {
    const next = meReducer(sampleUser, { type: 'unknown' })
    expect(next).toEqual(sampleUser)
  })

  it('replaces state on login', () => {
    const next = meReducer(null, login(sampleUser))
    expect(next).toEqual(sampleUser)
  })

  it('resets to null on logout', () => {
    const next = meReducer(sampleUser, logout())
    expect(next).toBeNull()
  })
})
