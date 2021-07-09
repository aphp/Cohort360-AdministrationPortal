import React, { useEffect, useState } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"

import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/Info"

import useStyles from "./styles"
import { editProfile } from "services/Console-Admin/providersHistoryService"
import { Provider } from "types"

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

  const [firstName, setFirstName] = useState(selectedProvider?.firstname)
  const [firstNameError, setFirstNameError] = useState(false)
  const [disableFirstName, setDisableFirstName] = useState(true)
  const [lastName, setLastName] = useState(selectedProvider?.lastname ?? "")
  const [lastNameError, setLastNameError] = useState(false)
  const [disableLastName, setDisableLastName] = useState(true)
  const [email, setEmail] = useState(selectedProvider?.email ?? "")
  const [emailError, setEmailError] = useState(false)
  const [disableEmail, setDisableEmail] = useState(true)

  console.log(`firstName`, firstName)
  console.log(`selectedProvider?.firstname`, selectedProvider?.firstname)

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
    // editProfile("", firstName, lastName, email).then((res) => {
    //   if (res) {
    //     onSuccess(true)
    //   } else {
    //     onFail(true)
    //   }
    // })

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
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Nom :</Typography>
          <Grid container alignItems="center" justify="space-between">
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
              disabled={disableLastName}
              style={{ width: "calc(100% - 50px)" }}
            />
            {disableLastName && (
              <IconButton
                onClick={() => {
                  setDisableLastName(false)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Prénom :</Typography>
          <Grid container alignItems="center" justify="space-between">
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
              disabled={disableFirstName}
              style={{ width: "calc(100% - 50px)" }}
            />
            {disableFirstName && (
              <IconButton
                onClick={() => {
                  setDisableFirstName(false)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Grid container direction="column" className={classes.filter}>
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
              disabled={disableEmail}
              style={{ width: "calc(100% - 50px)" }}
            />
            {disableEmail && (
              <IconButton
                onClick={() => {
                  setDisableEmail(false)
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Grid>
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
