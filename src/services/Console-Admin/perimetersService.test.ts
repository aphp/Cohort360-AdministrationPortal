import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('services/api', () => ({
  default: { get: vi.fn() }
}))

import api from 'services/api'
import {
  getPerimeters,
  getManageablePerimeters,
  getPerimeter,
  getPerimeterAccesses,
  searchInPerimeters,
  getPerimetersChildren,
  getScopePerimeters
} from './perimetersService'

const get = api.get as ReturnType<typeof vi.fn>
beforeEach(() => get.mockReset())

describe('getPerimeters', () => {
  it('returns the results when present', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 1 }] } })
    await expect(getPerimeters()).resolves.toEqual([{ id: 1 }])
  })

  it('returns [] when results is empty', async () => {
    get.mockResolvedValue({ data: { results: [] } })
    await expect(getPerimeters()).resolves.toEqual([])
  })

  it('returns the loading placeholder when data is missing', async () => {
    get.mockResolvedValue({ data: null })
    await expect(getPerimeters()).resolves.toEqual([{ care_site_id: 'loading' }])
  })

  it('returns undefined when the response itself is missing', async () => {
    get.mockResolvedValue(undefined)
    await expect(getPerimeters()).resolves.toBeUndefined()
  })
})

describe('getManageablePerimeters', () => {
  it('returns data on success', async () => {
    get.mockResolvedValue({ status: 200, data: [{ id: 1 }] })
    await expect(getManageablePerimeters()).resolves.toEqual([{ id: 1 }])
  })

  it('returns [] when status is not 200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getManageablePerimeters()).resolves.toEqual([])
  })
})

describe('getPerimeter', () => {
  it('returns data on success', async () => {
    get.mockResolvedValue({ status: 200, data: { care_site_id: 1 } })
    await expect(getPerimeter('1')).resolves.toEqual({ care_site_id: 1 })
  })

  it('returns undefined on non-200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(getPerimeter('1')).resolves.toBeUndefined()
  })
})

describe('getPerimeterAccesses', () => {
  it('inverts the direction when ordering by is_valid', async () => {
    get.mockResolvedValue({ status: 200, data: { results: [{ id: 1 }], count: 1 } })
    await getPerimeterAccesses('5', { orderBy: 'is_valid', orderDirection: 'asc' }, true, false, 1, 'foo')
    expect(get).toHaveBeenCalledWith(
      '/accesses/accesses/?perimeter_id=5&include_parents=true&include_children=false&page=1&ordering=-is_valid&search=foo'
    )
  })

  it('returns undefined on non-200', async () => {
    get.mockResolvedValue({ status: 500 })
    await expect(
      getPerimeterAccesses('5', { orderBy: 'name', orderDirection: 'asc' }, false, false)
    ).resolves.toBeUndefined()
  })
})

describe('searchInPerimeters', () => {
  it('returns [] when no input is provided', async () => {
    await expect(searchInPerimeters(false)).resolves.toEqual([])
    expect(get).not.toHaveBeenCalled()
  })

  it('hits the manageable endpoint and returns data when isManageable is true', async () => {
    get.mockResolvedValue({ data: [{ id: 1 }] })
    const res = await searchInPerimeters(true, 'foo')
    expect(get).toHaveBeenCalledWith('/accesses/perimeters/manageable/?search=foo')
    expect(res).toEqual([{ id: 1 }])
  })

  it('hits the regular endpoint and returns results when isManageable is false', async () => {
    get.mockResolvedValue({ data: { results: [{ id: 2 }] } })
    const res = await searchInPerimeters(false, 'bar')
    expect(get).toHaveBeenCalledWith('/accesses/perimeters/?search=bar')
    expect(res).toEqual([{ id: 2 }])
  })

  it('returns [] when the request throws', async () => {
    get.mockRejectedValueOnce(new Error('boom'))
    await expect(searchInPerimeters(false, 'foo')).resolves.toEqual([])
  })
})

describe('getPerimetersChildren', () => {
  it('returns [] when perimeter is null', async () => {
    await expect(getPerimetersChildren(null)).resolves.toEqual([])
  })

  it('returns sorted children with a loading placeholder when getSubItem is false', async () => {
    get.mockResolvedValue({
      status: 200,
      data: {
        results: [
          { id: '2', names: { source_value: 'b', name: 'B' } },
          { id: '3', names: { source_value: 'a', name: 'A' } }
        ]
      }
    })
    const res = await getPerimetersChildren({ id: '1' } as never)
    expect(res.map((c) => c.name)).toEqual(['a - A', 'b - B'])
    expect(res[0].children).toEqual([{ id: 'loading', name: 'loading', type: 'loading', cohort_size: 'loading', children: [] }])
  })

  it('filters out children whose id matches the parent', async () => {
    get.mockResolvedValue({
      status: 200,
      data: {
        results: [
          { id: '1', names: { source_value: 'self', name: 'Self' } },
          { id: '2', names: { source_value: 'a', name: 'A' } }
        ]
      }
    })
    const res = await getPerimetersChildren({ id: '1' } as never)
    expect(res.map((c) => c.id)).toEqual(['2'])
  })
})

describe('getScopePerimeters', () => {
  it('builds and sorts scope rows from the loader, using existing children when provided', async () => {
    const loader = vi.fn().mockResolvedValue([
      {
        id: '1',
        source_value: 'b',
        name: 'B',
        children: [{ id: '11', names: { source_value: 'x', name: 'X' }, type: 't' }]
      },
      { id: '2', source_value: 'a', name: 'A', children: [] }
    ])
    get.mockResolvedValue({ status: 200, data: { results: [] } })
    const res = await getScopePerimeters(loader)
    expect(res.map((r) => r.name)).toEqual(['a - A', 'b - B'])
    expect(loader).toHaveBeenCalledTimes(1)
  })
})
