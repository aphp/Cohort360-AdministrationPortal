import React, { useEffect, useState } from "react"
import moment from "moment"

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { KeyboardDatePicker } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"

import InfoIcon from "@material-ui/icons/Info"
import EditIcon from "@material-ui/icons/Edit"

import useStyles from "./styles"
import {
  getAssignableRoles,
  submitCreateAccess,
} from "services/Console-Admin/providersHistoryService"
import CareSitesDialog from "./components/CareSitesDialog/CareSitesDialog"
import { ScopeTreeRow } from "types"

type AddAccessFormProps = {
  open: boolean
  onClose: () => void
  entityId: number
  onSuccess: (success: boolean) => void
  onFail: (fail: boolean) => void
}

const AddAccessForm: React.FC<AddAccessFormProps> = ({
  open,
  onClose,
  entityId,
  onSuccess,
  onFail,
}) => {
  const classes = useStyles()

  const [careSite, setCareSite] = useState<ScopeTreeRow | null>(null)
  const [role, setRole] =
    useState<{ name: string; role_id: number } | null>(null)
  const [startDate, setStartDate] = useState<MaterialUiPickersDate | null>(
    moment()
  ) // pas de date antérieure à today autorisée
  const [endDate, setEndDate] = useState<MaterialUiPickersDate | null>(null)
  const [dateError, setDateError] = useState(false)
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getAssignableRoles(careSite?.care_site_id)
      .then((res) => {
        setRoles(res)
      })
      .finally(() => setLoading(false))
  }, [careSite])

  useEffect(() => {
    if (moment(startDate).isAfter(endDate)) {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }, [startDate, endDate])

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

    const accessData = {
      provider_history_id: entityId,
      care_site_id: careSite?.care_site_id,
      role_id: role?.role_id,
      start_datetime: stringStartDate,
      end_datetime: stringEndDate,
    }

    submitCreateAccess(accessData).then((success) => {
      if (success) {
        onSuccess(true)
      } else {
        onFail(true)
      }
    })

    setCareSite(null)
    setRoles([])
    setStartDate(null)
    setEndDate(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Créer un nouvel accès :
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.filter}
        >
          <Typography variant="h3">Périmètre :</Typography>
          {careSite ? (
            <>
              <Typography>{careSite.name}</Typography>
              <IconButton onClick={() => setOpenPerimeters(true)}>
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <Button
              variant="contained"
              disableElevation
              onClick={() => setOpenPerimeters(true)}
              className={classes.button}
            >
              Sélectionner un périmètre
            </Button>
          )}
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.filter}
        >
          <Typography variant="h3">Rôle :</Typography>
          {loading ? (
            <CircularProgress size={20} />
          ) : roles ? (
            <Autocomplete
              disabled={!roles}
              options={roles}
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
          ) : (
            <Typography>
              Choisir un périmètre pour obtenir les rôles disponibles.
            </Typography>
          )}
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
            minDate={moment()} // = today
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
            minDate={moment().add(1, "days")} // = tomorrow
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
        <div>
          <InfoIcon color="action" className={classes.infoIcon} />
          <Typography component="span">
            Si aucune date de fin n'est renseignée, celle-ci sera fixée à dans
            un an.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={!careSite || !role || dateError}
          onClick={onSubmit}
          color="primary"
        >
          Valider
        </Button>
      </DialogActions>

      <CareSitesDialog
        careSite={careSite}
        onChangeCareSite={setCareSite}
        open={openPerimeters}
        onClose={() => setOpenPerimeters(false)}
      />
    </Dialog>
  )
}

export default AddAccessForm
