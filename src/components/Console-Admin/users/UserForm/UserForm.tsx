import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@mui/material'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import InfoIcon from '@mui/icons-material/Info'

import useStyles from './styles'
import { checkUser, editUser, submitCreateUser } from 'services/Console-Admin/usersService'
import { CheckUser, User } from 'types'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { USERNAME_REGEX } from '../../../../constants'

type UserFormProps = {
  open: boolean
  selectedUser: User
  onClose: () => void
  onAddUserSuccess: (success: boolean) => void
  onEditUserSuccess: (fail: boolean) => void
  onAddUserFail: (success: boolean) => void
  onEditUserFail: (fail: boolean) => void
}

const defaultUser: User = { username: '' }

const UserForm: React.FC<UserFormProps> = ({
  open,
  selectedUser,
  onClose,
  onAddUserSuccess,
  onEditUserSuccess,
  onAddUserFail,
  onEditUserFail
}) => {
  const { classes } = useStyles()

  const [user, setUser] = useState<CheckUser>(selectedUser)
  const [loadingUserData, setLoadingUserData] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  const [usernameError, setUsernameError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const isEdition = selectedUser?.username

  const _onChangeValue = (key: 'username' | 'firstname' | 'lastname' | 'email', value: any) => {
    const _user = user ? { ...user } : { ...defaultUser }
    _user[key] = value
    setUser(_user)
    console.log('********** _user: ', _user)
  }

  const debouncedSearchTerm = useDebounce(700, user.username)

  useEffect(() => {
    const _checkUser = async () => {
      setLoadingUserData(true)
      const checkUserResp: CheckUser = await checkUser(user.username)
      setUser(checkUserResp)
      setLoadingUserData(false)
    }

    if (!isEdition && debouncedSearchTerm && debouncedSearchTerm.length >= 1) {
      _checkUser()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/
    const aphpMail = /^[a-zA-Z0-9._-]+@aphp[.]fr$/

    if (user.username && !user.username.match(USERNAME_REGEX)) {
      setUsernameError(true)
    } else {
      setUsernameError(false)
    }

    if (user.lastname && !user.lastname.match(name)) {
      setLastNameError(true)
    } else {
      setLastNameError(false)
    }

    if (user.firstname && !user.firstname.match(name)) {
      setFirstNameError(true)
    } else {
      setFirstNameError(false)
    }

    if (user.email && user.email.length > 0 && !user.email.match(aphpMail)) {
      setEmailError(true)
    } else {
      setEmailError(false)
    }
  }, [user])

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)
      if (isEdition) {
        const userData = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }

        const editUserResp = await editUser(user.username, userData)

        editUserResp ? onEditUserSuccess(true) : onEditUserFail(true)
      } else {
        const userData = {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email
        }
        const createUserResp = await submitCreateUser(userData)

        createUserResp ? onAddUserSuccess(true) : onAddUserFail(true)
      }

      setLoadingOnValidate(false)

      setUser(defaultUser)
      onClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEdition ? "l'édition" : 'la création'} de l'utilisateur`, error)
      isEdition ? onEditUserFail(true) : onAddUserFail(true)

      setUser(defaultUser)
      setLoadingOnValidate(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdition ? 'Éditer un utilisateur :' : 'Créer un nouvel utilisateur :'}</DialogTitle>
      <DialogContent className={classes.dialog}>
        {loadingUserData ? (
          <Grid container justifyContent="center" style={{ padding: 16 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            {!isEdition && (
              <Grid container direction="column">
                <Typography variant="h6">Identifiant APH :</Typography>
                <TextField
                  margin="normal"
                  autoFocus
                  placeholder="Exemple: 4010101"
                  value={user.username}
                  onChange={(event) => _onChangeValue('username', event.target.value)}
                  error={usernameError}
                  helperText={usernameError && "Le format de cet identifiant APH n'est pas valide."}
                  style={{ margin: '1em' }}
                />
              </Grid>
            )}
            {(isEdition || user.found) && (
              <>
                <Grid container direction="column">
                  <Typography variant="h6">Nom :</Typography>
                  <TextField
                    margin="normal"
                    autoFocus
                    placeholder="Exemple: Dupont"
                    value={user.lastname}
                    onChange={(event) => _onChangeValue('lastname', event.target.value)}
                    error={lastNameError}
                    helperText={
                      lastNameError &&
                      "Le nom ne peut pas contenir de chiffres ou de caractères spéciaux hormis ' et -."
                    }
                    style={{ margin: '1em' }}
                  />
                </Grid>
                <Grid container direction="column">
                  <Typography variant="h6">Prénom :</Typography>
                  <TextField
                    margin="normal"
                    autoFocus
                    placeholder="Exemple: Jean"
                    value={user.firstname}
                    onChange={(event) => _onChangeValue('firstname', event.target.value)}
                    error={firstNameError}
                    helperText={
                      firstNameError &&
                      "Le prénom ne peut pas contenir de chiffres ou de caractères spéciaux hormis ' et -."
                    }
                    style={{ margin: '1em' }}
                  />
                </Grid>
                <Grid container direction="column">
                  <Typography variant="h6">Adresse e-mail :</Typography>
                  <TextField
                    margin="normal"
                    autoFocus
                    placeholder="Exemple: jean.dupont@aphp.fr"
                    value={user.email}
                    onChange={(event) => _onChangeValue('email', event.target.value)}
                    error={emailError}
                    helperText={emailError && `L'adresse e-mail doit être du format "prenom.nom@aphp.fr"`}
                    style={{ margin: '1em' }}
                  />
                </Grid>
                <div>
                    <InfoIcon color="action" className={classes.infoIcon} />
                    <Typography component="span">Tous les champs sont obligatoires.</Typography>
                  </div>
              </>
            )}
            {(!isEdition && user.username) && (
              user.already_exists ? (
              <div>
                <ErrorOutlineIcon color="error" className={classes.infoIcon} />
                <Typography component="span" color="secondary">
                  Cet utilisateur existe déjà.
                </Typography>
              </div>
              ) : (user.found !== undefined && !user.found) ? (
              <div>
                <ErrorOutlineIcon color="error" className={classes.infoIcon} />
                <Typography component="span" color="secondary">Aucun utilisateur trouvé.</Typography>
              </div>
             ) : (<></>)
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={
            loadingOnValidate ||
            usernameError ||
            lastNameError ||
            firstNameError ||
            emailError ||
            (!isEdition && user?.already_exists) ||
            !user.username ||
            !user.firstname ||
            !user.lastname ||
            !user.email
          }
          onClick={onSubmit}
          color="primary"
        >
          {loadingOnValidate ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserForm
