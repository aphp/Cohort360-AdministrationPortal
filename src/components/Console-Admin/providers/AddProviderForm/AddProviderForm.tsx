import React, { useEffect, useState } from "react"

import {
  Button,
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
import { submitCreateProfile } from "services/Console-Admin/providersHistoryService"

type AddUserDialogProps = {
  open: boolean
  onClose: () => void
  onSuccess: (success: boolean) => void
  onFail: (fail: boolean) => void
}

const AddProviderDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onSuccess,
  onFail,
}) => {
  const classes = useStyles()

  const [providerSourceValue, setProviderSourceValue] = useState("")
  const [providerSourceValueError, setProviderSourceValueError] =
    useState(false)
  const [firstName, setFirstName] = useState("")
  const [firstNameError, setFirstNameError] = useState(false)
  const [lastName, setLastName] = useState("")
  const [lastNameError, setLastNameError] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)

  useEffect(() => {
    const sevenInt = /^[0-9]{3,7}$/

    if (providerSourceValue && !providerSourceValue.match(sevenInt)) {
      setProviderSourceValueError(true)
    } else setProviderSourceValueError(false)
  }, [providerSourceValue])

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

  const resetAndCloseDialog = () => {
    setProviderSourceValue("")
    setProviderSourceValueError(false)
    setFirstName("")
    setFirstNameError(false)
    setLastName("")
    setLastNameError(false)
    setEmail("")
    setEmailError(false)
    onClose()
  }

  const onSubmit = async () => {
    try {
      const createProfileResp = await submitCreateProfile(
        firstName,
        lastName,
        providerSourceValue,
        email
      )

      createProfileResp ? onSuccess(true) : onFail(true)

      resetAndCloseDialog()
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur", error)
      onFail(true)
      resetAndCloseDialog()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Créer un nouvel utilisateur :
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Identifiant APH :</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            autoFocus
            placeholder="Exemple: 4010101"
            value={providerSourceValue}
            onChange={(event) => setProviderSourceValue(event.target.value)}
            error={providerSourceValueError}
            helperText={
              providerSourceValueError &&
              "L'identifiant APH ne doit contenir que des chiffres (entre 3 et 7 maximum)."
            }
            inputProps={{ maxlength: 7 }}
          />
        </Grid>
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
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Adresse e-mail :</Typography>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={
            providerSourceValueError ||
            firstNameError ||
            lastNameError ||
            emailError ||
            !providerSourceValue ||
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

export default AddProviderDialog
