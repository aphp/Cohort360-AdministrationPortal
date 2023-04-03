import React from 'react'

import { Alert, Snackbar } from '@mui/material'

type SnackbarTypeOfMessage = 'success' | 'error' | 'warning' | 'info' | undefined

type SnackbarProps = {
  onClose: () => any
  severity: SnackbarTypeOfMessage
  message: string
}

const CommonSnackbar: React.FC<SnackbarProps> = ({ onClose, severity, message }) => {
  return (
    <Snackbar open onClose={onClose} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CommonSnackbar
