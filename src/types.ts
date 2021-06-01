// --GENERAL--

// State

export type MeState = null |  {
  providerId: number
  firstName: string | null
  lastName: string | null
  email: string | null
  providerSourceValue: string
  yearOfBirth: number | null
  displayName: string | null
  // [key: string]: number | string | boolean | Date | null
}

// Authentication

export type Authentication = {
  status: number
  data: any
}

export type ErrorDialogProps = {
  open: boolean
  setErrorLogin: (b: boolean) => void
}

// Service

export type BackendUserReceived = {
  provider_id: number
  firstname: string | null
  lastname: string | null
  email: string | null
  provider_source_value: string
  displayed_name: string | null
  year_of_birth: number | null
  provider_name: string
  is_main_admin: boolean
  dea: string | null
  npi: string | null
}

// --CONSOLE-ADMIN--

// Service

export type CareSiteType = 
| "AP-HP"
| "Hopital"
| "Groupe Hospitalier"

export type BackendCareSite = {
  care_site_id: number
  care_site_name: string
  care_site_short_name: string
  parents_ids: number[]
  care_site_type_source_value?: string
}

export type ScopeTreeRow = {
  care_site_id: string | number
  name: string
  subItems: ScopeTreeRow[]
}

// Profile

export type Profile = {
  birth_date: string | null
  care_site_id: number | null
  cdm_source: string | null
  creation_datetime: string
  dea: string | null
  delete_datetime: string
  email: string | null
  entry_created_by: number
  entry_deleted_by: number
  firstname: string | null
  gender_concept_id: number | null
  gender_source_concept_id: number | null
  gender_source_value: number | null
  insert_datetime: string
  invalid_reason: string
  is_active: boolean | null
  key: string | null
  lastname: string | null
  manual_is_active: boolean | null
  manual_valid_end_datetime: string | null
  manual_valid_start_datetime: string | null
  modified_datetime: string
  npi: string | null
  provider: any
  provider_history_id: number
  provider_id: number
  provider_name: string | null
  provider_source_value: string | null
  specialty_concept_id: number | null
  specialty_source_concept_id: number | null
  specialty_source_value: string | null
  update_datetime: string 
  valid_end_datetime: string | null
  valid_start_datetime: string | null
  year_of_birth: number | null
}

// Roles

export type Roles = {
  role_id: number
  insert_datetime: string | null
  update_datetime: string | null
  delete_datetime: string | null
  name: string
  right_edit_roles: boolean | null
  right_add_users: boolean | null
  right_edit_users: boolean | null
  right_read_users: boolean | null
  right_manage_admin_accesses_same_level: boolean | null
  right_read_admin_accesses_same_level: boolean | null
  right_manage_admin_accesses_inferior_levels: boolean | null
  right_read_admin_accesses_inferior_levels: boolean | null
  right_manage_data_accesses_same_level: boolean | null
  right_read_data_accesses_same_level: boolean | null
  right_manage_data_accesses_inferior_levels: boolean | null
  right_read_data_accesses_inferior_levels: boolean | null
  right_read_patient_nominative: boolean | null
  right_read_patient_pseudo_anonymised: boolean | null
  right_export_jupyter_patient_nominative: boolean | null
  right_export_jupyter_patient_pseudo_anonymised: boolean | null
  invalid_reason: string | null
}

// Access

export type Access = {
  id: string
  care_site_history_id: number
  is_valid: boolean
  provider_history: any
  care_site: any
  role: any
  entry_created_by: number
  created_by: string
  start_datetime: string
  end_datetime: string
  actual_start_datetime: string
  actual_end_datetime: string
  care_site_id: number
  entity_id: number
  role_id: number
}

export type AccessData = {
  provider_history_id: number
  care_site_id?: number | string
  role_id?: number
  start_datetime: string | null
  end_datetime: string | null
}