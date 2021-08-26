import { AccessData } from "types"
import api from "../api"

export const getProfile = async (providerId?: string) => {
  if (!providerId) return undefined

  const profileResp = await api.get(`/profiles/?provider_id=${providerId}`)

  if (profileResp.status !== 200) {
    return undefined
  }

  return profileResp.data.results ?? undefined
}

export const submitCreateProfile = async (
  firstName: string,
  lastName: string,
  providerSourceValue: string,
  email: string
) => {
  try {
    const profileData = {
      firstname: firstName,
      lastname: lastName,
      provider_source_value: providerSourceValue,
      email: email,
    }

    const resCheckProfiles = await api.post(`/profiles/check/`, {
      provider_source_value: providerSourceValue,
    })

    if (resCheckProfiles.status === 200) {
      const createProfile = await api.post(`/profiles/`, profileData)
      return createProfile.status === 201
    } else return false
  } catch (error) {
    console.error("Erreur lors de la création de profil", error)
    return false
  }
}

export const editProfile = async (
  providerHistoryId: string,
  profileData: {}
) => {
  try {
    const editProfileResp = await api.patch(
      `/profiles/${providerHistoryId}/`,
      profileData
    )

    return editProfileResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un profil", error)
    return false
  }
}

export const getAccesses = async (providerHistoryId: number, page: number) => {
  const accessesResp = await api.get(
    `/accesses/?page=${page}&provider_history_id=${providerHistoryId}&ordering=start_datetime`
  )

  if (accessesResp.status !== 200) {
    return undefined
  }

  return {
    accesses: accessesResp.data.results ?? undefined,
    total: accessesResp.data.count ?? 0,
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

export const submitEditAccess = async (
  editData: AccessData,
  careSiteHistoryId?: number
) => {
  try {
    const editAccessResp = await api.patch(
      `/accesses/${careSiteHistoryId}/`,
      editData
    )

    return editAccessResp.status === 200
  } catch (error) {
    console.error("Erreur lors de l'édition d'un accès", error)
    return false
  }
}

export const onDeleteAccess = async (careSiteHistoryId?: number) => {
  try {
    const deleteAccessResp = await api.delete(`/accesses/${careSiteHistoryId}/`)

    return deleteAccessResp.status === 204
  } catch (error) {
    console.error("Erreur lors de la suppression d'un accès", error)
    return false
  }
}
