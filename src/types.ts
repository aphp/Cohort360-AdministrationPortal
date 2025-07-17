// --GENERAL--

// State

export type MeState = null | {
  username: string
  firstName: string | null
  lastName: string | null
  email: string | null
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

// --CONSOLE-ADMIN--

// Service

export type CareSite = {
  care_site_id: number
  care_site_name: string
  care_site_short_name: string
  care_site_source_value: string
  care_site_type_source_value?: string
  parents_ids?: number[]
  children?: CareSite[]
  count_allowed_users?: number
  count_allowed_users_inferior_levels?: number
  count_allowed_users_above_levels?: number
  cohort_size: string
}

export enum CareSiteOrder {
  NAME = 'name',
  TYPE = 'type',
  COHORT_SIZE = 'cohort_size',
  COUNT_ALLOWED_USERS = 'count_allowed_users',
  COUNT_ALLOWED_USERS_INFERIOR_LEVELS = 'count_allowed_users_inferior_levels',
  COUNT_ALLOWED_USERS_ABOVE_LEVELS = 'count_allowed_users_above_levels'
}

export type Perimeter = {
  id: string
  type: string
  cohort_size: string
  names?: {
    name: string
    short: string
    source_value: string
  }
  children?: Perimeter[]
}

export type ScopeTreeRow = {
  id: string
  name: string
  type: string
  cohort_size: string
  children: ScopeTreeRow[]
  full_path?: string
  count_allowed_users?: number
  count_allowed_users_inferior_levels?: number
  count_allowed_users_above_levels?: number
}

// Profile

export type CheckUser = User & {
  already_exists?: boolean
  found?: boolean
}

export type Profile = {
  id: number
  provider_id: string | null
  firstname: string | null
  lastname: string | null
  email: string | null
  source: string | null
  is_active: boolean | null
}

// Roles

export type UserRole = {
  right_full_admin: boolean | null
  right_manage_users: boolean | null
  right_manage_datalabs: boolean | null
  right_read_datalabs: boolean | null
  right_manage_admin_accesses_same_level: boolean | null
  right_manage_admin_accesses_inferior_levels: boolean | null
  right_manage_data_accesses_same_level: boolean | null
  right_manage_data_accesses_inferior_levels: boolean | null
  right_read_patient_nominative: boolean | null
  right_read_patient_pseudonymized: boolean | null
  right_read_practitioner_data: boolean | null
  right_search_patients_by_ipp: boolean | null
  right_search_opposed_patients: boolean | null
  right_search_patients_unlimited: boolean | null
  right_export_jupyter_nominative: boolean | null
  right_export_jupyter_pseudonymized: boolean | null
  right_export_csv_xlsx_nominative: boolean | null
}


export type Role = {
  id?: number
  insert_datetime?: string | null
  update_datetime?: string | null
  delete_datetime?: string | null
  help_text?: string[]
  name?: string
} & UserRole

export type RoleKeys = 'name' | keyof UserRole

// Access

export type Access = {
  id: number
  is_valid: boolean
  profile: Profile
  profile_id: number
  care_site?: CareSite
  perimeter?: Perimeter
  perimeter_id?: string
  role: Role
  role_id: number
  created_by: string
  start_datetime: string
  end_datetime: string
  actual_start_datetime: string
  actual_end_datetime: string
  updated_by: string
  editable: boolean
}

export type AccessData = {
  profile_id?: number
  perimeter_id?: number | string
  role_id?: number
  start_datetime?: string | null
  end_datetime?: string | null
}

// User

export type User = {
  username: string
  firstname?: string
  lastname?: string
  email?: string
  display_name?: string
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
  user_details: User
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
  perimeter: {
    perimeterId: null | string
    perimeterName: null | string
  }
}

export type Order = {
  orderBy: string
  orderDirection: 'asc' | 'desc'
}

// Web contents

export type WebContentType = {
  label: string
  description: string
}

export type WebContentTypes = Record<string, WebContentType>

export type WebContentCreation = {
  title: string
  content: string
  content_type: string
  page: string
  metadata: Record<string, string>
}

export type WebContent = WebContentCreation & {
  id: number
  created_at: string
  modified_at: string
}

// Habilitation

export type UserInHabilitation = {
  provider_username: string
  firstname: string
  lastname: string
  perimeter: string
  start_datetime: string
  end_datetime: string
}

// --JUPYTER--

export type InfrastructureProvider = {
  uuid: string
  name: string
}

export type DatalabCreation = {
  name: string
  infrastructure_provider: string
}

export type Datalab = {
  uuid: string
  name: string
  created_at: string
  infrastructure_provider: InfrastructureProvider
}

export type Column = {
  label: string
  code?: string
  align: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  sortableColumn?: boolean
}

export type DatalabTransferForm = {
  user: User | null
  confidentiality: 'nomi' | 'pseudo'
  datalab: Datalab | null
  shiftDates: 'yes' | 'no'
  tables: DatalabTable[]
}

export type DatalabTable = {
  id: string
  name: string
  label: string
  subtitle?: string
  checked: boolean
  fhir_filter: SavedFilter | null
  fhir_filter_user: User | null
  cohort: Cohort | null
  cohort_user: User | null
  respect_table_relationships: boolean
  resourceType: ResourceType
}

export type Export = {
  uuid: string
  owner?: string
  output_format?: 'csv' | 'hive' | 'xlsx'
  cohort_id?: number
  cohort_name?: string
  patients_count?: string
  created_at?: string
  insert_datetime?: string
  request_job_status?:
    | 'new'
    | 'denied'
    | 'validated'
    | 'pending'
    | 'failed'
    | 'cancelled'
    | 'finished'
    | 'cleaned'
    | 'started'
    | 'unknown'
  target_datalab?: string
  target_name?: string
}

export type ExportFilters = {
  exportType: {
    display: string
    code: 'csv' | 'hive' | 'psql'
  }[]
  request_job_status: {
    display: string
    code: string
  }[]
  insert_datetime_gte: string | null
  insert_datetime_lte: string | null
}

export type Cohort = {
  owner: number
  name: string
  description: string
  dated_measure: number
  created_at: string
  request_job_status: string
  fhir_group_id: string
  uuid: string
}

export type ExportTableType = {
  id: string[]
  name: string
  label: string
  subtitle?: string
  resourceType: string
}

export type SavedFilter = {
  created_at: string
  deleted: string
  deleted_by_cascade: boolean
  fhir_resource: ResourceType
  fhir_version: string
  filter: string
  modified_at: string
  name: string
  owner: string
  uuid: string
}

export type SavedFiltersResults = {
  count: number
  next: string | null
  previous: string | null
  results: SavedFilter[]
}

// export enum RessourceType {
//   REQUEST = 'Request',
//   IPP_LIST = 'IPPList',
//   PATIENT = 'Patient',
//   ENCOUNTER = 'Encounter',
//   DOCUMENTS = 'DocumentReference',
//   PMSI = 'pmsi',
//   CONDITION = 'Condition',
//   PROCEDURE = 'Procedure',
//   CLAIM = 'Claim',
//   MEDICATION = 'Medication',
//   MEDICATION_REQUEST = 'MedicationRequest',
//   MEDICATION_ADMINISTRATION = 'MedicationAdministration',
//   BIO_MICRO = 'biologie_microbiologie',
//   OBSERVATION = 'Observation',
//   MICROBIOLOGIE = 'microbiologie',
//   PHYSIOLOGIE = 'physiologie',
//   IMAGING = 'ImagingStudy'
// }

export enum ResourceType {
  UNKNOWN = 'Unknown',
  IPP_LIST = 'IPPList',
  PATIENT = 'Patient',
  ENCOUNTER = 'Encounter',
  DOCUMENTS = 'DocumentReference',
  CONDITION = 'Condition',
  PROCEDURE = 'Procedure',
  CLAIM = 'Claim',
  MEDICATION_REQUEST = 'MedicationRequest',
  MEDICATION_ADMINISTRATION = 'MedicationAdministration',
  OBSERVATION = 'Observation',
  IMAGING = 'ImagingStudy',
  QUESTIONNAIRE = 'Questionnaire',
  QUESTIONNAIRE_RESPONSE = 'QuestionnaireResponse'
}

export type RightsCategory = {
  name: string
  is_global: boolean
  rights: RightInRole[]
}

export type RightInRole = {
  label: string
  name: RoleKeys
  depends_on: RoleKeys
}

export type RightsDependency = {
  dependent: RoleKeys
  dependency: RoleKeys
}

export type ContentManagementLabels = {
  contentType: string
  deleteMessage: string
  contentTypeGender: 'f' | 'm'
}
