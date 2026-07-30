import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/Console-Admin/usersService', () => ({
  getUsers: vi.fn()
}))

import { fetchUsers, setSelectedUser } from './users'
import { getUsers } from 'services/Console-Admin/usersService'

const mockedGetUsers = getUsers as ReturnType<typeof vi.fn>

beforeEach(() => mockedGetUsers.mockReset())

describe('users reducer (via direct import to keep this test isolated)', () => {
  it('handles setSelectedUser', async () => {
    const reducer = (await import('./users')).default
    const initial = { usersList: [], total: 0, loading: false, selectedUser: { username: '' } }
    const next = reducer(initial, setSelectedUser({ username: 'jdoe' } as never))
    expect(next.selectedUser).toEqual({ username: 'jdoe' })
  })

  it('flips loading to true on fetchUsers/pending', async () => {
    const reducer = (await import('./users')).default
    const initial = { usersList: [], total: 0, loading: false, selectedUser: { username: '' } }
    const next = reducer(initial, { type: 'users/fetchUsers/pending' })
    expect(next.loading).toBe(true)
  })

  it('replaces state on fetchUsers/fulfilled', async () => {
    const reducer = (await import('./users')).default
    const initial = { usersList: [], total: 0, loading: true, selectedUser: { username: '' } }
    const next = reducer(initial, {
      type: 'users/fetchUsers/fulfilled',
      payload: { usersList: [{ username: 'a' }], total: 1, loading: false, selectedUser: { username: '' } }
    })
    expect(next).toEqual({ usersList: [{ username: 'a' }], total: 1, loading: false, selectedUser: { username: '' } })
  })

  it('resets state on fetchUsers/rejected', async () => {
    const reducer = (await import('./users')).default
    const initial = { usersList: [{ username: 'a' }], total: 1, loading: true, selectedUser: { username: '' } }
    const next = reducer(initial, { type: 'users/fetchUsers/rejected' })
    expect(next).toEqual({ usersList: [], total: 0, loading: false, selectedUser: { username: '' } })
  })
})

describe('fetchUsers thunk', () => {
  it('calls the service and returns the mapped payload on success', async () => {
    mockedGetUsers.mockResolvedValue({ users: [{ username: 'a' }], total: 1 })
    const dispatch = vi.fn()
    const getState = vi.fn()
    const result = await fetchUsers({ searchInput: 'foo', order: { orderBy: 'username', orderDirection: 'asc' } })(
      dispatch,
      getState,
      undefined
    )
    expect(mockedGetUsers).toHaveBeenCalledWith({ orderBy: 'username', orderDirection: 'asc' }, 1, 'foo')
    expect(result.payload).toEqual({
      usersList: [{ username: 'a' }],
      total: 1,
      loading: false,
      selectedUser: { username: '' }
    })
  })

  it('rejects when the service throws', async () => {
    mockedGetUsers.mockRejectedValueOnce(new Error('boom'))
    const dispatch = vi.fn()
    const getState = vi.fn()
    const result = await fetchUsers({ searchInput: '', order: { orderBy: 'username', orderDirection: 'asc' } })(
      dispatch,
      getState,
      undefined
    )
    expect(result.type).toBe('users/fetchUsers/rejected')
  })
})
