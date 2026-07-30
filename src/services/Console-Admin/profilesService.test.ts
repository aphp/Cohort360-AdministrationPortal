import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
}))

import api from 'services/api'
import {
  getProfile,
  getAccesses,
  getValidAccesses,
  submitCreateAccess,
  submitEditAccess,
  onDeleteOrTerminateAccess
} from './profilesService'

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

describe('getProfile', () => {
  it('returns undefined when user_id is missing', async () => {
    await expect(getProfile()).resolves.toBeUndefined()
    expect(get).not.toHaveBeenCalled()
  })

  it('returns sorted profiles by source on success', async () => {
    get.mockResolvedValue({
      status: 200,
      data: { results: [{ source: 'b' }, { source: 'a' }, { source: 'c' }] }
    })
    const res = await getProfile('1')
    expect(res.map((p: any) => p.source)).toEqual(['a', 'b', 'c'])
  })

  it('returns undefined when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getProfile('1')).resolves.toBeUndefined()
  })
})

describe('getAccesses', () => {
  it('returns accesses + total on success', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }], count: 1 } })
    const res = await getAccesses(7, 1, { orderBy: 'name', orderDirection: 'asc' })
    expect(get).toHaveBeenCalledWith('/accesses/accesses/?page=1&profile_id=7&ordering=name')
    expect(res).toEqual({ accesses: [{ id: 1 }], total: 1 })
  })

  it('inverts the direction when ordering by is_valid', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [], count: 0 } })
    await getAccesses(7, 1, { orderBy: 'is_valid', orderDirection: 'asc' })
    expect(get).toHaveBeenCalledWith('/accesses/accesses/?page=1&profile_id=7&ordering=-is_valid')
  })

  it('returns undefined when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getAccesses(7, 1, { orderBy: 'name', orderDirection: 'asc' })).resolves.toBeUndefined()
  })
})

describe('getValidAccesses', () => {
  it('returns the data on success', async () => {
    get.mockResolvedValue({ status: 200, data: [{ id: 1 }] })
    await expect(getValidAccesses()).resolves.toEqual([{ id: 1 }])
  })

  it('returns undefined when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getValidAccesses()).resolves.toBeUndefined()
  })
})

describe('submitCreateAccess', () => {
  it('returns true on 201', async () => {
    post.mockResolvedValue({ status: 201 })
    await expect(submitCreateAccess({} as never)).resolves.toBe(true)
  })

  it('returns false when the request throws', async () => {
    post.mockRejectedValueOnce(new Error('boom'))
    await expect(submitCreateAccess({} as never)).resolves.toBe(false)
  })
})

describe('submitEditAccess', () => {
  it('returns true on 200', async () => {
    patch.mockResolvedValue({ status: 200 })
    await expect(submitEditAccess({} as never, 5)).resolves.toBe(true)
  })

  it('returns false when the request throws', async () => {
    patch.mockRejectedValueOnce(new Error('boom'))
    await expect(submitEditAccess({} as never, 5)).resolves.toBe(false)
  })
})

describe('onDeleteOrTerminateAccess', () => {
  it('terminates via PATCH /close/ when terminateAccess=true and returns true on 200', async () => {
    patch.mockResolvedValue({ status: 200 })
    await expect(onDeleteOrTerminateAccess(true, 5)).resolves.toBe(true)
    expect(patch).toHaveBeenCalledWith('/accesses/accesses/5/close/')
  })

  it('deletes when terminateAccess=false and returns true on 204', async () => {
    del.mockResolvedValue({ status: 204 })
    await expect(onDeleteOrTerminateAccess(false, 5)).resolves.toBe(true)
    expect(del).toHaveBeenCalledWith('/accesses/accesses/5/')
  })

  it('returns false when the request throws', async () => {
    del.mockRejectedValueOnce(new Error('boom'))
    await expect(onDeleteOrTerminateAccess(false, 5)).resolves.toBe(false)
  })
})
