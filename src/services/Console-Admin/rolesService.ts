import api from '../api'
import { Role } from '../../types'

export const getRoles = async () => {
  const rolesResp = await api.get(`/roles/?ordering=name`)

  if (rolesResp.status !== 200) {
    return undefined
  }
  return rolesResp.data.results ?? undefined
}

export const getAssignableRoles = async (careSiteId?: string | number | null) => {
  if (!careSiteId) return undefined

  const assignableRolesResp = await api.get(`/roles/assignable/?care_site_id=${careSiteId}`)

  if (assignableRolesResp.status !== 200) {
    return undefined
  }

  const assignableRoles =
    assignableRolesResp.data.results.sort((a: Role, b: Role) => {
      if (a.name && b.name) {
        if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        }
        return 0
      } else return 0
    }) ?? undefined

  return assignableRoles
}

//have to finish the function of editing Role
export const submitEditRoles = async (editData: Role, role_id?: number) => {
  try {
    const editRoleResp = await api.patch(`/roles/${role_id}/`, editData)

    return editRoleResp.status === 200
  } catch (error) {
    console.error("Erreur lors l'édition d'une habilitation", error)
    return false
  }
}

export const createRoles = async (createData: Role) => {
  try {
    const createRoleResp = await api.post(`/roles/`, createData)

    return createRoleResp.status === 201
  } catch (error) {
    console.error("Erreur lors de la création de l'habilitation", error)
    return false
  }
}

export const deleteRole = async (role_id?: number) => {
  try {
    const deleteRoleResp = await api.delete(`/roles/${role_id}/`)

    return deleteRoleResp.status === 204
  } catch (error) {
    console.error("Erreur lors de la suppression d'une habilitation", error)
    return false
  }
}
