import { AccessData, Order, Profile, Provider } from 'types'
import api from '../api'

export const getProfile = async (providerSourceValue?: string) => {
  if (!providerSourceValue) return undefined

  const profileResp = await api.get(`/accesses/profiles/?user_id=${providerSourceValue}`)

  if (profileResp.status !== 200) {
    return undefined
  }

  return profileResp.data.results.sort((a: Profile, b: any) => a.source?.localeCompare(b.source)) ?? undefined
}

export const checkProfile = async (username?: string) => {
  try {
    if (!username) return null

    const response = await api.post(`/accesses/profiles/check/`, {
      username: username
    })

    return response.data ?? null
  } catch (error) {
    console.error('Erreur lors de la vérification du profil', error)
    return
  }
}

export const submitCreateProfile = async (providerData: Provider) => {
  try {
    const createProfile = await api.post(`/accesses/profiles/`, providerData)
    return createProfile.status === 201
  } catch (error) {
    console.error('Erreur lors de la création du profil', error)
    return false
  }
}

export const editProfile = async (profileId: string, profileData: {}) => {
  try {
    const editProfileResp = await api.patch(`/accesses/profiles/${profileId}/`, profileData)

    return editProfileResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition du profil", error)
    return false
  }
}

export const getAccesses = async (providerHistoryId: number, page: number, order: Order) => {
  const _orderDirection =
    order.orderBy === 'is_valid' ? (order.orderDirection === 'asc' ? 'desc' : 'asc') : order.orderDirection

  const accessesResp = await api.get(
    `/accesses/accesses/?page=${page}&profile_id=${providerHistoryId}&ordering=${
      _orderDirection === 'desc' ? '-' : ''
    }${order.orderBy}`
  )

  if (accessesResp.status !== 200) {
    return undefined
  }

  return {
    accesses: accessesResp.data.results ?? undefined,
    total: accessesResp.data.count ?? 0
  }
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

export const submitEditAccess = async (editData: AccessData, careSiteHistoryId?: number) => {
  try {
    const editAccessResp = await api.patch(`/accesses/accesses/${careSiteHistoryId}/`, editData)

    return editAccessResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un accès", error)
    return false
  }
}

export const onDeleteOrTerminateAccess = async (terminateAccess: boolean, careSiteHistoryId?: number) => {
  try {
    if (terminateAccess) {
      const terminateAccessResp = await api.patch(`/accesses/accesses/${careSiteHistoryId}/close/`)

      return terminateAccessResp.status === 200
    } else {
      const deleteAccessResp = await api.delete(`/accesses/accesses/${careSiteHistoryId}/`)

      return deleteAccessResp.status === 204
    }
  } catch (error) {
    console.error("Erreur lors de la suppression ou la clôture d'un accès", error)
    return false
  }
}
