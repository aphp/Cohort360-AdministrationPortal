import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() }
}))

import api from 'services/api'
import {
  jupyterTransfer,
  datalabTransfer,
  getExportsList,
  getDatalabExportsList,
  retryExportRequest,
  getExportLogs
} from './jupyterExportService'

const get = api.get as ReturnType<typeof vi.fn>
const post = api.post as ReturnType<typeof vi.fn>

beforeEach(() => {
  get.mockReset()
  post.mockReset()
})

const emptyFilters = {
  exportType: [],
  insert_datetime_gte: null,
  insert_datetime_lte: null,
  request_job_status: []
} as never

describe('jupyterTransfer / datalabTransfer', () => {
  it('jupyterTransfer returns true on 201', async () => {
    post.mockResolvedValue({ status: 201 })
    await expect(jupyterTransfer({})).resolves.toBe(true)
  })

  it('jupyterTransfer returns false on error', async () => {
    post.mockRejectedValueOnce(new Error('boom'))
    await expect(jupyterTransfer({})).resolves.toBe(false)
  })

  it('datalabTransfer returns true on 201', async () => {
    post.mockResolvedValue({ status: 201 })
    await expect(datalabTransfer({})).resolves.toBe(true)
  })

  it('datalabTransfer returns false on error', async () => {
    post.mockRejectedValueOnce(new Error('boom'))
    await expect(datalabTransfer({})).resolves.toBe(false)
  })
})

describe('getExportsList', () => {
  it('builds a basic URL with limit/offset/ordering', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 1 }], count: 1 } })
    const res = await getExportsList(2, 10, { orderBy: 'created_at', orderDirection: 'desc' }, emptyFilters)
    expect(get).toHaveBeenCalledWith('/exports/?limit=10&offset=10&ordering=-created_at')
    expect(res).toEqual({ list: [{ id: 1 }], total: 1 })
  })

  it('appends every filter when present', async () => {
    get.mockResolvedValue({ data: { results: [], count: 0 } })
    const filters = {
      exportType: [{ code: 'csv' }],
      request_job_status: [{ code: 'pending' }],
      insert_datetime_gte: '2026-01-01',
      insert_datetime_lte: '2026-12-31'
    } as never
    await getExportsList(1, 5, { orderBy: 'created_at', orderDirection: 'asc' }, filters, '  jdoe  ')
    expect(get).toHaveBeenCalledWith(
      '/exports/?limit=5&offset=0&ordering=created_at&output_format=csv&request_job_status=pending&insert_datetime_gte=2026-01-01&insert_datetime_lte=2026-12-31&search=jdoe'
    )
  })

  it('returns an empty payload on error', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(getExportsList(1, 10, { orderBy: 'x', orderDirection: 'asc' }, emptyFilters)).resolves.toEqual({
      list: [],
      total: 0
    })
  })
})

describe('getDatalabExportsList', () => {
  it('uses created_at_gte/lte instead of insert_datetime when filters are present', async () => {
    get.mockResolvedValue({ data: { results: [], count: 0 } })
    const filters = {
      exportType: [],
      request_job_status: [],
      insert_datetime_gte: '2026-01-01',
      insert_datetime_lte: '2026-12-31'
    } as never
    await getDatalabExportsList(1, 5, { orderBy: 'created_at', orderDirection: 'asc' }, filters)
    expect(get).toHaveBeenCalledWith(
      '/exports/?limit=5&offset=0&ordering=created_at&created_at_gte=2026-01-01&created_at_lte=2026-12-31'
    )
  })

  it('returns an empty payload on error', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(
      getDatalabExportsList(1, 10, { orderBy: 'x', orderDirection: 'asc' }, emptyFilters)
    ).resolves.toEqual({ list: [], total: 0 })
  })
})

describe('retryExportRequest', () => {
  it('returns true on 200', async () => {
    post.mockResolvedValue({ status: 200 })
    await expect(retryExportRequest('abc')).resolves.toBe(true)
  })

  it('returns undefined when the request throws', async () => {
    post.mockRejectedValueOnce(new Error('boom'))
    await expect(retryExportRequest('abc')).resolves.toBeUndefined()
  })
})

describe('getExportLogs', () => {
  it('forwards the blob response on success', async () => {
    get.mockResolvedValue({ status: 200, data: new Blob(['log']) })
    const res = await getExportLogs('abc')
    expect(get).toHaveBeenCalledWith('/exports/abc/logs/', { responseType: 'blob' })
    expect(res.status).toBe(200)
  })

  it('rethrows when the request throws', async () => {
    const err = new Error('boom')
    get.mockRejectedValueOnce(err)
    await expect(getExportLogs('abc')).rejects.toBe(err)
  })
})
