import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() }
}))

import api from 'services/api'
import { getDatalabs, addNewDatalab, getInfrastructureProviders } from './datalabsService'

const get = api.get as ReturnType<typeof vi.fn>
const post = api.post as ReturnType<typeof vi.fn>

beforeEach(() => {
  get.mockReset()
  post.mockReset()
})

describe('getDatalabs', () => {
  it('returns datalabs + total with descending order and search filter', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 1 }], count: 1 } })
    const res = await getDatalabs({ orderBy: 'name', orderDirection: 'desc' }, 2, 'foo')
    expect(get).toHaveBeenCalledWith('/exports/datalabs/?page=2&ordering=-name&search=foo')
    expect(res).toEqual({ datalabs: [{ id: 1 }], total: 1 })
  })

  it('returns undefined when the request throws', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(getDatalabs({ orderBy: 'name', orderDirection: 'asc' }, 1)).resolves.toBeUndefined()
  })
})

describe('addNewDatalab', () => {
  it('returns the created datalab on 201', async () => {
    post.mockResolvedValue({ status: 201, data: { id: 7, name: 'lab' } })
    await expect(addNewDatalab({ name: 'lab' } as never)).resolves.toEqual({ id: 7, name: 'lab' })
  })

  it('throws on non-201', async () => {
    post.mockResolvedValue({ status: 400 })
    await expect(addNewDatalab({ name: 'lab' } as never)).rejects.toThrow('Error while adding a new datalab')
  })
})

describe('getInfrastructureProviders', () => {
  it('returns the results array on success', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 1 }] } })
    await expect(getInfrastructureProviders()).resolves.toEqual([{ id: 1 }])
  })

  it('returns undefined when the request throws', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(getInfrastructureProviders()).resolves.toBeUndefined()
  })
})
