//GENERAL

//Authentication

export type Authentication = {
    status: number
    data: {
        access: string
        refresh: string
    }
}

export type ErrorDialogProps = {
    open: boolean;
    setErrorLogin: (b: boolean) => void;
  };

//CONSOLE-ADMIN