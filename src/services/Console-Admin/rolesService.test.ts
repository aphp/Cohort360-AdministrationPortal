import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
}))

import api from 'services/api'
import {
  getRoles,
  getAssignableRoles,
  submitEditRoles,
  createRoles,
  deleteRole,
  getRoleUser,
  getUsersRole
} from './rolesService'

const get = api.get as ReturnType<typeof vi.fn>
const post = api.post as ReturnType<typeof vi.fn>
const patch = api.patch as ReturnType<typeof vi.fn>
const del = api.delete as ReturnType<typeof vi.fn>

beforeEach(() => {
  get.mockReset()
  post.mockReset()
  patch.mockReset()
  del.mockReset()
})

describe('getRoles', () => {
  it('returns the results on success', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ name: 'admin' }] } })
    await expect(getRoles()).resolves.toEqual([{ name: 'admin' }])
  })

  it('returns undefined when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getRoles()).resolves.toBeUndefined()
  })
})

describe('getAssignableRoles', () => {
  it('returns undefined when no perimeter id is given', async () => {
    await expect(getAssignableRoles(null)).resolves.toBeUndefined()
    expect(get).not.toHaveBeenCalled()
  })

  it('sorts by name on success', async () => {
    get.mockResolvedValue({
      status: 200,
      data: [{ name: 'b' }, { name: 'a' }, { name: 'c' }]
    })
    const res = await getAssignableRoles(1)
    expect(res.map((r: any) => r.name)).toEqual(['a', 'b', 'c'])
  })

  it('returns undefined when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getAssignableRoles(1)).resolves.toBeUndefined()
  })
})

describe('submitEditRoles', () => {
  it('returns true on 200', async () => {
    patch.mockResolvedValue({ status: 200 })
    await expect(submitEditRoles({} as never, 5)).resolves.toBe(true)
  })

  it('returns false on error', async () => {
    patch.mockRejectedValueOnce(new Error('boom'))
    await expect(submitEditRoles({} as never, 5)).resolves.toBe(false)
  })
})

describe('createRoles', () => {
  it('returns true on 201', async () => {
    post.mockResolvedValue({ status: 201 })
    await expect(createRoles({} as never)).resolves.toBe(true)
  })

  it('returns false on error', async () => {
    post.mockRejectedValueOnce(new Error('boom'))
    await expect(createRoles({} as never)).resolves.toBe(false)
  })
})

describe('deleteRole', () => {
  it('returns true on 204', async () => {
    del.mockResolvedValue({ status: 204 })
    await expect(deleteRole(5)).resolves.toBe(true)
  })

  it('returns false on error', async () => {
    del.mockRejectedValueOnce(new Error('boom'))
    await expect(deleteRole(5)).resolves.toBe(false)
  })
})

describe('getRoleUser', () => {
  it('returns the role name as a string', async () => {
    get.mockResolvedValue({ data: { name: 'admin' } })
    await expect(getRoleUser('5')).resolves.toBe('admin')
  })
})

describe('getUsersRole', () => {
  it('returns accesses + total on success', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }], count: 1 } })
    const res = await getUsersRole('5', { orderBy: 'username', orderDirection: 'desc' }, 1, 'foo')
    expect(get).toHaveBeenCalledWith('/accesses/roles/5/users/?page=1&order=-username&filter_by_name=foo')
    expect(res).toEqual({ accesses: [{ id: 1 }], total: 1 })
  })

  it('coerces a 204 response to an empty list', async () => {
    get.mockResolvedValue({ status: 204, data: null })
    const res = await getUsersRole('5', { orderBy: 'username', orderDirection: 'asc' })
    expect(res).toEqual({ accesses: [], total: 0 })
  })
})
