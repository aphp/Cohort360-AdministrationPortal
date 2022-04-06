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
} from '@material-ui/core'

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import InfoIcon from '@material-ui/icons/Info'

import useStyles from './styles'
import {
  checkProfile,
  editProfile,
  getProfile,
  submitCreateProfile
} from 'services/Console-Admin/providersHistoryService'
import { CheckProfile, Profile, Provider } from 'types'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

type ProviderFormProps = {
  open: boolean
  selectedProvider: Provider | null
  onClose: () => void
  onAddProviderSuccess: (success: boolean) => void
  onEditProviderSuccess: (fail: boolean) => void
  onAddProviderFail: (success: boolean) => void
  onEditProviderFail: (fail: boolean) => void
}

const defaultProvider: Provider = {
  provider_source_value: '',
  firstname: '',
  lastname: '',
  email: ''
}

const ProviderForm: React.FC<ProviderFormProps> = ({
  open,
  selectedProvider,
  onClose,
  onAddProviderSuccess,
  onEditProviderSuccess,
  onAddProviderFail,
  onEditProviderFail
}) => {
  const classes = useStyles()

  const [provider, setProvider] = useState<CheckProfile | null>(selectedProvider || defaultProvider)
  const [providerHistoryId, setProviderHistoryId] = useState('')
  const [loadingProviderData, setLoadingProviderData] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  const [error, setError] = useState(false)
  const [providerSourceValueError, setProviderSourceValueError] = useState(false)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const isEdition = selectedProvider?.provider_source_value

  const _onChangeValue = (key: 'provider_source_value' | 'firstname' | 'lastname' | 'email', value: any) => {
    const _provider = provider ? { ...provider } : {}
    _provider[key] = value
    setProvider(_provider)
  }

  useEffect(() => {
    const _getProfile = async () => {
      try {
        const providerSourceValue = provider?.provider_source_value?.toString()
        setLoadingProviderData(true)

        const profilesResp = await getProfile(providerSourceValue)

        if (profilesResp) {
          const manualProfile = profilesResp.find((profile: Profile) => profile.cdm_source === 'MANUAL')

          setProviderHistoryId(manualProfile.provider_history_id)
        }

        setLoadingProviderData(false)
      } catch (error) {
        console.error('Erreur lors de la récupération du profil', error)
        setError(true)
        setLoadingProviderData(false)
      }
    }

    if (isEdition) {
      _getProfile()
    }
  }, []) // eslint-disable-line

  const debouncedSearchTerm = useDebounce(700, provider?.provider_source_value)

  useEffect(() => {
    const _checkProfile = async () => {
      try {
        setLoadingProviderData(true)
        const checkProfileResp = await checkProfile(provider?.provider_source_value)

        if (checkProfileResp) {
          setProvider(checkProfileResp)
        } else {
          const _provider: Provider = {
            ...provider,
            firstname: '',
            lastname: '',
            email: ''
          }
          setProvider(_provider)
        }
        setLoadingProviderData(false)
      } catch (error) {
        console.error('Erreur lors de la vérification du profil')
        const _provider: Provider = {
          ...provider,
          firstname: '',
          lastname: '',
          email: ''
        }
        setProvider(_provider)
        setLoadingProviderData(false)
      }
    }

    if (!isEdition && debouncedSearchTerm && debouncedSearchTerm.length >= 5) {
      _checkProfile()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    const sevenInt = /^[0-9]{3,7}$/
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/
    const aphpMail = /^[a-zA-Z0-9._-]+@aphp[.]fr$/

    if (provider?.provider_source_value && !provider.provider_source_value.match(sevenInt)) {
      setProviderSourceValueError(true)
    } else {
      setProviderSourceValueError(false)
    }

    if (provider?.lastname && !provider.lastname.match(name)) {
      setLastNameError(true)
    } else {
      setLastNameError(false)
    }

    if (provider?.firstname && !provider.firstname.match(name)) {
      setFirstNameError(true)
    } else {
      setFirstNameError(false)
    }

    if (provider?.email && provider?.email.length > 0 && !provider.email.match(aphpMail)) {
      setEmailError(true)
    } else {
      setEmailError(false)
    }
  }, [provider])

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)
      if (isEdition) {
        const providerData = {
          firstname: provider?.firstname,
          lastname: provider?.lastname,
          email: provider?.email
        }

        const editProfileResp = await editProfile(providerHistoryId, providerData)

        editProfileResp ? onEditProviderSuccess(true) : onEditProviderFail(true)
      } else {
        const providerData = {
          firstname: provider?.firstname,
          lastname: provider?.lastname,
          provider_source_value: provider?.provider_source_value,
          email: provider?.email,
          provider_id: provider?.provider?.provider_id
        }
        const createProfileResp = await submitCreateProfile(providerData)

        createProfileResp ? onAddProviderSuccess(true) : onAddProviderFail(true)
      }

      setLoadingOnValidate(false)

      setProvider(defaultProvider)
      onClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEdition ? "l'édition" : 'la création'} de l'utilisateur`, error)
      isEdition ? onEditProviderFail(true) : onAddProviderFail(true)

      setProvider(defaultProvider)
      setLoadingOnValidate(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        {isEdition ? 'Éditer un utilisateur :' : 'Créer un nouvel utilisateur :'}
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {isEdition && loadingProviderData ? (
          <Grid container justify="center" style={{ padding: 16 }}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Typography>
            Erreur lors de l'édition de l'utilisateur. Veuillez réessayer ultérieurement ou vérifier vos droits.
          </Typography>
        ) : (
          <>
            {!isEdition && (
              <Grid container direction="column">
                <Typography variant="h6">Identifiant APH :</Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  autoFocus
                  placeholder="Exemple: 4010101"
                  value={provider?.provider_source_value}
                  onChange={(event) => _onChangeValue('provider_source_value', event.target.value)}
                  error={providerSourceValueError}
                  helperText={
                    providerSourceValueError &&
                    "L'identifiant APH ne doit contenir que des chiffres (entre 3 et 7 maximum)."
                  }
                  inputProps={{ maxlength: 7 }}
                  style={{ margin: '1em' }}
                />
              </Grid>
            )}
            {loadingProviderData ? (
              <Grid container justify="center" style={{ padding: 16 }}>
                <CircularProgress />
              </Grid>
            ) : provider?.firstname ? (
              provider?.manual_profile ? (
                <div>
                  <ErrorOutlineIcon color="secondary" className={classes.infoIcon} />
                  <Typography component="span" color="secondary">
                    Cet utilisateur possède déjà un profil.
                  </Typography>
                </div>
              ) : (
                <>
                  <Grid container direction="column">
                    <Typography variant="h6">Nom :</Typography>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      autoFocus
                      placeholder="Exemple: Dupont"
                      value={provider?.lastname}
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
                      variant="outlined"
                      margin="normal"
                      autoFocus
                      placeholder="Exemple: Jean"
                      value={provider?.firstname}
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
                      variant="outlined"
                      margin="normal"
                      autoFocus
                      placeholder="Exemple: jean.dupont@aphp.fr"
                      value={provider?.email}
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
              )
            ) : (
              <div>
                <ErrorOutlineIcon color="action" className={classes.infoIcon} />
                <Typography component="span">Veuillez entrer un identifiant APH valide.</Typography>
              </div>
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
            error ||
            providerSourceValueError ||
            lastNameError ||
            firstNameError ||
            emailError ||
            (!isEdition && provider?.manual_profile !== null) ||
            !provider?.provider_source_value ||
            !provider.firstname ||
            !provider.lastname ||
            !provider.email
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

export default ProviderForm
