import React, { useRef, useState, useEffect } from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { DialogContentText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import IdleTimer from 'react-idle-timer'
import axios from 'axios'

import { ACCESS_TOKEN, REFRESH_TOKEN, BACK_API_URL } from '../../constants'
import { logout as logoutAction } from 'state/me'
import useStyles from './styles'

const AutoLogoutContainer = () => {
  const classes = useStyles()

  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const inactifTimerRef = useRef(null)
  const sessionInactifTimerRef = useRef(null)

  const logout = () => {
    setDialogIsOpen(false)
    history.push('/')
    localStorage.removeItem('providers')
    localStorage.clear()
    dispatch(logoutAction())
    clearTimeout(sessionInactifTimerRef.current)
  }

  const onIdle = () => {
    setDialogIsOpen(true)
    sessionInactifTimerRef.current = setTimeout(logout, 60 * 1000)
  }

  const stayActive = () => {
    axios
      .post(`${BACK_API_URL}/accounts/refresh/`, {
        refresh: localStorage.getItem(REFRESH_TOKEN)
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access)
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        }
      })
    setDialogIsOpen(false)
    clearTimeout(sessionInactifTimerRef.current)
  }

  const refreshToken = async () => {
    await axios
      .post(`${BACK_API_URL}/accounts/refresh/`, {
        refresh: localStorage.getItem(REFRESH_TOKEN)
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access)
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        }
      })
  }

  useEffect(() => {
    refreshToken()

    setInterval(() => {
      refreshToken()
    }, 13 * 60 * 1000)
  }, [])

  return (
    <div>
      <Dialog open={dialogIsOpen}>
        <DialogContent>
          <DialogContentText variant="button" className={classes.title}>
            Vous allez être déconnecté car vous avez été inactif pendant 14 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={stayActive} className={classes.validateButton}>
            Restez connecté
          </Button>
          <Button onClick={logout}>Déconnexion</Button>
        </DialogActions>
      </Dialog>
      <IdleTimer ref={inactifTimerRef} timeout={14 * 60 * 1000} onIdle={onIdle}></IdleTimer>
    </div>
  )
}

export default AutoLogoutContainer
