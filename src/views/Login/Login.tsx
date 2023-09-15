import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
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

import { buildPartialUser } from 'services/Console-Admin/userService'
import { authenticate } from 'services/authentication'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import { login as loginAction } from 'state/me'
import logo from 'assets/images/portail-black.png'
import { ErrorDialogProps } from 'types'
import useStyles from './styles'
import NoRights from 'components/Console-Admin/ErrorView/NoRights'
import { getUserRights } from 'utils/userRoles'

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
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
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
        const _userRights = await getUserRights(data.accesses)
        dispatch(loginAction(buildPartialUser(data.provider, _userRights)))

        localStorage.setItem(ACCESS_TOKEN, data.jwt.access)
        localStorage.setItem(REFRESH_TOKEN, data.jwt.refresh)

        if (
          !_userRights.right_edit_roles &&
          !_userRights.right_read_logs &&
          !_userRights.right_add_users &&
          !_userRights.right_edit_users &&
          !_userRights.right_read_users &&
          !_userRights.right_manage_admin_accesses_same_level &&
          !_userRights.right_read_admin_accesses_same_level &&
          !_userRights.right_read_admin_accesses_above_levels &&
          !_userRights.right_manage_admin_accesses_inferior_levels &&
          !_userRights.right_read_admin_accesses_inferior_levels &&
          !_userRights.right_manage_data_accesses_same_level &&
          !_userRights.right_read_data_accesses_same_level &&
          !_userRights.right_manage_data_accesses_inferior_levels &&
          !_userRights.right_read_data_accesses_inferior_levels &&
          !_userRights.right_manage_review_transfer_jupyter &&
          !_userRights.right_review_transfer_jupyter &&
          !_userRights.right_manage_transfer_jupyter &&
          !_userRights.right_manage_review_export_csv &&
          !_userRights.right_review_export_csv &&
          !_userRights.right_manage_export_csv &&
          !_userRights.right_read_env_unix_users &&
          !_userRights.right_manage_env_unix_users &&
          !_userRights.right_manage_env_user_links
        ) {
          setNoRights(true)
        } else {
          navigate('/homepage')
        }
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

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onLogin()
  }

  useEffect(() => {
    localStorage.removeItem('providers')
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

            <form className={classes.form} noValidate onSubmit={_onSubmit}>
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
                  onChange={(event) => setUsername(event.target.value)}
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
                  onChange={(event) => setPassword(event.target.value)}
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
