import React, { useEffect, useState } from 'react'
import moment from 'moment'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import EditIcon from '@material-ui/icons/Edit'

import CareSitesDialog from '../../Accesses/AccessForm/components/CareSitesDialog/CareSitesDialog'

import useStyles from './styles'
import { LogsFiltersObject, ScopeTreeRow, UserRole } from 'types'

type LogsFiltersProps = {
  filters: LogsFiltersObject
  onChangeFilters: (filters: LogsFiltersObject) => void
  onClose: () => void
  userRights: UserRole
}

const urls = [
  {
    label: 'Accès',
    code: 'accesses'
  },
  {
    label: 'Exports',
    code: 'exports'
  },
  {
    label: 'Habilitations',
    code: 'roles'
  },
  {
    label: 'Utilisateurs',
    code: 'profiles'
  }
]
const httpMethods = ['DELETE', 'GET', 'PATCH', 'PUT', 'POST']
const statusCodes = ['200', '201', '204', '400', '401', '403', '404', '500']

const LogsFilters: React.FC<LogsFiltersProps> = ({ filters, onChangeFilters, onClose, userRights }) => {
  const classes = useStyles()

  const formattedCareSite = filters.careSite.careSiteId
    ? {
        care_site_id: filters.careSite.careSiteId ?? '',
        name: filters.careSite.careSiteName ?? '',
        care_site_type_source_value: '',
        children: []
      }
    : null

  const [_filters, setFilters] = useState(filters)
  const [dateError, setDateError] = useState(false)
  const [userError, setUserError] = useState(false)
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [selectedCareSite, setSelectedCareSite] = useState<ScopeTreeRow | null>(formattedCareSite)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  useEffect(() => {
    if (moment(_filters.afterDate).isAfter(_filters.beforeDate)) {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }, [_filters])

  useEffect(() => {
    const sevenInt = /^[0-9]{3,7}$/

    if (_filters.user && !_filters.user.match(sevenInt)) {
      setUserError(true)
    } else {
      setUserError(false)
    }
  }, [_filters])

  const _onChangeValue = (
    key: 'url' | 'user' | 'afterDate' | 'beforeDate' | 'statusCode' | 'httpMethod',
    value: any
  ) => {
    const _filtersCopy = { ..._filters }
    _filtersCopy[key] = value

    setFilters(_filtersCopy)
  }

  const onSubmit = () => {
    setLoadingOnValidate(true)
    const _filtersCopy = {
      ..._filters,
      careSite: {
        careSiteId: selectedCareSite?.care_site_id.toString() ?? null,
        careSiteName: selectedCareSite?.name ?? null
      }
    }
    onChangeFilters(_filtersCopy)
    onClose()
    setLoadingOnValidate(false)
  }

  return (
    <Dialog open>
      <DialogTitle className={classes.dialogTitle}>Filtrer par :</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column">
          <Typography variant="h6">URL :</Typography>
          <Autocomplete
            options={urls}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => _onChangeValue('url', value)}
            renderOption={(option) => <React.Fragment>{option.label}</React.Fragment>}
            renderInput={(params) => <TextField {...params} label="Sélectionner l'URL" variant="outlined" />}
            value={_filters.url}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Utilisateur :</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            autoFocus
            placeholder="Identifiant APH"
            value={_filters.user}
            onChange={(event) => _onChangeValue('user', event.target.value)}
            error={userError}
            helperText={userError && "L'identifiant APH ne doit contenir que des chiffres (entre 3 et 7 maximum)."}
            inputProps={{ maxlength: 7 }}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Code de statut :</Typography>
          <Autocomplete
            multiple
            options={statusCodes}
            onChange={(event, value) => _onChangeValue('statusCode', value)}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField {...params} label="Sélectionner les codes de statut" variant="outlined" />
            )}
            value={_filters.statusCode}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Méthode HTTP :</Typography>
          <Autocomplete
            multiple
            options={httpMethods}
            onChange={(event, value) => _onChangeValue('httpMethod', value)}
            renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
            renderInput={(params) => (
              <TextField {...params} label="Sélectionner les méthodes HTTP" variant="outlined" />
            )}
            value={_filters.httpMethod}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Date :</Typography>
          <div style={{ marginBottom: '1em' }}>
            <Grid container alignItems="baseline" className={classes.datePickers}>
              <FormLabel component="legend" className={classes.dateLabel}>
                Après le :
              </FormLabel>
              <KeyboardDatePicker
                clearable
                error={dateError}
                invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
                format="DD/MM/YYYY"
                onChange={(date: MaterialUiPickersDate) => _onChangeValue('afterDate', date ?? null)}
                value={_filters.afterDate}
                style={{ width: 'calc(100% - 120px)' }}
              />
            </Grid>

            <Grid container alignItems="baseline" className={classes.datePickers}>
              <FormLabel component="legend" className={classes.dateLabel}>
                Avant le :
              </FormLabel>
              <KeyboardDatePicker
                clearable
                error={dateError}
                invalidDateMessage='La date doit être au format "JJ/MM/AAAA"'
                format="DD/MM/YYYY"
                onChange={(date: MaterialUiPickersDate) => _onChangeValue('beforeDate', date ?? null)}
                value={_filters.beforeDate}
                style={{ width: 'calc(100% - 120px)' }}
              />
            </Grid>
            {dateError && (
              <Typography className={classes.dateError}>
                Vous ne pouvez pas sélectionner de date de début supérieure à la date de fin.
              </Typography>
            )}
          </div>
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <Typography variant="h6">Périmètre :</Typography>
          {selectedCareSite ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{selectedCareSite.name.split('.').join(' ')}</Typography>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button disabled={loadingOnValidate || dateError || userError} onClick={onSubmit} color="primary">
          {loadingOnValidate ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>

      <CareSitesDialog
        careSite={selectedCareSite}
        onChangeCareSite={setSelectedCareSite}
        open={openPerimeters}
        onClose={() => setOpenPerimeters(false)}
        isManageable={false}
        userRights={userRights}
      />
    </Dialog>
  )
}

export default LogsFilters
