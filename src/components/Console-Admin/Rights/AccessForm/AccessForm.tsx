import React, { useEffect, useState } from 'react'
import moment from 'moment'

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
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'

import { getAssignableRoles } from 'services/Console-Admin/rolesService'
import { submitCreateAccess, submitEditAccess } from 'services/Console-Admin/providersHistoryService'
import CareSitesDialog from 'components/Console-Admin/Rights/AccessForm/components/CareSitesDialog/CareSitesDialog'
import { Access, AccessData, ScopeTreeRow, UserRole } from 'types'

import useStyles from './styles'

type AccessFormProps = {
  open: boolean
  onClose: () => void
  entityId?: number
  onSuccess: (success: boolean) => void
  onFail: (fail: boolean) => void
  userRights: UserRole
  access?: Access & {
    careSite?: null | ScopeTreeRow
  }
}

const defaultAccess = {
  careSite: null,
  role: null,
  actual_start_datetime: moment(),
  actual_end_datetime: null
}

const AccessForm: React.FC<AccessFormProps> = ({ open, onClose, entityId, userRights, onSuccess, onFail, access }) => {
  const classes = useStyles()

  const [_access, setAccess] = useState(
    access
      ? {
          ...access,
          actual_start_datetime: moment(new Date(access.actual_start_datetime as string), 'YYYY-MM-DD[T]HH:mm:ss'),
          actual_end_datetime: moment(new Date(access.actual_end_datetime as string), 'YYYY-MM-DD[T]HH:mm:ss')
        }
      : defaultAccess
  )
  const [accessCareSite, setAccessCareSite] = useState<ScopeTreeRow | null>(null)
  const [dateError, setDateError] = useState(false)
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  const isEdition = access
  const isStartDatePast = _access.actual_start_datetime ? _access.actual_start_datetime.isBefore() : false
  const isEndDatePast = _access.actual_end_datetime ? _access.actual_end_datetime.isBefore() : false

  useEffect(() => {
    const _getAssignableRoles = async () => {
      try {
        setLoading(true)

        const assignableRolesResp = await getAssignableRoles(_access.careSite?.care_site_id)

        setRoles(assignableRolesResp)

        setLoading(false)
      } catch (error) {
        console.error('Erreur lors de la récupération des habilitations assignables', error)
        setLoading(false)
      }
    }

    if (!isEdition) {
      _getAssignableRoles()
    }
  }, [_access.careSite]) // eslint-disable-line

  useEffect(() => {
    const _accessCopy = { ..._access }
    _accessCopy['careSite'] = accessCareSite
    setAccess(_accessCopy)
  }, [accessCareSite])

  useEffect(() => {
    if (moment(_access.actual_start_datetime).isAfter(_access.actual_end_datetime)) {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }, [_access.actual_start_datetime, _access.actual_end_datetime])

  const _onChangeValue = (key: 'careSite' | 'role' | 'actual_start_datetime' | 'actual_end_datetime', value: any) => {
    const _accessCopy = _access ? { ..._access } : defaultAccess
    _accessCopy[key] = value
    setAccess(_accessCopy)
  }

  const resetDialogAndClose = () => {
    setAccess(defaultAccess)
    setRoles([])
    onClose()
  }

  const onSubmit = async () => {
    try {
      let accessData = {} as AccessData

      const stringStartDate =
        moment(_access.actual_start_datetime).isValid() &&
        !moment(_access.actual_start_datetime).isSame(new Date(), 'day')
          ? moment(_access.actual_start_datetime).format()
          : null

      const stringEndDate = moment(_access.actual_end_datetime).isValid()
        ? moment(_access.actual_end_datetime).format()
        : null

      if (!isEdition) {
        accessData = {
          provider_history_id: entityId,
          care_site_id: _access.careSite?.care_site_id,
          role_id: _access.role?.role_id
        }
      }

      if (stringStartDate) {
        // @ts-ignore
        accessData = { ...accessData, start_datetime: stringStartDate }
      }
      if (stringEndDate) {
        // @ts-ignore
        accessData = { ...accessData, end_datetime: stringEndDate }
      }

      if (isEdition) {
        const submitEditAccessResp = await submitEditAccess(accessData, access?.care_site_history_id)
        if (submitEditAccessResp) {
          onSuccess(true)
        } else {
          onFail(true)
        }
      } else {
        const submitCreateAccessResp = await submitCreateAccess(accessData)
        if (submitCreateAccessResp) {
          onSuccess(true)
        } else {
          onFail(true)
        }
      }

      resetDialogAndClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEdition ? "l'édition" : 'la création'} d'un accès`)
      resetDialogAndClose()
      onFail(true)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.title}>
        {isEdition ? `Éditer l'accès à ${access?.care_site.care_site_name}` : 'Créer un nouvel accès'}
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {!isEdition && (
          <>
            <Grid container justify="space-between" alignItems="center" className={classes.filter}>
              <Typography variant="h3">Périmètre :</Typography>
              {_access && _access.careSite ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{_access.careSite.name}</Typography>
                  <IconButton onClick={() => setOpenPerimeters(true)} style={{ padding: '0 8px' }}>
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
            <Grid container justify="space-between" alignItems="center" className={classes.filter}>
              <Typography variant="h3">Habilitation :</Typography>
              {loading ? (
                <CircularProgress size={20} />
              ) : roles ? (
                <Autocomplete
                  disabled={!roles}
                  options={roles}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => {
                    if (value) _onChangeValue('role', value)
                  }}
                  renderOption={(option) => (
                    <Grid container justify="space-between" alignItems="center">
                      <Typography>{option.name}</Typography>
                      <Tooltip
                        title={option.help_text.map((text: string, index: number) => (
                          <Typography key={index}>{text}</Typography>
                        ))}
                      >
                        <InfoIcon color="action" fontSize="small" className={classes.infoIcon} />
                      </Tooltip>
                    </Grid>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionner une habilitation..." variant="outlined" />
                  )}
                  value={_access.role}
                  style={{ width: '310px' }}
                />
              ) : (
                <Typography>Choisir un périmètre pour obtenir les habilitations disponibles.</Typography>
              )}
            </Grid>
          </>
        )}
        {(!isEdition || (isEdition && !_access.actual_start_datetime?.isBefore())) && (
          <Grid container justify="space-between" alignItems="center" className={classes.filter}>
            <Typography variant="h3">Date de début :</Typography>
            <KeyboardDatePicker
              clearable
              minDate={moment()}
              error={dateError}
              style={{ width: 310 }}
              invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
              format="DD/MM/YYYY"
              onChange={(date: MaterialUiPickersDate) => _onChangeValue('actual_start_datetime', date)}
              value={_access.actual_start_datetime}
            />
          </Grid>
        )}
        {(!isEdition || (isEdition && !_access.actual_end_datetime?.isBefore())) && (
          <Grid container justify="space-between" alignItems="center" className={classes.filter}>
            <Typography variant="h3">Date de fin :</Typography>
            <KeyboardDatePicker
              clearable
              minDate={moment().add(1, 'days')}
              error={dateError}
              style={{ width: 310 }}
              invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
              format="DD/MM/YYYY"
              onChange={(date: MaterialUiPickersDate) => _onChangeValue('actual_end_datetime', date)}
              value={_access.actual_end_datetime}
            />

            {dateError && (
              <Typography className={classes.error}>
                Vous ne pouvez pas sélectionner de date de début supérieure à la date de fin.
              </Typography>
            )}
          </Grid>
        )}

        {isEdition && (
          <div>
            <InfoIcon color="action" className={classes.infoIcon} />
            <Typography component="span">
              Vous ne pouvez éditer que les dates qui ne sont pas encore passées.
            </Typography>
          </div>
        )}
        {!isEdition && (
          <div>
            <InfoIcon color="action" className={classes.infoIcon} />
            <Typography component="span">
              Si aucune date de fin n'est renseignée, celle-ci sera fixée à dans un an.
            </Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={resetDialogAndClose} color="secondary">
          Annuler
        </Button>
        <Button
          disabled={
            dateError || (isStartDatePast && isEndDatePast) || (!isEdition && !_access.careSite) || !_access.role
          }
          onClick={onSubmit}
          color="primary"
        >
          Valider
        </Button>
      </DialogActions>

      <CareSitesDialog
        careSite={_access.careSite ?? null}
        onChangeCareSite={setAccessCareSite}
        open={openPerimeters}
        onClose={() => setOpenPerimeters(false)}
        isManageable={true}
        userRights={userRights}
      />
    </Dialog>
  )
}

export default AccessForm
