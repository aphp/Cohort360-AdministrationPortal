import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn() }
}))

import api from 'services/api'
import { getUserCohorts, getUserFilters } from './cohortsService'

const get = api.get as ReturnType<typeof vi.fn>
beforeEach(() => get.mockReset())

describe('getUserCohorts', () => {
  it('returns [] when no username is provided', async () => {
    await expect(getUserCohorts()).resolves.toEqual([])
    expect(get).not.toHaveBeenCalled()
  })

  it('returns the results array on success', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }] } })
    await expect(getUserCohorts('jdoe')).resolves.toEqual([{ id: 1 }])
    expect(get).toHaveBeenCalledWith('/exports/cohorts/?owner_id=jdoe&limit=1000')
  })

  it('returns [] when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getUserCohorts('jdoe')).resolves.toEqual([])
  })
})

describe('getUserFilters', () => {
  it('returns [] when provider_source_value or fhir_resource is missing', async () => {
    await expect(getUserFilters('nomi')).resolves.toEqual([])
    await expect(getUserFilters('nomi', 'src')).resolves.toEqual([])
    expect(get).not.toHaveBeenCalled()
  })

  it('hits the right URL for nomi (no identifying flag)', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }] } })
    await getUserFilters('nomi', 'src', 'Patient' as never)
    expect(get).toHaveBeenCalledWith(
      '/exports/fhir-filters/?owner_id=src&fhir_resource=Patient&ordering=-created_at&limit=1000'
    )
  })

  it('appends identifying=false for pseudo confidentiality', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [] } })
    await getUserFilters('pseudo', 'src', 'Patient' as never)
    expect(get).toHaveBeenCalledWith(
      '/exports/fhir-filters/?owner_id=src&fhir_resource=Patient&identifying=false&ordering=-created_at&limit=1000'
    )
  })

  it('returns [] when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getUserFilters('nomi', 'src', 'Patient' as never)).resolves.toEqual([])
  })
})
