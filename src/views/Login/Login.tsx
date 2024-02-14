import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import logo from 'assets/images/portail-black.png'
import NoRights from 'components/Console-Admin/ErrorView/NoRights'
import { buildPartialUser } from 'services/Console-Admin/usersService'
import { authenticate } from 'services/authentication'
import { login as loginAction } from 'state/me'
import { ErrorDialogProps } from 'types'
import { getUserRights } from 'utils/userRoles'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import useStyles from './styles'
import { getValidAccesses } from '../../services/Console-Admin/profilesService'

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, setErrorLogin }) => {
  const _setErrorLogin = () => {
    if (setErrorLogin && typeof setErrorLogin === 'function') {
      setErrorLogin(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>Votre code APH ou votre mot de passe est incorrect</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={_setErrorLogin}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

const Login = () => {
  const navigate = useNavigate()
  const { classes } = useStyles()
  const dispatch = useDispatch()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorLogin, setErrorLogin] = useState<boolean>(false)
  const [noRights, setNoRights] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }, [])

  const onLogin = async () => {
    try {
      setLoading(true)
      if (!username || !password) {
        setLoading(false)
        return setErrorLogin(true)
      }

      const response = await authenticate(username, password)
      if (!response) {
        setLoading(false)
        return setErrorLogin(true)
      }

      const { status, data = {} } = response
      if (status === 200) {
        localStorage.setItem(ACCESS_TOKEN, data.access_token)
        localStorage.setItem(REFRESH_TOKEN, data.refresh_token)
        buildUserRights(data.user)
      } else {
        setLoading(false)
        setErrorLogin(true)
      }
    } catch (err) {
      console.error("Erreur lors de l'authentification", err)
      setLoading(false)
      setErrorLogin(true)
    }
  }

  const buildUserRights = async (user: any) => {
    const accesses = await getValidAccesses(user.username)
    const _userRights = await getUserRights(accesses)
      dispatch(loginAction(buildPartialUser(user, _userRights)))

      if (
        !_userRights.right_full_admin &&
        !_userRights.right_read_logs &&
        !_userRights.right_manage_users &&
        !_userRights.right_read_users &&
        !_userRights.right_manage_datalabs &&
        !_userRights.right_read_datalabs &&
        !_userRights.right_manage_admin_accesses_same_level &&
        !_userRights.right_read_admin_accesses_same_level &&
        !_userRights.right_manage_admin_accesses_inferior_levels &&
        !_userRights.right_read_admin_accesses_inferior_levels &&
        !_userRights.right_manage_data_accesses_same_level &&
        !_userRights.right_read_data_accesses_same_level &&
        !_userRights.right_manage_data_accesses_inferior_levels &&
        !_userRights.right_read_data_accesses_inferior_levels &&
        !_userRights.right_read_accesses_above_levels &&
        !_userRights.right_read_patient_nominative &&
        !_userRights.right_read_patient_pseudonymized &&
        !_userRights.right_search_opposed_patients &&
        !_userRights.right_search_patients_by_ipp &&
        !_userRights.right_manage_export_jupyter_accesses &&
        !_userRights.right_manage_export_csv_accesses &&
        !_userRights.right_export_csv_nominative &&
        !_userRights.right_export_csv_pseudonymized &&
        !_userRights.right_export_jupyter_nominative &&
        !_userRights.right_export_jupyter_pseudonymized
      ) {
        setNoRights(true)
      } else {
        navigate('/homepage')
      }
  }

  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    event.key === 'Enter' ? _onSubmit(event) : null
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'Identifiant') {
      setUsername(value)
    } else if (name === 'Votre mot de passe') {
      setPassword(value)
    }
  }

  useEffect(() => {
    localStorage.removeItem('users')
  })

  if (noRights) return <NoRights />

  return (
    <Grid container component="main" className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={false} sm={6} md={6} className={classes.image} />

        <Grid
          container
          item
          xs={12}
          sm={6}
          md={6}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className={classes.rightPanel}
        >
          <Grid container xs={8} lg={6} direction="column" alignItems="center" justifyContent="center">
            <img className={classes.logo} src={logo} alt="Logo Portail" />

            <Typography className={classes.bienvenue}>Bienvenue ! Connectez-vous.</Typography>

            <form className={classes.form} noValidate onSubmit={_onSubmit} onKeyDown={onKeyDown}>
              <Grid container direction="column" alignItems="center" justifyContent="center">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Identifiant"
                  label="Identifiant"
                  name="Identifiant"
                  autoComplete="Identifiant"
                  autoFocus
                  onChange={handleInputChange}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="Votre mot de passe"
                  label="Votre mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleInputChange}
                />

                <Button
                  disabled={loading || !username || !password}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {loading ? <CircularProgress /> : 'Connexion'}
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>

      <ErrorDialog open={errorLogin !== false} setErrorLogin={setErrorLogin} />
    </Grid>
  )
}

export default Login
