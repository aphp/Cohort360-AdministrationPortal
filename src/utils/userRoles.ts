import api from 'services/api'
import { Access, UserRole } from 'types'

export const userDefaultRoles: UserRole = {
  right_full_admin: false,
  right_manage_users: false,
  right_manage_admin_accesses_same_level: false,
  right_manage_admin_accesses_inferior_levels: false,
  right_manage_data_accesses_same_level: false,
  right_manage_data_accesses_inferior_levels: false,
  right_read_patient_nominative: false,
  right_read_patient_pseudonymized: false,
  right_search_patients_by_ipp: false,
  right_search_opposed_patients: false,
  right_export_jupyter_nominative: false,
  right_export_jupyter_pseudonymized: false,
  right_export_csv_xlsx_nominative: false,
  right_manage_datalabs: false,
  right_read_datalabs: false,
  right_search_patients_unlimited: false
}

export const getMyAccesses = async () => {
  try {
    const getUserAccessesResp = await api.get(`/accesses/accesses/my-accesses/`)

    if (getUserAccessesResp.status !== 200) {
      return []
    }

    return getUserAccessesResp.data ?? []
  } catch (error) {
    console.error("Erreur lors de la récupération des accès de l'utilisateur", error)
    return []
  }
}

export const getUserRights = async (data?: Access[]) => {
  try {
    const _userRights = { ...userDefaultRoles }

    let userRightsResponse = null
    if (data) {
      userRightsResponse = data
    } else {
      userRightsResponse = await getMyAccesses()
    }

    if (userRightsResponse?.length > 0) {
      const rightKeys = Object.keys(userDefaultRoles) as Array<keyof UserRole>
      for (const access of userRightsResponse) {
        if (!access.is_valid) continue
        for (const key of rightKeys) {
          if (access.role[key]) {
            _userRights[key] = true
          }
        }
      }
    }

    return _userRights
  } catch (error) {
    console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
    return userDefaultRoles
  }
}
