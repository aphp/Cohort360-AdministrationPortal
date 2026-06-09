import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn() }
}))

import api from 'services/api'
import { getUsers, submitCreateUser, getUser, editUser, checkUser, buildPartialUser } from './usersService'
import { userDefaultRoles } from 'utils/userRoles'

const get = api.get as ReturnType<typeof vi.fn>
const post = api.post as ReturnType<typeof vi.fn>
const patch = api.patch as ReturnType<typeof vi.fn>

beforeEach(() => {
  get.mockReset()
  post.mockReset()
  patch.mockReset()
})

describe('getUsers', () => {
  it('returns users + total on success and builds the descending ordering URL', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ username: 'a' }], count: 42 } })
    const res = await getUsers({ orderBy: 'username', orderDirection: 'desc' }, 2, 'foo')
    expect(get).toHaveBeenCalledWith('/users/?manual_only=true&page=2&ordering=-username&search=foo')
    expect(res).toEqual({ users: [{ username: 'a' }], total: 42 })
  })

  it('omits the search filter when no input is provided and uses ascending ordering', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [], count: 0 } })
    await getUsers({ orderBy: 'username', orderDirection: 'asc' })
    expect(get).toHaveBeenCalledWith('/users/?manual_only=true&page=undefined&ordering=username')
  })

  it('returns empty payload when the status is not 200', async () => {
    get.mockResolvedValue({ status: 500, data: null })
    await expect(getUsers({ orderBy: 'username', orderDirection: 'asc' })).resolves.toEqual({
      users: undefined,
      total: 0
    })
  })
})

describe('submitCreateUser', () => {
  it('returns true on 201', async () => {
    post.mockResolvedValue({ status: 201 })
    await expect(submitCreateUser({ username: 'x' })).resolves.toBe(true)
  })

  it('returns false on non-201', async () => {
    post.mockResolvedValue({ status: 400 })
    await expect(submitCreateUser({ username: 'x' })).resolves.toBe(false)
  })

  it('returns false when the request throws', async () => {
    post.mockRejectedValueOnce(new Error('nope'))
    await expect(submitCreateUser({ username: 'x' })).resolves.toBe(false)
  })
})

describe('getUser', () => {
  it('returns the user data on success', async () => {
    get.mockResolvedValue({ data: { username: 'jdoe' } })
    await expect(getUser('jdoe')).resolves.toEqual({ username: 'jdoe' })
  })

  it('swallows errors and returns undefined', async () => {
    get.mockRejectedValueOnce(new Error('fail'))
    await expect(getUser('jdoe')).resolves.toBeUndefined()
  })
})

describe('editUser', () => {
  it('returns true on 200', async () => {
    patch.mockResolvedValue({ status: 200 })
    await expect(editUser('1', { firstname: 'A' })).resolves.toBe(true)
  })

  it('returns false on non-200', async () => {
    patch.mockResolvedValue({ status: 500 })
    await expect(editUser('1', {})).resolves.toBe(false)
  })

  it('returns false when the request throws', async () => {
    patch.mockRejectedValueOnce(new Error('nope'))
    await expect(editUser('1', {})).resolves.toBe(false)
  })
})

describe('checkUser', () => {
  it('returns the response data on success', async () => {
    get.mockResolvedValue({ data: { username: 'jdoe', found: true } })
    await expect(checkUser('jdoe')).resolves.toEqual({ username: 'jdoe', found: true })
  })

  it('returns a not-found shape on error', async () => {
    get.mockRejectedValueOnce({ response: { data: { message: 'not found' } } })
    await expect(checkUser('ghost')).resolves.toEqual({ username: 'ghost', found: false })
  })
})

describe('buildPartialUser', () => {
  it('maps user fields to MeState shape with userRights', () => {
    const result = buildPartialUser(
      {
        username: 'jdoe',
        firstname: 'John',
        lastname: 'Doe',
        email: 'j@d.com',
        display_name: 'John D.'
      } as never,
      userDefaultRoles
    )
    expect(result).toEqual({
      username: 'jdoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'j@d.com',
      displayName: 'John D.',
      userRights: userDefaultRoles
    })
  })

  it('falls back to empty string / nulls when fields are missing', () => {
    const result = buildPartialUser({} as never, userDefaultRoles)
    expect(result).toEqual({
      username: '',
      firstName: null,
      lastName: null,
      email: null,
      displayName: null,
      userRights: userDefaultRoles
    })
  })
})
