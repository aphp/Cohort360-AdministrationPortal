import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'

vi.mock('utils/userRoles', async () => {
  const actual = await vi.importActual<typeof import('utils/userRoles')>('utils/userRoles')
  return { ...actual, getUserRights: vi.fn().mockResolvedValue(actual.userDefaultRoles) }
})
vi.mock('services/Console-Admin/perimetersService', () => ({
  getPerimeter: vi.fn().mockResolvedValue({
    care_site_id: 5,
    care_site_name: 'Hopital Test',
    care_site_short_name: 'HT',
    care_site_source_value: 'src',
    cohort_size: '42'
  }),
  getPerimeterAccesses: vi.fn().mockResolvedValue({ accesses: [], total: 0 })
}))
vi.mock('services/Console-Admin/rolesService', () => ({
  getRoles: vi.fn().mockResolvedValue([])
}))
vi.mock('components/Console-Admin/Accesses/AccessesTable/AccessesTable', () => ({
  default: () => <div data-testid="accesses-table" />
}))

import PerimeterHistory, { getPerimeterData } from './PerimeterHistory'
import { renderWithProviders } from 'test/renderWithProviders'

beforeEach(() => localStorage.clear())

describe('PerimeterHistory view', () => {
  it('renders the accesses table after loading', async () => {
    renderWithProviders(<PerimeterHistory />, {
      route: '/perimeter/5',
      routePath: '/perimeter/:perimeterId'
    })
    await waitForElementToBeRemoved(() => screen.queryAllByRole('progressbar')[0])
    expect(screen.getByTestId('accesses-table')).toBeInTheDocument()
  })
})

describe('getPerimeterData', () => {
  it('returns the four metric cards with the perimeter values', () => {
    const data = getPerimeterData({
      cohort_size: '42',
      count_allowed_users: 3,
      count_allowed_users_inferior_levels: 5,
      count_allowed_users_above_levels: 1
    } as never)
    expect(data).toHaveLength(4)
    expect(data.map((d) => d.number)).toEqual(['42', 3, 5, 1])
  })

  it('falls back to "-" when fields are missing', () => {
    const data = getPerimeterData(undefined)
    expect(data.map((d) => d.number)).toEqual(['-', '-', '-', '-'])
  })
})
