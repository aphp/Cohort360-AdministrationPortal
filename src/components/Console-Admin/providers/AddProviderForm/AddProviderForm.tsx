import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import useStyles from "./styles";

type AddUserDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const AddProviderDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const classes = useStyles();

  const [providerSourceValue, setProviderSourceValue] = useState("");
  const [providerSourceValueError, setProviderSourceValueError] = useState(
    false
  );
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const sevenInt = /^[0-9]{7}$/;

    if (providerSourceValue && !providerSourceValue.match(sevenInt)) {
      setProviderSourceValueError(true);
    } else setProviderSourceValueError(false);
  }, [providerSourceValue]);

  useEffect(() => {
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/;

    if (lastName && !lastName.match(name)) {
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
  }, [lastName]);

  useEffect(() => {
    const name = /^([ \u00c0-\u01ffa-zA-Z'-])+$/;

    if (firstName && !firstName.match(name)) {
      setFirstNameError(true);
    } else setFirstNameError(false);
  }, [firstName]);

  useEffect(() => {
    const aphpMail = /^[a-zA-Z0-9._-]+@aphp[.]fr$/;

    if (email && !email.match(aphpMail)) {
      setEmailError(true);
    } else setEmailError(false);
  }, [email]);

  const _onSubmit = () => {
    if (!providerSourceValue) setProviderSourceValueError(true);
    if (!firstName) setFirstNameError(true);
    if (!lastName) setLastNameError(true);
    if (!email) setEmailError(true);

    onSubmit();
  };

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
          />
        </Grid>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">E-mail :</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            autoFocus
            placeholder="Exemple: jean.dupont@aphp.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={_onSubmit} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProviderDialog;
