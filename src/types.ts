// --GENERAL--

// State

// export type IReduxStore = {
//   me: 
// }

export type MeState = null | {
  providerId: number
  firstName: string | null
  lastName: string | null
  email: string | null
  providerSourceValue: string
  yearOfBirth: number | null
  displayName: string | null
  // [key: string]: number | string | boolean | Date | null
}

export interface BackendUser {
  provider_source_value: string;
  birth_date: Date | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  care_site_id: number | null;
}

export interface BackendUserReceived extends BackendUser{
  displayed_name: string | null;
  year_of_birth: number | null;
  provider_id: number;
  provider_name: string;
  is_main_admin: boolean;
  dea: string | null,
  npi: string | null,
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

// --CONSOLE-ADMIN--