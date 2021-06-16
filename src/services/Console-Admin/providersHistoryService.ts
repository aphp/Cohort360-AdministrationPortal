import { AccessData } from 'types'
import api from '../api'

export const getProfile = async (profileId: string) => {
    const profileResp = await api.get(`/profiles/?provider_id=${profileId}`)

    if (profileResp.status !== 200){
        return undefined
    }

    return profileResp.data.results ?? undefined
}

export const submitCreateProfile = async (firstName: string, lastName: string,
    providerSourceValue: string, email: string) => {
    const profileData = {
        firstname: firstName,
        lastname: lastName,
        provider_source_value: providerSourceValue,
        email: email
    }

    let success

    api.post(`/profiles/check/`, {provider_source_value: providerSourceValue} )
    .then(res => { 
        if (res.status === 200) {
            api.post(`/profiles/`, profileData)
            .then(res => {
                if (res.status === 201) {
                    success = true   
                } else success = false
            })
        }
    })

    return success
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
    let success

    await api.post(`/accesses/`, accessData)
    .then(res => {
        if (res.status === 201) {
            success= true       
        } else success = false
    })

    return success
}

export const submitEditAccess = async (editData: AccessData, careSiteHistoryId?: number) => {
    let success 

    await api.patch(`/accesses/${careSiteHistoryId}/`, editData)
    .then(res => {
        if (res.status === 200){
            success = true
        } else success = false
    })

    return success
}

export const getAssignableRoles = async (careSiteId?: string | number | null) => {
    if (!careSiteId) return undefined

    const assignableRolesResp = await api.get(`/roles/assignable/?care_site_id=${careSiteId}`)

    if (assignableRolesResp.status !== 200){
        return undefined
    }

    return assignableRolesResp.data.results ?? undefined
}