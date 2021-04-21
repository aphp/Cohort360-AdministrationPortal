//GENERAL

//Authentication

export type Authentication = {
    status: number
    data: any
}

export type ErrorDialogProps = {
    open: boolean
    setErrorLogin: (b: boolean) => void
  }

//CONSOLE-ADMIN