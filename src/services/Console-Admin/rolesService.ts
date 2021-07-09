import api from '../api'
import { Role } from '../../types'

export const getRoles = async () => {
    const rolesResp = await api.get(`/roles/`)

    if (rolesResp.status !== 200) {
        return undefined
    }
    return rolesResp.data.results ?? undefined
}


//have to finish the function of editing Role
export const submitEditRoles = async (editData: Role, role_id?: number) => {
    let success

    await api.patch(`/roles/${role_id}/`, editData)
    .then (res => {
        if (res.status === 200) {
            success = true
        } else {
            success = false
        }
    }).catch(error => {
        success = false
    })

    return success
}

export const createRoles = async (createData: Role) => {
    let success

    await api.post(`/roles/`, createData)
    .then(res => {
        if (res.status === 200) {
            success = true
        } else success = false
    }).catch(error => {
        success = false
    })

    return success
}

export const deleteRoles = async (role_id?: number) => {
    let success

    await api.delete(`/roles/${role_id}/`)
    .then(res => {
        if (res.status === 200) {
            success = true
        } else {
            success = false
        }
    }).catch(error => {
        success = false
    })

    return success
}