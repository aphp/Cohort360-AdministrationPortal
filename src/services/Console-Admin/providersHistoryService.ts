import { AccessData, Order, Profile, Provider } from 'types'
import api from '../api'

export const getProfile = async (providerId?: string) => {
  if (!providerId) return undefined

  const profileResp = await api.get(`/profiles/?provider_id=${providerId}`)

  if (profileResp.status !== 200) {
    return undefined
  }

  return profileResp.data.results.sort((a: Profile, b: any) => a.cdm_source?.localeCompare(b.cdm_source)) ?? undefined
}

export const checkProfile = async (providerSourceValue?: string) => {
  try {
    if (!providerSourceValue) return null

    const resCheckProfiles = await api.post(`/profiles/check/`, {
      provider_source_value: providerSourceValue
    })

    return resCheckProfiles.data ?? null
  } catch (error) {
    console.error('Erreur lors de la recherche du provider', error)
    return
  }
}

export const submitCreateProfile = async (providerData: Provider) => {
  try {
    const createProfile = await api.post(`/profiles/`, providerData)
    return createProfile.status === 201
  } catch (error) {
    console.error('Erreur lors de la création de profil', error)
    return false
  }
}

export const editProfile = async (providerHistoryId: string, profileData: {}) => {
  try {
    const editProfileResp = await api.patch(`/profiles/${providerHistoryId}/`, profileData)

    return editProfileResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un profil", error)
    return false
  }
}

export const getAccesses = async (providerHistoryId: number, page: number, order: Order) => {
  const _orderDirection =
    order.orderBy === 'is_valid' ? (order.orderDirection === 'asc' ? 'desc' : 'asc') : order.orderDirection

  const accessesResp = await api.get(
    `/accesses/?page=${page}&provider_history_id=${providerHistoryId}&ordering=${
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

export const getUserAccesses = async (providerSourceValue?: string) => {
  try {
    const getUserAccessesResp = await api.get(`/accesses/?provider_source_value=${providerSourceValue}`)

    if (getUserAccessesResp.status !== 200) {
      return []
    }

    return getUserAccessesResp.data.results ?? []
  } catch (error) {
    console.error("Erreur lors de la récupération des accès de l'utilisateur", error)
    return []
  }
}

export const submitCreateAccess = async (accessData: AccessData) => {
  try {
    const createAccessResp = await api.post(`/accesses/`, accessData)

    return createAccessResp.status === 201
  } catch (error) {
    console.error("Erreur lors de la création d'un accès", error)
    return false
  }
}

export const submitEditAccess = async (editData: AccessData, careSiteHistoryId?: number) => {
  try {
    const editAccessResp = await api.patch(`/accesses/${careSiteHistoryId}/`, editData)

    return editAccessResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un accès", error)
    return false
  }
}

export const onDeleteOrTerminateAccess = async (terminateAccess: boolean, careSiteHistoryId?: number) => {
  try {
    if (terminateAccess) {
      const terminateAccessResp = await api.patch(`/accesses/${careSiteHistoryId}/close/`)

      return terminateAccessResp.status === 200
    } else {
      const deleteAccessResp = await api.delete(`/accesses/${careSiteHistoryId}/`)

      return deleteAccessResp.status === 204
    }
  } catch (error) {
    console.error("Erreur lors de la suppression ou la clôture d'un accès", error)
    return false
  }
}
