import { getUserAccesses } from "services/Console-Admin/providersHistoryService"
import { UserRole } from "types"

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
}

export const getUserRights = async (providerSourceValue?: string) => {
  try {
    let _userRights = userDefaultRoles
    const getUserRightsResponse = await getUserAccesses(providerSourceValue)

    if (getUserRightsResponse) {
      for (const access of getUserRightsResponse) {
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
          _userRights.right_edit_users = true
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
      }
    }

    return _userRights
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des habilitations de l'utilisateur"
    )
    return userDefaultRoles
  }
}
