import React, { useEffect, useState } from "react"

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"

import InfoIcon from "@material-ui/icons/Info"

import useStyles from "./styles"
import {
  editProfile,
  getProfile,
} from "services/Console-Admin/providersHistoryService"
import { Profile, Provider } from "types"

type EditUserDialogProps = {
  open: boolean
  selectedProvider: Provider | null
  onClose: () => void
  onSuccess: (success: boolean) => void
  onFail: (fail: boolean) => void
}

const EditProviderDialog: React.FC<EditUserDialogProps> = ({
  open,
  selectedProvider,
  onClose,
  onSuccess,
  onFail,
}) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [providerHistoryId, setProviderHistoryId] = useState("")
  const [error, setError] = useState(false)
  const [firstName, setFirstName] = useState(selectedProvider?.firstname)
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastName, setLastName] = useState(selectedProvider?.lastname ?? "")
  const [lastNameError, setLastNameError] = useState(false)
  const [email, setEmail] = useState(selectedProvider?.email ?? "")
  const [emailError, setEmailError] = useState(false)

  useEffect(() => {
    const providerId = selectedProvider?.provider_id.toString()
    setLoading(true)
    getProfile(providerId)
      .then((profiles) => {
        if (profiles) {
          const manualProfile = profiles.find(
            (profile: Profile) => profile.cdm_source === "MANUAL"
          )

          setProviderHistoryId(manualProfile.provider_history_id)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  useEffect(() => {
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/

    if (lastName && !lastName.match(name)) {
      setLastNameError(true)
    } else {
      setLastNameError(false)
    }
  }, [lastName])

  useEffect(() => {
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/

    if (firstName && !firstName.match(name)) {
      setFirstNameError(true)
    } else setFirstNameError(false)
  }, [firstName])

  useEffect(() => {
    const aphpMail = /^[a-zA-Z0-9._-]+@aphp[.]fr$/

    if (email && !email.match(aphpMail)) {
      setEmailError(true)
    } else setEmailError(false)
  }, [email])

  const onSubmit = () => {
    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
    }

    editProfile(providerHistoryId, data).then((res) => {
      if (res) {
        onSuccess(true)
      } else {
        onFail(true)
      }
    })

    setFirstName("")
    setFirstNameError(false)
    setLastName("")
    setLastNameError(false)
    setEmail("")
    setEmailError(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Éditer un utilisateur :
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography>
            Erreur lors de l'édition du profil. Veuillez réessayer
            ultérieurement.
          </Typography>
        ) : (
          <>
            <Grid container direction="column" className={classes.filter}>
              <Typography variant="h3">Nom :</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                placeholder="Exemple: Dupont"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                error={lastNameError}
                helperText={
                  lastNameError &&
                  "Le nom ne peut pas contenir de chiffres ou de caractères spéciaux hormis ' et -."
                }
              />
            </Grid>
            <Grid container direction="column" className={classes.filter}>
              <Typography variant="h3">Prénom :</Typography>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                placeholder="Exemple: Jean"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                error={firstNameError}
                helperText={
                  firstNameError &&
                  "Le prénom ne peut pas contenir de chiffres ou de caractères spéciaux hormis ' et -."
                }
              />
            </Grid>
            <Typography variant="h3">Adresse e-mail :</Typography>
            <Grid container alignItems="center" justify="space-between">
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                placeholder="Exemple: jean.dupont@aphp.fr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={emailError}
                helperText={
                  emailError &&
                  `L'adresse e-mail doit être du format "prenom.nom@aphp.fr"`
                }
              />
            </Grid>
            <div>
              <InfoIcon color="action" className={classes.infoIcon} />
              <Typography component="span">
                Tous les champs sont obligatoires.
              </Typography>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={
            error ||
            firstNameError ||
            lastNameError ||
            emailError ||
            !firstName ||
            !lastName ||
            !email
          }
          onClick={onSubmit}
          color="primary"
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProviderDialog
