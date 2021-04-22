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
  isMainAdmin: boolean
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

// --CONSOLE-ADMIN--