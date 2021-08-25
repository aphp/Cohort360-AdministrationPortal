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
    try {
        const editRoleResp = await api.patch(`/roles/${role_id}/`, editData)

        return editRoleResp.status === 200
    } catch(error) {
        console.error("Erreur lors l'édition d'un rôle", error)
        return false
    }
}

export const createRoles = async (createData: Role) => {
    try {
        const createRoleResp = await api.post(`/roles/`, createData)

        return createRoleResp.status === 200
    } catch(error) {
        console.error("Erreur lors de la création de rôle", error)
        return false
    }
}

export const deleteRoles = async (role_id?: number) => {
    try {
        const deleteRoleResp = await api.delete(`/roles/${role_id}/`)

        return deleteRoleResp.status === 200
    } catch(error) {
        console.error("Erreur lors de la suppression d'un rôle", error)
        return false
    }
}