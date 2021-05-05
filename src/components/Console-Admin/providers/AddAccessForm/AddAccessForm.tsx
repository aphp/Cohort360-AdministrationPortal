import React, { useEffect, useState } from "react"
import moment from "moment"

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
import Autocomplete from "@material-ui/lab/Autocomplete"
import { KeyboardDatePicker } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"

import InfoIcon from "@material-ui/icons/Info"

import useStyles from "./styles"
import { submitCreateAccess } from "services/Console-Admin/providersHistoryService"

type AddAccessFormProps = {
  open: boolean
  onClose: () => void
  entityId: number
}

const AddAccessForm: React.FC<AddAccessFormProps> = ({
  open,
  onClose,
  entityId,
}) => {
  const classes = useStyles()

  const [careSite, setCareSite] = useState() // provider_history_id
  const [role, setRole] = useState<{ name: string; role_id: number } | null>(
    null
  ) // role_id
  const [startDate, setStartDate] = useState<MaterialUiPickersDate | null>(
    moment()
  ) // caresite_id
  const [endDate, setEndDate] = useState<MaterialUiPickersDate | null>(null) // start_datetime -> pas obligatoire, le back met automatiquement a aujourd'hui si non rempli, pas de date antérieure autorisée
  const [dateError, setDateError] = useState(false) // end_datetime -> peut être null

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

  const onSubmit = () => {
    const stringStartDate = moment(startDate).isValid()
      ? moment(startDate).format()
      : null

    const stringEndDate = moment(endDate).isValid()
      ? moment(endDate).format()
      : null

    console.log(`stringStartDate`, stringStartDate)

    const accessData = {
      entity_id: entityId,
      care_site_id: careSite,
      role_id: role?.role_id,
      start_datetime: stringStartDate,
      end_datetime: stringEndDate,
    }

    // submitCreateAccess(accessData)

    onClose()
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
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.filter}
        >
          <Typography variant="h3">Role :</Typography>
          <Autocomplete
            options={fakeRoles}
            getOptionLabel={(option) => option.name}
            onChange={handleChangeAutocomplete}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sélectionner un rôle..."
                variant="outlined"
              />
            )}
            value={role}
            style={{ width: "250px" }}
          />
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.filter}
        >
          <Typography variant="h3">Date de début :</Typography>
          <KeyboardDatePicker
            clearable
            error={dateError}
            style={{ width: "250px" }}
            invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
            format="DD/MM/YYYY"
            onChange={(date: MaterialUiPickersDate) =>
              setStartDate(date ?? null)
            }
            value={startDate}
          />
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.filter}
        >
          <Typography variant="h3">Date de fin :</Typography>
          <KeyboardDatePicker
            clearable
            error={dateError}
            style={{ width: "250px" }}
            invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
            format="DD/MM/YYYY"
            onChange={(date: MaterialUiPickersDate) => setEndDate(date ?? null)}
            value={endDate}
          />

          {dateError && (
            <Typography className={classes.error}>
              Vous ne pouvez pas sélectionner de date de début supérieure à la
              date de fin.
            </Typography>
          )}
        </Grid>
        <Grid container alignItems="center">
          <InfoIcon color="action" style={{ height: "20px" }} />
          <Typography component="span">
            Si aucune date n'est renseignée, la date de fin sera fixée à dans un
            an.
          </Typography>
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
