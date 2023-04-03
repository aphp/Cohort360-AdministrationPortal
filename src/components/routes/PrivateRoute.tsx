import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from 'state'

import { ACCESS_TOKEN } from '../../constants'

const PrivateRoute: React.FC = () => {
  const authToken = localStorage.getItem(ACCESS_TOKEN)
  const me = useAppSelector((state) => state.me)
  const location = useLocation()

  const [allowRedirect, setRedirection] = useState(false)

  if (!me || (!me && !authToken)) {
    if (allowRedirect === true) return <Navigate to="/" replace />

    return (
      <Dialog open aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{''}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Il semblerait que vous ne soyez plus connecté. Vous allez être redirigé vers la page de connexion.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              localStorage.setItem('old-path', location.pathname)
              setRedirection(true)
            }}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  } else {
    return <Outlet />
  }
}

export default PrivateRoute
