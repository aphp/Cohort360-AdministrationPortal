import { RightsCategory, RightsDependency, Role, RoleKeys } from 'types'
import { userDefaultRoles } from 'utils/userRoles'

export const computeRightsDependencies = (categories: RightsCategory[]): RightsDependency[] => {
  const dependencies: RightsDependency[] = []
  categories.forEach((category) => {
    category.rights.forEach((right) => {
      if (right.depends_on) {
        dependencies.push({ dependent: right.name, dependency: right.depends_on })
      }
    })
  })
  return dependencies
}

export const computeDisabledRightsAfterToggle = (
  role: any,
  right: RoleKeys,
  value: boolean,
  dependencies: RightsDependency[],
  currentDisabled: string[]
): string[] => {
  let disabled = [...currentDisabled]
  if (right === 'right_full_admin') {
    for (const r in role) {
      if (r.startsWith('right_') && r !== right) {
        role[r] = value
        if (value) {
          disabled.push(r)
        } else {
          disabled = disabled.filter((dr) => dr !== r)
        }
      }
    }
  } else {
    dependencies.forEach((dep) => {
      if (dep.dependency === right) {
        if (value) {
          role[dep.dependent] = value
          disabled.push(dep.dependent)
        } else {
          disabled = disabled.filter((dr) => dr !== dep.dependent)
        }
      }
    })
  }
  return disabled
}

export const computeInitialDisabledRights = (role: any, dependencies: RightsDependency[]): string[] => {
  const disabled: string[] = []
  if (role['right_full_admin']) {
    for (const prop in role) {
      if (prop.startsWith('right_') && prop !== 'right_full_admin') {
        disabled.push(prop)
      }
    }
  } else {
    dependencies.forEach((dep) => {
      if (role[dep.dependency]) {
        disabled.push(dep.dependent)
      }
    })
  }
  return disabled
}

export const buildRolePayload = (role: Partial<Role> | null | undefined): Role => {
  const rightKeys = Object.keys(userDefaultRoles) as Array<keyof typeof userDefaultRoles>
  const payload: any = { name: role?.name }
  for (const key of rightKeys) {
    payload[key] = role?.[key] ?? false
  }
  return payload as Role
}
