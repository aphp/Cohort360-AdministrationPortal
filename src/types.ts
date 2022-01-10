// --GENERAL--

// State

export type MeState = null | {
  providerId: number
  firstName: string | null
  lastName: string | null
  email: string | null
  providerSourceValue: string
  yearOfBirth: number | null
  displayName: string | null
  userRights: UserRole
  // [key: string]: number | string | boolean | Date | null
}

export type portailTopBar = null | boolean

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
  accesses: Access[]
}

// --CONSOLE-ADMIN--

// Service

export type CareSiteType = 'AP-HP' | 'Hopital' | 'Groupe Hospitalier'

export type CareSite = {
  care_site_id: number
  care_site_name: string
  care_site_short_name: string
  care_site_source_value: string
  care_site_type_source_value?: string
  parents_ids?: number[]
  children?: CareSite[]
}

export type ScopeTreeRow = {
  care_site_id: string | number
  name: string
  care_site_type_source_value: string
  children: ScopeTreeRow[]
}

// Profile

export type CheckProfile = Provider & {
  provider?: Provider
  manual_profile?: Profile
}

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
  provider: Provider
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

export type UserRole = {
  right_edit_roles: boolean | null
  right_read_logs: boolean | null
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
  right_manage_review_transfer_jupyter: boolean | null
  right_review_transfer_jupyter: boolean | null
  right_manage_transfer_jupyter: boolean | null
  right_transfer_jupyter_nominative: boolean | null
  right_transfer_jupyter_pseudo_anonymised: boolean | null
  right_manage_review_export_csv: boolean | null
  right_review_export_csv: boolean | null
  right_manage_export_csv: boolean | null
  right_export_csv_nominative: boolean | null
  right_export_csv_pseudo_anonymised: boolean | null
  right_read_env_unix_users: boolean | null
  right_manage_env_unix_users: boolean | null
  right_manage_env_users_apps: boolean | null
  right_manage_env_users_links: boolean | null
}

export type Role = UserRole & {
  role_id?: number
  insert_datetime?: string | null
  update_datetime?: string | null
  delete_datetime?: string | null
  help_text?: string[]
  name?: string
  invalid_reason?: string | null
}

export type RoleKeys =
  | 'name'
  | 'right_edit_roles'
  | 'right_add_users'
  | 'right_edit_users'
  | 'right_read_users'
  | 'right_manage_admin_accesses_same_level'
  | 'right_read_admin_accesses_same_level'
  | 'right_manage_admin_accesses_inferior_levels'
  | 'right_read_admin_accesses_inferior_levels'
  | 'right_manage_data_accesses_same_level'
  | 'right_read_data_accesses_same_level'
  | 'right_manage_data_accesses_inferior_levels'
  | 'right_read_data_accesses_inferior_levels'
  | 'right_read_patient_nominative'
  | 'right_read_patient_pseudo_anonymised'
  | 'right_export_jupyter_patient_nominative'
  | 'right_export_jupyter_patient_pseudo_anonymised'

// Access

export type Access = {
  id: string
  care_site_history_id: number
  is_valid: boolean
  provider_history: Provider
  provider_history_id: number
  care_site: CareSite
  role: { name: string; role_id: number; help_text: string[] }
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
  provider_history_id?: number
  care_site_id?: number | string
  role_id?: number
  start_datetime?: string | null
  end_datetime?: string | null
}

// Provider

export type Provider = {
  birth_date?: string
  cdm_source?: string
  delete_datetime?: string
  displayed_name?: string
  email?: string
  firstname?: string
  gender_concept_id?: number
  gender_source_concept_id?: number
  gender_source_value?: string
  insert_datetime?: string
  lastname?: string
  provider_id?: number
  provider_name?: string
  provider_source_value?: string
  specialty_concept_id?: number
  specialty_source_concept_id?: number
  specialty_source_value?: string
  update_datetime?: string
  year_of_birth?: number
}

export type Log = {
  data?: string
  errors?: string | null
  id?: number
  host?: string
  method?: string
  path?: string
  query_params?: string
  remote_addr?: string
  requested_at?: string
  response?: string
  response_ms?: number
  status_code?: number
  user?: number
  user_details: Provider
  username_persistent?: string
  view?: string
  view_method?: string
}

export type LogsFiltersObject = {
  url?: { label: string; code: string }
  user: null | string
  afterDate: null | string
  beforeDate: null | string
  statusCode: string[]
  httpMethod: string[]
  access: null | string
  careSite: {
    careSiteId: null | string | number
    careSiteName: null | string
  }
}

export type Order = {
  orderBy: string
  orderDirection: 'asc' | 'desc'
}
