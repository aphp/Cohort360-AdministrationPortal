import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn() }
}))

import api from 'services/api'
import { getMyAccesses, getUserRights, userDefaultRoles } from './userRoles'

const mockedGet = api.get as ReturnType<typeof vi.fn>

describe('userDefaultRoles', () => {
  it('has every right set to false by default', () => {
    expect(Object.values(userDefaultRoles).every((v) => v === false)).toBe(true)
  })
})

describe('getMyAccesses', () => {
  beforeEach(() => mockedGet.mockReset())

  it('returns the data array when the request succeeds', async () => {
    mockedGet.mockResolvedValue({ status: 200, data: [{ is_valid: true }] })
    await expect(getMyAccesses()).resolves.toEqual([{ is_valid: true }])
  })

  it('returns an empty array when the status is not 200', async () => {
    mockedGet.mockResolvedValue({ status: 500, data: null })
    await expect(getMyAccesses()).resolves.toEqual([])
  })

  it('returns an empty array when the request throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedGet.mockRejectedValueOnce(new Error('network down'))
    await expect(getMyAccesses()).resolves.toEqual([])
    errorSpy.mockRestore()
  })
})

describe('getUserRights', () => {
  beforeEach(() => mockedGet.mockReset())

  it('aggregates rights across valid accesses (OR semantics)', async () => {
    const data = [
      {
        is_valid: true,
        role: { ...userDefaultRoles, right_full_admin: true }
      },
      {
        is_valid: true,
        role: { ...userDefaultRoles, right_read_patient_nominative: true }
      }
    ]
    const result = await getUserRights(data as never)
    expect(result.right_full_admin).toBe(true)
    expect(result.right_read_patient_nominative).toBe(true)
    expect(result.right_manage_users).toBe(false)
  })

  it('skips accesses flagged as invalid', async () => {
    const data = [{ is_valid: false, role: { ...userDefaultRoles, right_full_admin: true } }]
    const result = await getUserRights(data as never)
    expect(result.right_full_admin).toBe(false)
  })

  it('returns the default roles when no data is supplied and the api returns nothing', async () => {
    mockedGet.mockResolvedValue({ status: 200, data: [] })
    await expect(getUserRights()).resolves.toEqual(userDefaultRoles)
  })
})
