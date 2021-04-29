import api from '../api'


export const submitGetProfile = async (profileId: string) => {
    const profileResp = await api.get(`/profiles/?provider_id=${profileId}`)

    if (profileResp.status !== 200){
        return undefined
    }

    return profileResp.data.results ?? undefined
}

export const submitCreateProfile = async () => {
    
}