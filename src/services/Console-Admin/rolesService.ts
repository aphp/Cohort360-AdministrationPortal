import { Role } from 'types'
import api from '../api'

export const getRoles = async () => {
    const rolesResp = await api.get(`/roles/`)

    if (rolesResp.status !== 200) {
        return undefined
    }
    
    const roles = rolesResp.data.results ? 
    rolesResp.data.results.sort((a: Role, b: Role) => {
        if (a.name > b.name) {
            return 1
        } else if (a.name > b.name){
            return -1
        }
        return 0
    }) : undefined

    return roles
    // return rolesResp.data.results ?? undefined
}