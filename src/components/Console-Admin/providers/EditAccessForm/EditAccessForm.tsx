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
import { ScopeTreeRow } from "types"

type EditAccessFormProps = {
  open: boolean
  onClose: () => void
  entityId: number
  access: any
}

const EditAccessForm: React.FC<EditAccessFormProps> = ({
  open,
  onClose,
  entityId,
  access,
}) => {
  const classes = useStyles()

  const [role, setRole] = useState<{ name: string; role_id: number } | null>(
    access.role
  )
  const [endDate, setEndDate] = useState<MaterialUiPickersDate | null>(
    moment(new Date(access.actual_end_datetime))
  )
  const [dateError, setDateError] = useState(false)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  console.log(`access`, access)
  useEffect(() => {
    setLoading(true)
    getAssignableRoles(access.care_site.care_site_id)
      .then((res) => {
        setRoles(res)
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  // useEffect(() => {
  //   setLoading(true)
  //   getAssignableRoles(careSite?.care_site_id)
  //     .then((res) => {
  //       setRoles(res)
  //     })
  //     .finally(() => setLoading(false))
  // }, [careSite])

  // useEffect(() => {
  //   if (moment(startDate).isAfter(endDate)) {
  //     setDateError(true)
  //   } else {
  //     setDateError(false)
  //   }
  // }, [startDate, endDate])

  const handleChangeAutocomplete = (
    event: React.ChangeEvent<{}>,
    value: { name: string; role_id: number } | null
  ) => {
    if (value) setRole(value)
  }

  const onSubmit = () => {
    const stringEndDate = moment(endDate).isValid()
      ? moment(endDate).format()
      : null

    const accessData = {
      provider_history_id: entityId,
      // care_site_id: careSite?.care_site_id,
      role_id: role?.role_id,
      end_datetime: stringEndDate,
    }

    // submitCreateAccess(accessData)

    // setCareSite(null)
    setRoles([])
    setEndDate(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        Éditer l'accès à {access.care_site.care_site_name}:
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.filter}
            >
              <Typography variant="h3">Rôle :</Typography>
              {roles ? (
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
              <Typography variant="h3">Date de fin :</Typography>
              <KeyboardDatePicker
                clearable
                minDate={moment().add(1, "days")} // = today
                error={dateError}
                style={{ width: "250px" }}
                invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
                format="DD/MM/YYYY"
                onChange={(date: MaterialUiPickersDate) =>
                  setEndDate(date ?? null)
                }
                value={endDate}
              />

              {dateError && (
                <Typography className={classes.error}>
                  Vous ne pouvez pas sélectionner de date de début supérieure à
                  la date de fin.
                </Typography>
              )}
            </Grid>
            <div>
              <InfoIcon color="action" className={classes.infoIcon} />
              <Typography component="span">
                Si aucune date de fin n'est renseignée, celle-ci sera fixée à
                dans un an.
              </Typography>
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button
          disabled={!role || dateError}
          onClick={onSubmit}
          color="primary"
        >
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAccessForm
