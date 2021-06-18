import api from '../api'

export const getRoles = async () => {
    const rolesResp = await api.get(`/roles/`)

    if (rolesResp.status !== 200) {
        return undefined
    }
    return rolesResp.data.results ?? undefined
}