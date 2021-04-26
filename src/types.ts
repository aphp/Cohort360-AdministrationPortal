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
