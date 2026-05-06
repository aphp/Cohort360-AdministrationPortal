import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn() }
}))

import api from 'services/api'
import { getLogs } from './logsService'

const get = api.get as ReturnType<typeof vi.fn>
beforeEach(() => get.mockReset())

const baseFilters = {
  url: null,
  user: null,
  statusCode: [],
  httpMethod: [],
  afterDate: null,
  beforeDate: null,
  access: null,
  perimeter: { perimeterId: null }
} as never

describe('getLogs', () => {
  it('returns logs + total with no filters', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 1 }], count: 1 } })
    const res = await getLogs(baseFilters, 1)
    expect(get).toHaveBeenCalledWith('/logs/?page=1&ordering=-requested_at')
    expect(res).toEqual({ logs: [{ id: 1 }], total: 1 })
  })

  it('appends every filter when provided', async () => {
    get.mockResolvedValue({ data: { results: [], count: 0 } })
    const filters = {
      url: { code: 'foo' },
      user: 'jdoe',
      statusCode: [200, 500],
      httpMethod: ['GET', 'POST'],
      afterDate: '2026-01-01T00:00:00Z',
      beforeDate: '2026-12-31T00:00:00Z',
      access: null,
      perimeter: { perimeterId: 42 }
    } as never
    await getLogs(filters, 2)
    expect(get).toHaveBeenCalledWith(
      '/logs/?page=2&ordering=-requested_at&path_contains=foo&user=jdoe&status_code=200,500&method=GET,POST&requested_at_after=2026-01-01&requested_at_before=2026-12-31&response="care_site_id":42,'
    )
  })

  it('appends the create-access lookup on first page when an access filter is set', async () => {
    get.mockResolvedValueOnce({ data: { results: [{ id: 1 }], count: 1 } })
    get.mockResolvedValueOnce({
      data: {
        results: [
          { id: 99, requested_at: '2026-01-01T00:00:00Z' },
          { id: 100, requested_at: '2026-02-01T00:00:00Z' }
        ]
      }
    })
    const filters = { ...baseFilters, access: '5' }
    const res = await getLogs(filters, 1)
    expect(get).toHaveBeenCalledTimes(2)
    expect(res?.logs).toEqual([{ id: 1 }, { id: 100, requested_at: '2026-02-01T00:00:00Z' }])
  })

  it('returns undefined when the request throws', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(getLogs(baseFilters, 1)).resolves.toBeUndefined()
  })
})
