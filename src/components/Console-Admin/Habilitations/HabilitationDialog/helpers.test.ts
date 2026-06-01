import { describe, it, expect } from 'vitest'
import {
  computeRightsDependencies,
  computeDisabledRightsAfterToggle,
  computeInitialDisabledRights,
  buildRolePayload
} from './helpers'

describe('computeRightsDependencies', () => {
  it('returns an empty list when no right declares a dependency', () => {
    const deps = computeRightsDependencies([{ name: 'cat', rights: [{ name: 'a' }, { name: 'b' }] } as never])
    expect(deps).toEqual([])
  })

  it('flattens depends_on relations across categories', () => {
    const deps = computeRightsDependencies([
      { name: 'A', rights: [{ name: 'a' }, { name: 'b', depends_on: 'a' }] },
      { name: 'B', rights: [{ name: 'c', depends_on: 'a' }] }
    ] as never)
    expect(deps).toEqual([
      { dependent: 'b', dependency: 'a' },
      { dependent: 'c', dependency: 'a' }
    ])
  })
})

describe('computeDisabledRightsAfterToggle', () => {
  it('disables every other right when full_admin is enabled and forces them to true', () => {
    const role: any = { right_full_admin: true, right_manage_users: false, right_other: false }
    const disabled = computeDisabledRightsAfterToggle(role, 'right_full_admin' as never, true, [], [])
    expect(disabled.sort()).toEqual(['right_manage_users', 'right_other'])
    expect(role.right_manage_users).toBe(true)
    expect(role.right_other).toBe(true)
  })

  it('clears disabled rights when full_admin is turned off', () => {
    const role: any = { right_full_admin: false, right_manage_users: true, right_other: true }
    const disabled = computeDisabledRightsAfterToggle(
      role,
      'right_full_admin' as never,
      false,
      [],
      ['right_manage_users', 'right_other']
    )
    expect(disabled).toEqual([])
  })

  it('cascades a single dependency when a non-admin right is enabled', () => {
    const role: any = { right_a: true, right_b: false }
    const deps = [{ dependent: 'right_b', dependency: 'right_a' }] as never
    const disabled = computeDisabledRightsAfterToggle(role, 'right_a' as never, true, deps, [])
    expect(disabled).toEqual(['right_b'])
    expect(role.right_b).toBe(true)
  })

  it('removes the cascaded dependent from disabled when the parent is turned off', () => {
    const role: any = { right_a: false, right_b: true }
    const deps = [{ dependent: 'right_b', dependency: 'right_a' }] as never
    const disabled = computeDisabledRightsAfterToggle(role, 'right_a' as never, false, deps, ['right_b'])
    expect(disabled).toEqual([])
  })
})

describe('computeInitialDisabledRights', () => {
  it('disables every right except full_admin when full_admin is set', () => {
    const role = { right_full_admin: true, right_manage_users: true, right_other: false }
    expect(computeInitialDisabledRights(role, []).sort()).toEqual(['right_manage_users', 'right_other'])
  })

  it('disables only the dependent rights whose dependency is enabled when full_admin is unset', () => {
    const role = { right_full_admin: false, right_a: true, right_b: false }
    const deps = [
      { dependent: 'right_b', dependency: 'right_a' },
      { dependent: 'right_c', dependency: 'right_d' }
    ] as never
    expect(computeInitialDisabledRights(role, deps)).toEqual(['right_b'])
  })
})

describe('buildRolePayload', () => {
  it('produces a payload with every known right defaulting to false', () => {
    const payload: any = buildRolePayload({ name: 'Admin' })
    expect(payload.name).toBe('Admin')
    expect(payload.right_full_admin).toBe(false)
    expect(payload.right_manage_users).toBe(false)
  })

  it('keeps the rights that are explicitly set on the input', () => {
    const payload: any = buildRolePayload({ name: 'X', right_full_admin: true } as never)
    expect(payload.right_full_admin).toBe(true)
    expect(payload.right_manage_users).toBe(false)
  })

  it('handles a null/undefined role gracefully', () => {
    expect((buildRolePayload(null) as any).right_full_admin).toBe(false)
    expect((buildRolePayload(undefined) as any).name).toBeUndefined()
  })
})
