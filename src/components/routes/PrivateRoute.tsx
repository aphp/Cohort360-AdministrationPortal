import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import { Redirect, useLocation } from 'react-router-dom'
import { useAppSelector } from 'state'
import { Route } from 'react-router'

import { ACCESS_TOKEN } from '../../constants'

type Props = React.ComponentProps<typeof Route>

const PrivateRoute: React.FC<Props> = (props) => {
  const authToken = localStorage.getItem(ACCESS_TOKEN)
  const me = useAppSelector((state) => state.me)
  const location = useLocation()

  const [allowRedirect, setRedirection] = useState(false)

  if (!me && !authToken) {
    if (allowRedirect === true)
      return (
        <Redirect
          to={{
            pathname: '/',
            state: { from: location }
          }}
        />
      )

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
  }

  return <Route {...props} />
}

export default PrivateRoute
