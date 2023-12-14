import api from 'services/api'
import { Access, UserRole } from 'types'

export const userDefaultRoles: UserRole = {
  right_full_admin: false,
  right_read_logs: false,
  right_manage_users: false,
  right_read_users: false,
  right_manage_admin_accesses_same_level: false,
  right_read_admin_accesses_same_level: false,
  right_manage_admin_accesses_inferior_levels: false,
  right_read_admin_accesses_inferior_levels: false,
  right_manage_data_accesses_same_level: false,
  right_read_data_accesses_same_level: false,
  right_manage_data_accesses_inferior_levels: false,
  right_read_data_accesses_inferior_levels: false,
  right_read_patient_nominative: false,
  right_read_patient_pseudonymized: false,
  right_search_patients_by_ipp: false,
  right_search_opposed_patients: false,
  right_manage_export_jupyter_accesses: false,
  right_manage_export_csv_accesses: false,
  right_export_jupyter_nominative: false,
  right_export_jupyter_pseudonymized: false,
  right_export_csv_nominative: false,
  right_export_csv_pseudonymized: false,
  right_manage_datalabs: false,
  right_read_datalabs: false,
  right_read_accesses_above_levels: false
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

    if (userRightsResponse && userRightsResponse.length > 0) {
      for (const access of userRightsResponse) {
        if (access.is_valid) {
          if (access.role.right_full_admin) {
            _userRights.right_full_admin = true
          }
          if (access.role.right_read_logs) {
            _userRights.right_read_logs = true
          }
          if (access.role.right_manage_users) {
            _userRights.right_manage_users = true
          }
          if (access.role.right_read_users) {
            _userRights.right_read_users = true
          }
          if (access.role.right_manage_admin_accesses_same_level) {
            _userRights.right_manage_admin_accesses_same_level = true
          }
          if (access.role.right_read_admin_accesses_same_level) {
            _userRights.right_read_admin_accesses_same_level = true
          }
          if (access.role.right_manage_admin_accesses_inferior_levels) {
            _userRights.right_manage_admin_accesses_inferior_levels = true
          }
          if (access.role.right_read_admin_accesses_inferior_levels) {
            _userRights.right_read_admin_accesses_inferior_levels = true
          }
          if (access.role.right_manage_data_accesses_same_level) {
            _userRights.right_manage_data_accesses_same_level = true
          }
          if (access.role.right_read_data_accesses_same_level) {
            _userRights.right_read_data_accesses_same_level = true
          }
          if (access.role.right_manage_data_accesses_inferior_levels) {
            _userRights.right_manage_data_accesses_inferior_levels = true
          }
          if (access.role.right_read_data_accesses_inferior_levels) {
            _userRights.right_read_data_accesses_inferior_levels = true
          }
          if (access.role.right_read_patient_nominative) {
            _userRights.right_read_patient_nominative = true
          }
          if (access.role.right_read_patient_pseudonymized) {
            _userRights.right_read_patient_pseudonymized = true
          }
          if (access.role.right_manage_export_jupyter_accesses) {
            _userRights.right_manage_export_jupyter_accesses = true
          }
          if (access.role.right_export_jupyter_nominative) {
            _userRights.right_export_jupyter_nominative = true
          }
          if (access.role.right_export_jupyter_pseudonymized) {
            _userRights.right_export_jupyter_pseudonymized = true
          }
          if (access.role.right_manage_export_csv_accesses) {
            _userRights.right_manage_export_csv_accesses = true
          }
          if (access.role.right_export_csv_nominative) {
            _userRights.right_export_csv_nominative = true
          }
          if (access.role.right_export_csv_pseudonymized) {
            _userRights.right_export_csv_pseudonymized = true
          }
          if (access.role.right_read_datalabs) {
            _userRights.right_read_datalabs = true
          }
          if (access.role.right_manage_datalabs) {
            _userRights.right_manage_datalabs = true
          }
          if (access.role.right_search_opposed_patients) {
            _userRights.right_search_opposed_patients = true
          }
          if (access.role.right_search_patients_by_ipp) {
            _userRights.right_search_patients_by_ipp = true
          }
          if (access.role.right_read_accesses_above_levels) {
            _userRights.right_read_accesses_above_levels = true
          }
        }
      }
    }

    return _userRights
  } catch (error) {
    console.error("Erreur lors de la récupération des droits de l'utilisateur")
    return userDefaultRoles
  }
}
