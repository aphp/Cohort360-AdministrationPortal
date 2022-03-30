import api from 'services/api'
import { Access, UserRole } from 'types'

export const userDefaultRoles: UserRole = {
  right_edit_roles: false,
  right_read_logs: false,
  right_add_users: false,
  right_edit_users: false,
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
  right_read_patient_pseudo_anonymised: false,
  right_export_jupyter_patient_nominative: false,
  right_export_jupyter_patient_pseudo_anonymised: false,
  right_manage_review_transfer_jupyter: false,
  right_review_transfer_jupyter: false,
  right_manage_transfer_jupyter: false,
  right_transfer_jupyter_nominative: false,
  right_transfer_jupyter_pseudo_anonymised: false,
  right_manage_review_export_csv: false,
  right_review_export_csv: false,
  right_manage_export_csv: false,
  right_export_csv_nominative: false,
  right_export_csv_pseudo_anonymised: false,
  right_read_env_unix_users: false,
  right_manage_env_unix_users: false,
  right_manage_env_user_apps: false,
  right_manage_env_user_links: false
}

export const getMyAccesses = async () => {
  try {
    const getUserAccessesResp = await api.get(`/accesses/my-accesses/`)

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
          if (access.role.right_edit_roles) {
            _userRights.right_edit_roles = true
          }
          if (access.role.right_read_logs) {
            _userRights.right_read_logs = true
          }
          if (access.role.right_add_users) {
            _userRights.right_add_users = true
          }
          if (access.role.right_edit_users) {
            _userRights.right_edit_users = true
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
          if (access.role.right_read_patient_pseudo_anonymised) {
            _userRights.right_read_patient_pseudo_anonymised = true
          }
          if (access.role.right_export_jupyter_patient_nominative) {
            _userRights.right_export_jupyter_patient_nominative = true
          }
          if (access.role.right_export_jupyter_patient_pseudo_anonymised) {
            _userRights.right_export_jupyter_patient_pseudo_anonymised = true
          }
          if (access.role.right_export_jupyter_patient_pseudo_anonymised) {
            _userRights.right_export_jupyter_patient_pseudo_anonymised = true
          }
          if (access.role.right_manage_review_transfer_jupyter) {
            _userRights.right_manage_review_transfer_jupyter = true
          }
          if (access.role.right_review_transfer_jupyter) {
            _userRights.right_review_transfer_jupyter = true
          }
          if (access.role.right_manage_transfer_jupyter) {
            _userRights.right_manage_transfer_jupyter = true
          }
          if (access.role.right_transfer_jupyter_nominative) {
            _userRights.right_transfer_jupyter_nominative = true
          }
          if (access.role.right_transfer_jupyter_pseudo_anonymised) {
            _userRights.right_transfer_jupyter_pseudo_anonymised = true
          }
          if (access.role.right_manage_review_export_csv) {
            _userRights.right_manage_review_export_csv = true
          }
          if (access.role.right_review_export_csv) {
            _userRights.right_review_export_csv = true
          }
          if (access.role.right_manage_export_csv) {
            _userRights.right_manage_export_csv = true
          }
          if (access.role.right_export_csv_nominative) {
            _userRights.right_export_csv_nominative = true
          }
          if (access.role.right_export_csv_pseudo_anonymised) {
            _userRights.right_export_csv_pseudo_anonymised = true
          }
          if (access.role.right_read_env_unix_users) {
            _userRights.right_read_env_unix_users = true
          }
          if (access.role.right_manage_env_unix_users) {
            _userRights.right_manage_env_unix_users = true
          }
          if (access.role.right_manage_env_user_apps) {
            _userRights.right_manage_env_user_apps = true
          }
          if (access.role.right_manage_env_user_links) {
            _userRights.right_manage_env_user_links = true
          }
        }
      }
    }

    return _userRights
  } catch (error) {
    console.error("Erreur lors de la récupération des habilitations de l'utilisateur")
    return userDefaultRoles
  }
}
