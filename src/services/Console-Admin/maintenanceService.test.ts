import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
}))

import api from 'services/api'
import {
  listMaintenancePhases,
  deleteMaintenancePhase,
  createMaintenancePhase,
  updateMaintenancePhase
} from './maintenanceService'

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

const phase = {
  subject: 's',
  message: 'm',
  type: 'partial' as const,
  start_datetime: '2026-01-01',
  end_datetime: '2026-01-02',
  is_data_saved_message_hidden: false
}

describe('listMaintenancePhases', () => {
  it('returns results + total with default ordering on success', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1, ...phase, active: true }], count: 1 } })
    const res = await listMaintenancePhases()
    expect(get).toHaveBeenCalledWith('/maintenances/?ordering=-start_datetime&page=1&page_size=20')
    expect(res).toEqual({ results: [{ id: 1, ...phase, active: true }], total: 1 })
  })

  it('throws when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(listMaintenancePhases()).rejects.toThrow('Error while fetching maintenance phases')
  })
})

describe('deleteMaintenancePhase', () => {
  it('returns true on 204', async () => {
    del.mockResolvedValue({ status: 204 })
    await expect(deleteMaintenancePhase(1)).resolves.toBe(true)
  })

  it('returns false on non-204', async () => {
    del.mockResolvedValue({ status: 500 })
    await expect(deleteMaintenancePhase(1)).resolves.toBe(false)
  })

  it('throws when the request throws', async () => {
    del.mockRejectedValueOnce(new Error('boom'))
    await expect(deleteMaintenancePhase(1)).rejects.toThrow('Error while deleting MaintenancePhase')
  })
})

describe('createMaintenancePhase', () => {
  it('returns the created entity on 201', async () => {
    post.mockResolvedValue({ status: 201, data: { id: 7, ...phase, active: false } })
    const res = await createMaintenancePhase(phase)
    expect(post).toHaveBeenCalledWith('/maintenances/', phase)
    expect(res).toEqual({ id: 7, ...phase, active: false })
  })

  it('throws when status is not 201', async () => {
    post.mockResolvedValue({ status: 400 })
    await expect(createMaintenancePhase(phase)).rejects.toThrow('Error while creating MaintenancePhase')
  })
})

describe('updateMaintenancePhase', () => {
  it('returns the updated entity on 200', async () => {
    patch.mockResolvedValue({ status: 200, data: { id: 7, ...phase, active: true } })
    const res = await updateMaintenancePhase({ id: 7, ...phase, active: true }, 7)
    expect(patch).toHaveBeenCalledWith('/maintenances/7/', { id: 7, ...phase, active: true })
    expect(res).toEqual({ id: 7, ...phase, active: true })
  })

  it('throws when status is not 200', async () => {
    patch.mockResolvedValue({ status: 500 })
    await expect(updateMaintenancePhase({ id: 7, ...phase, active: true }, 7)).rejects.toThrow(
      'Error while updating MaintenancePhase'
    )
  })
})
