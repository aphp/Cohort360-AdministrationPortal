import React, { useEffect, useState } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"

import { KeyboardDatePicker } from "@material-ui/pickers"
import ClearIcon from "@material-ui/icons/Clear"

import useStyles from "./styles"

type AddAccessFormProps = {
  open: boolean
  onClose: () => void
}

const AddAccessForm: React.FC<AddAccessFormProps> = ({ open, onClose }) => {
  const classes = useStyles()

  const [careSite, setCareSite] = useState() // provider_history_id
  const [role, setRole] = useState<{ name: string; role_id: number } | null>(
    null
  ) // role_id
  const [startDate, setStartDate] = useState<Date | null>(null) // caresite_id
  const [endDate, setEndDate] = useState<Date | null>(null) // start_datetime -> pas obligatoire, le back met automatiquement a aujourd'hui si non rempli, pas de date antérieure autorisée
  const [dateError, setDateError] = useState(false) // end_datetime -> peut être null

  const onSubmit = () => {
    // setOpen(false)
  }

  const fakeRoles = [
    {
      name: "ADMIN",
      role_id: 0,
    },
    {
      name: "ADMIN_USERS",
      role_id: 1,
    },
    {
      name: "READ_DATA_PSEUDOANONYMISED",
      role_id: 2,
    },
    {
      name: "READ_DATA_NOMINATIVE",
      role_id: 3,
    },
  ]

  const handleChangeAutocomplete = (
    event: React.ChangeEvent<{}>,
    value: { name: string; role_id: number } | null
  ) => {
    if (value) setRole(value)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Créer un nouvel accès :
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Périmètre :</Typography>
          {/* A faire */}
        </Grid>
        <Grid>
          <Typography variant="h3">Role :</Typography>
          <Autocomplete
            options={fakeRoles}
            getOptionLabel={(option) => option.name}
            onChange={handleChangeAutocomplete}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rechercher par..."
                variant="outlined"
              />
            )}
            value={role}
            style={{ width: "200px" }}
          />
        </Grid>
        <Grid container direction="column" className={classes.filter}>
          <Typography variant="h3">Date de début :</Typography>
          <Grid container alignItems="baseline" className={classes.datePickers}>
            <FormLabel component="legend" className={classes.label}>
              Après le :
            </FormLabel>
            <KeyboardDatePicker
              clearable
              error={dateError}
              style={{ width: "calc(100% - 120px)" }}
              invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
              format="DD/MM/YYYY"
              onChange={() => console.log("yeah")}
              // onChange={(date) => setStartDate(date ?? null)}
              value={startDate}
            />
            {startDate !== null && (
              <IconButton
                classes={{
                  root: classes.clearDate,
                  label: classes.buttonLabel,
                }}
                color="primary"
                onClick={() => setStartDate(null)}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Grid>

          <Grid container alignItems="baseline" className={classes.datePickers}>
            <FormLabel component="legend" className={classes.label}>
              Date de fin :
            </FormLabel>
            <KeyboardDatePicker
              clearable
              error={dateError}
              style={{ width: "calc(100% - 120px)" }}
              invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
              format="DD/MM/YYYY"
              onChange={() => console.log("yeaaaah")}
              // onChange={setEndDate}
              value={endDate}
            />
            {endDate !== null && (
              <IconButton
                classes={{
                  root: classes.clearDate,
                  label: classes.buttonLabel,
                }}
                color="primary"
                onClick={() => setEndDate(null)}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Grid>

          {dateError && (
            <Typography className={classes.error}>
              Vous ne pouvez pas sélectionner de date de début supérieure à la
              date de fin.
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={onSubmit} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAccessForm
