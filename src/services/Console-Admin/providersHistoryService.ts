import { AccessData, Role } from 'types'
import api from '../api'

export const getProfile = async (providerId?: string) => {
    if (!providerId) return undefined

    const profileResp = await api.get(`/profiles/?provider_id=${providerId}`)

    if (profileResp.status !== 200){
        return undefined
    }

    return profileResp.data.results ?? undefined
}

export const submitCreateProfile = async (firstName: string, lastName: string,
    providerSourceValue: string, email: string) => {
    try {
        const profileData = {
            firstname: firstName,
            lastname: lastName,
            provider_source_value: providerSourceValue,
            email: email
        }
        
        const resCheckProfiles = await api.post(`/profiles/check/`, {provider_source_value: providerSourceValue} )
        
        if (resCheckProfiles.status === 200){
            const createProfile = await api.post(`/profiles/`, profileData) 
            return createProfile.status === 201
        } else return false
    } catch (error) {
        console.error("Erreur lors de la création de profil", error)
        return false
    }
}

export const editProfile = async (providerHistoryId: string, profileData: {}) => {
    try {
        const editProfileResp = await api.patch(`/profiles/${providerHistoryId}/`, profileData)

        return editProfileResp.status === 200
    } catch (error){
        console.error("Erreur lors de l'édition d'un profil", error)
        return false
    }
}

export const getAccesses = async (providerHistoryId: number, page: number) => {
    const accessesResp = await api.get(`/accesses/?page=${page}&provider_history_id=${providerHistoryId}&ordering=start_datetime`)

    if (accessesResp.status !== 200){
        return undefined
    }

    return {
        accesses: accessesResp.data.results ?? undefined,
        total: accessesResp.data.count ?? 0
    }
}

export const submitCreateAccess = async (accessData: AccessData) => {
    try {
        const createAccessResp = await api.post(`/accesses/`, accessData)

        return createAccessResp.status === 201
    } catch(error){
        console.error("Erreur lors de la création d'un accès", error)
        return false
    }
}

export const submitEditAccess = async (editData: AccessData, careSiteHistoryId?: number) => {
    try {
        const editAccessResp = await api.patch(`/accesses/${careSiteHistoryId}/`, editData)

        return editAccessResp.status === 200
    } catch (error){
        console.error("Erreur lors de l'édition d'un accès", error)
        return false
    }
}

export const getAssignableRoles = async (careSiteId?: string | number | null) => {
    if (!careSiteId) return undefined

    const assignableRolesResp = await api.get(`/roles/assignable/?care_site_id=${careSiteId}`)

    if (assignableRolesResp.status !== 200){
        return undefined
    }

    const assignableRoles = assignableRolesResp.data.results.sort((a: Role, b: Role) => {
        if (a.name && b.name){
            if (a.name > b.name) {
                return 1
            } else if (a.name > b.name){
                return -1
            }
            return 0
        }
        else return 0
    }) ?? undefined

    return assignableRoles
}