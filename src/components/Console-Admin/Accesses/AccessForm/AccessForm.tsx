import React, { useEffect, useState } from 'react'
import moment from 'moment'

import {
  Autocomplete,
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
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/fr'

import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'

import { getAssignableRoles } from 'services/Console-Admin/rolesService'
import { submitCreateAccess, submitEditAccess } from 'services/Console-Admin/profilesService'
import PerimetersDialog from 'components/Console-Admin/Accesses/AccessForm/components/PerimetersDialog/PerimetersDialog'
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
    perimeter?: null | ScopeTreeRow
  }
}

const defaultAccess = {
  perimeter: null,
  role: null,
  actual_start_datetime: moment(),
  actual_end_datetime: null
}

const AccessForm: React.FC<AccessFormProps> = ({ open, onClose, entityId, userRights, onSuccess, onFail, access }) => {
  const { classes } = useStyles()

  const [draftAccess, setDraftAccess] = useState(
    access
      ? {
          ...access,
          actual_start_datetime: moment(new Date(access.actual_start_datetime as string), 'YYYY-MM-DD[T]HH:mm:ss'),
          actual_end_datetime: moment(new Date(access.actual_end_datetime as string), 'YYYY-MM-DD[T]HH:mm:ss')
        }
      : defaultAccess
  )
  const [accessPerimeter, setAccessPerimeter] = useState<ScopeTreeRow | null>(null)
  const [dateError, setDateError] = useState('')
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [roles, setRoles] = useState([])
  const [loadingValidate, setLoadingValidate] = useState(false)
  const [loadingAssignableRoles, setLoadingAssignableRoles] = useState(false)

  const isEdition = access

  useEffect(() => {
    let error = ''

    if (
      (draftAccess?.actual_start_datetime !== null && !draftAccess.actual_start_datetime.isValid()) ||
      (draftAccess?.actual_end_datetime !== null && !draftAccess.actual_end_datetime.isValid())
    ) {
      error = 'Les dates doivent être au format "JJ/MM/AAAA"'
    } else if (
      (!isEdition &&
        draftAccess?.actual_start_datetime !== null &&
        draftAccess.actual_start_datetime.isBefore(moment(), 'day')) ||
      (draftAccess?.actual_end_datetime !== null && draftAccess.actual_end_datetime.isBefore(moment(), 'day'))
    ) {
      error = 'Les dates renseignées ne peuvent pas être dans le passé'
    }

    if (
      draftAccess?.actual_start_datetime !== null &&
      draftAccess?.actual_end_datetime !== null &&
      draftAccess?.actual_start_datetime.isValid() &&
      draftAccess?.actual_end_datetime.isValid() &&
      draftAccess?.actual_end_datetime.isBefore(draftAccess.actual_start_datetime)
    ) {
      error = 'La date de fin ne peut pas être avant la date de début.'
    }

    setDateError(error)
  }, [draftAccess.actual_start_datetime, draftAccess.actual_end_datetime])

  useEffect(() => {
    const _getAssignableRoles = async () => {
      try {
        setLoadingAssignableRoles(true)

        const assignableRolesResp = await getAssignableRoles(draftAccess.perimeter?.id)

        setRoles(assignableRolesResp)

        setLoadingAssignableRoles(false)
      } catch (error) {
        console.error('Erreur lors de la récupération des habilitations assignables', error)
        setLoadingAssignableRoles(false)
      }
    }

    if (!isEdition) {
      _getAssignableRoles()
    }
  }, [draftAccess.perimeter])

  useEffect(() => {
    const draftAccessCopy = { ...draftAccess }
    draftAccessCopy['perimeter'] = accessPerimeter
    setDraftAccess(draftAccessCopy)
  }, [accessPerimeter])

  const _onChangeValue = (key: 'perimeter' | 'role' | 'actual_start_datetime' | 'actual_end_datetime', value: any) => {
    const draftAccessCopy = draftAccess ? { ...draftAccess } : defaultAccess
    draftAccessCopy[key] = value
    setDraftAccess(draftAccessCopy)
  }

  const resetDialogAndClose = () => {
    setDraftAccess(defaultAccess)
    setRoles([])
    onClose()
  }

  const onSubmit = async () => {
    try {
      setLoadingValidate(true)
      let accessData = {} as AccessData

      const stringStartDate =
        moment(draftAccess.actual_start_datetime).isValid() &&
        !moment(draftAccess.actual_start_datetime).isSame(new Date(), 'day')
          ? moment(draftAccess.actual_start_datetime).format()
          : null

      const stringEndDate = moment(draftAccess.actual_end_datetime).isValid()
        ? moment(draftAccess.actual_end_datetime).format()
        : null

      if (!isEdition) {
        accessData = {
          profile_id: entityId,
          perimeter_id: draftAccess.perimeter?.id,
          role_id: draftAccess.role?.id
        }
      }

      if (
        (stringStartDate && isEdition && draftAccess.actual_start_datetime?.isAfter()) ||
        (stringStartDate && !isEdition)
      ) {
        accessData = { ...accessData, start_datetime: stringStartDate }
      }
      if (stringEndDate) {
        accessData = { ...accessData, end_datetime: stringEndDate }
      }

      if (isEdition) {
        const submitEditAccessResp = await submitEditAccess(accessData, access?.id)
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

      setLoadingValidate(false)
      resetDialogAndClose()
    } catch (error) {
      console.error(`Erreur lors de ${isEdition ? "l'édition" : 'la création'} d'un accès`, error)
      setLoadingValidate(false)
      resetDialogAndClose()
      onFail(true)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdition ? `Éditer l'accès à ${access?.perimeter?.name}` : 'Créer un nouvel accès'}</DialogTitle>
      <DialogContent className={classes.dialog}>
        {!isEdition && (
          <>
            <Grid container justifyContent="space-between" alignItems="center" className={classes.filter}>
              <Typography variant="h6">Périmètre :</Typography>
              {draftAccess?.perimeter ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{draftAccess.perimeter.name}</Typography>
                  <IconButton onClick={() => setOpenPerimeters(true)} style={{ padding: '0 8px' }} size="large">
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
            <Grid container justifyContent="space-between" alignItems="center" className={classes.filter}>
              <Typography variant="h6">Habilitation :</Typography>
              {loadingAssignableRoles ? (
                <CircularProgress size={20} />
              ) : (
                <Autocomplete
                  disabled={!roles}
                  options={roles ?? []}
                  getOptionLabel={(option) => option.name ?? 'pas de nom de role'}
                  onChange={(event, value) => {
                    if (value) _onChangeValue('role', value)
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography>{option.name}</Typography>
                        <Tooltip
                          title={option?.help_text?.map((text: string, index: number) => (
                            <Typography key={index}>{text}</Typography>
                          ))}
                        >
                          <InfoIcon color="action" fontSize="small" className={classes.infoIcon} />
                        </Tooltip>
                      </Grid>
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Sélectionner une habilitation..." />}
                  value={draftAccess.role}
                  style={{ width: '310px' }}
                />
              )}
              <div style={{ marginTop: 12 }}>
                <InfoIcon color="action" className={classes.infoIcon} />
                <Typography component="span">
                  Choisir un périmètre pour obtenir les habilitations disponibles.
                </Typography>
              </div>
            </Grid>
          </>
        )}
        {(!isEdition || (isEdition && !draftAccess.actual_start_datetime?.isBefore())) && (
          <Grid container justifyContent="space-between" alignItems="center" className={classes.filter}>
            <Typography variant="h6">Date de début :</Typography>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'fr'}>
              <DatePicker
                onChange={(date) => _onChangeValue('actual_start_datetime', date)}
                value={draftAccess.actual_start_datetime}
                minDate={moment().startOf('day')}
                renderInput={(params: any) => (
                  <TextField {...params} variant="standard" error={dateError} style={{ width: 'calc(100% - 120px)' }} />
                )}
              />
            </LocalizationProvider>
          </Grid>
        )}

        <Grid container justifyContent="space-between" alignItems="center" className={classes.filter}>
          <Typography variant="h6">Date de fin :</Typography>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'fr'}>
            <DatePicker
              onChange={(date) => _onChangeValue('actual_end_datetime', date)}
              value={draftAccess.actual_end_datetime}
              minDate={moment().add(1, 'days')}
              renderInput={(params: any) => (
                <TextField {...params} variant="standard" error={dateError} style={{ width: 'calc(100% - 120px)' }} />
              )}
            />
          </LocalizationProvider>

          {dateError && <Typography className={classes.error}>{dateError}</Typography>}
        </Grid>

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
          disabled={loadingValidate || !!dateError || (!isEdition && !draftAccess.perimeter) || !draftAccess.role}
          onClick={onSubmit}
          color="primary"
        >
          {loadingValidate ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>

      <PerimetersDialog
        perimeter={draftAccess.perimeter ?? null}
        onChangePerimeter={setAccessPerimeter}
        open={openPerimeters}
        onClose={() => setOpenPerimeters(false)}
        isManageable
        userRights={userRights}
      />
    </Dialog>
  )
}

export default AccessForm
