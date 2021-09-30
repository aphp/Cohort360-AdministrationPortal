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
  Tooltip,
  Typography,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { KeyboardDatePicker } from "@material-ui/pickers"
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date"

import InfoIcon from "@material-ui/icons/Info"
import EditIcon from "@material-ui/icons/Edit"

import useStyles from "./styles"
import { getAssignableRoles } from "services/Console-Admin/rolesService"
import { submitCreateAccess } from "services/Console-Admin/providersHistoryService"
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
  const [role, setRole] = useState<{
    name: string
    role_id: number
    help_text: string[]
  } | null>(null)
  const [startDate, setStartDate] = useState<MaterialUiPickersDate | null>(
    moment()
  ) // pas de date antérieure à today autorisée
  const [endDate, setEndDate] = useState<MaterialUiPickersDate | null>(null)
  const [dateError, setDateError] = useState(false)
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const _getAssignableRoles = async () => {
      try {
        setLoading(true)

        const assignableRolesResp = await getAssignableRoles(
          careSite?.care_site_id
        )

        setRoles(assignableRolesResp)

        setLoading(false)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des habilitations assignables",
          error
        )
        setLoading(false)
      }
    }

    _getAssignableRoles()
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
    value: { name: string; role_id: number; help_text: string[] } | null
  ) => {
    if (value) setRole(value)
  }

  const resetDialogAndClose = () => {
    setCareSite(null)
    setRoles([])
    setStartDate(null)
    setEndDate(null)
    onClose()
  }

  const onSubmit = async () => {
    try {
      const stringStartDate =
        moment(startDate).isValid() &&
        !moment(startDate).isSame(new Date(), "day")
          ? moment(startDate).format()
          : null

      const stringEndDate = moment(endDate).isValid()
        ? moment(endDate).format()
        : null

      let accessData = {
        provider_history_id: entityId,
        care_site_id: careSite?.care_site_id,
        role_id: role?.role_id,
      }

      if (stringStartDate) {
        // @ts-ignore
        accessData = { ...accessData, start_datetime: stringStartDate }
      }
      if (stringEndDate) {
        // @ts-ignore
        accessData = { ...accessData, end_datetime: stringEndDate }
      }

      const submitCreateAccessResp = await submitCreateAccess(accessData)

      if (submitCreateAccessResp) {
        onSuccess(true)
      } else {
        onFail(true)
      }

      resetDialogAndClose()
    } catch (error) {
      console.error("Erreur lors de la création d'un accès")
      resetDialogAndClose()
      onFail(true)
    }
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography>{careSite.name}</Typography>
              <IconButton
                onClick={() => setOpenPerimeters(true)}
                style={{ padding: "0 8px" }}
              >
                <EditIcon />
              </IconButton>
            </div>
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
          <Typography variant="h3">Habilitation :</Typography>
          {loading ? (
            <CircularProgress size={20} />
          ) : roles ? (
            <Autocomplete
              disabled={!roles}
              options={roles}
              getOptionLabel={(option) => option.name}
              onChange={handleChangeAutocomplete}
              renderOption={(option) => (
                <Grid container justify="space-between" alignItems="center">
                  <Typography>{option.name}</Typography>
                  <Tooltip
                    title={option.help_text.map((text) => (
                      <Typography>{text}</Typography>
                    ))}
                  >
                    <InfoIcon
                      color="action"
                      fontSize="small"
                      className={classes.infoIcon}
                    />
                  </Tooltip>
                </Grid>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sélectionner une habilitation..."
                  variant="outlined"
                />
              )}
              value={role}
              style={{ width: "310px" }}
            />
          ) : (
            <Typography>
              Choisir un périmètre pour obtenir les habilitations disponibles.
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
            style={{ width: "310px" }}
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
            style={{ width: "310px" }}
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
