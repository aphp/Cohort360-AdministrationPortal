import api from '../api'
import { Order, Role } from '../../types'

export const getRoles = async () => {
  const rolesResp = await api.get(`/accesses/roles/?ordering=name&limit=100`)

  if (rolesResp.status !== 200) {
    return undefined
  }
  return rolesResp.data.results ?? undefined
}

export const getAssignableRoles = async (perimeterId?: string | number | null) => {
  if (!perimeterId) return undefined

  const assignableRolesResp = await api.get(`/accesses/roles/assignable/?perimeter_id=${perimeterId}&limit=100`)

  if (assignableRolesResp.status !== 200) {
    return undefined
  }

  return (
    assignableRolesResp.data.sort((a: Role, b: Role) => {
      if (a.name && b.name) {
        if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        }
        return 0
      } else return 0
    }) ?? undefined
  )
}

//have to finish the function of editing Role
export const submitEditRoles = async (editData: Role, role_id?: number) => {
  try {
    const editRoleResp = await api.patch(`/accesses/roles/${role_id}/`, editData)

    return editRoleResp.status === 200
  } catch (error) {
    console.error("Erreur lors l'édition d'une habilitation", error)
    return false
  }
}

export const createRoles = async (createData: Role) => {
  try {
    const createRoleResp = await api.post(`/accesses/roles/`, createData)

    return createRoleResp.status === 201
  } catch (error) {
    console.error("Erreur lors de la création d'une habilitation", error)
    return false
  }
}

export const deleteRole = async (role_id?: number) => {
  try {
    const deleteRoleResp = await api.delete(`/accesses/roles/${role_id}/`)

    return deleteRoleResp.status === 204
  } catch (error) {
    console.error("Erreur lors de la suppression de l'habilitation", error)
    return false
  }
}

export const getRoleUser = async (roleId: string): Promise<string | undefined> => {
  const getRoleResp = await api.get(`/accesses/roles/${roleId}/`)
  return `${getRoleResp.data.name}`
}

export const getUsersRole = async (role_id: string, order: Order, page?: number, searchInput?: string) => {
  const searchFilter = searchInput ? `&filter_by_name=${searchInput}` : ''
  const getRoleUserResp = await api.get(
    `/accesses/roles/${role_id}/users/?page=${page}&order=${order.orderDirection === 'desc' ? '-' : ''}${
      order.orderBy
    }${searchFilter}`
  )
  if (getRoleUserResp.status === 204) getRoleUserResp.data = []

  return {
    accesses: getRoleUserResp.data.results ?? [],
    total: getRoleUserResp.data.count ?? 0
  }
}
