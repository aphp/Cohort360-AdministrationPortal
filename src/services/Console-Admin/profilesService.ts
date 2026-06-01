import { AccessData, Order, Profile, User } from 'types'
import api from '../api'

export const getProfile = async (user_id?: string) => {
  if (!user_id) return undefined

  const profileResp = await api.get(`/accesses/profiles/?user_id=${user_id}`)

  if (profileResp.status !== 200) {
    return undefined
  }

  return profileResp.data.results.sort((a: Profile, b: any) => a.source?.localeCompare(b.source)) ?? undefined
}

export const getAccesses = async (profileId: number, page: number, order: Order) => {
  const _orderDirection =
    order.orderBy === 'is_valid' ? (order.orderDirection === 'asc' ? 'desc' : 'asc') : order.orderDirection

  const accessesResp = await api.get(
    `/accesses/accesses/?page=${page}&profile_id=${profileId}&ordering=${_orderDirection === 'desc' ? '-' : ''}${
      order.orderBy
    }`
  )

  if (accessesResp.status !== 200) {
    return undefined
  }

  return {
    accesses: accessesResp.data.results ?? undefined,
    total: accessesResp.data.count ?? 0
  }
}

export const getValidAccesses = async (username: string) => {
  const accessesResp = await api.get(`/accesses/accesses/my-accesses/`)

  if (accessesResp.status !== 200) {
    return undefined
  }
  return accessesResp.data
}

export const submitCreateAccess = async (accessData: AccessData) => {
  try {
    const createAccessResp = await api.post(`/accesses/accesses/`, accessData)

    return createAccessResp.status === 201
  } catch (error) {
    console.error("Erreur lors de la création d'un accès", error)
    return false
  }
}

export const submitEditAccess = async (editData: AccessData, accessId?: number) => {
  try {
    const editAccessResp = await api.patch(`/accesses/accesses/${accessId}/`, editData)

    return editAccessResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un accès", error)
    return false
  }
}

export const onDeleteOrTerminateAccess = async (terminateAccess: boolean, accessId?: number) => {
  try {
    if (terminateAccess) {
      const terminateAccessResp = await api.patch(`/accesses/accesses/${accessId}/close/`)

      return terminateAccessResp.status === 200
    } else {
      const deleteAccessResp = await api.delete(`/accesses/accesses/${accessId}/`)

      return deleteAccessResp.status === 204
    }
  } catch (error) {
    console.error("Erreur lors de la suppression ou la clôture d'un accès", error)
    return false
  }
}
