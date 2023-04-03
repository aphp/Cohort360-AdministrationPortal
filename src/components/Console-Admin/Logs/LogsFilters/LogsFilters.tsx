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
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import EditIcon from '@mui/icons-material/Edit'

import PerimetersDialog from '../../Accesses/AccessForm/components/PerimetersDialog/PerimetersDialog'

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

  const formattedPerimeter = filters.perimeter.perimeterId
    ? {
        id: filters.perimeter.perimeterId ?? '',
        name: filters.perimeter.perimeterName ?? '',
        type: '',
        children: [],
        cohort_size: ''
      }
    : null

  const [_filters, setFilters] = useState(filters)
  const [dateError, setDateError] = useState(false)
  const [userError, setUserError] = useState(false)
  const [openPerimeters, setOpenPerimeters] = useState(false)
  const [selectedPerimeter, setSelectedPerimeter] = useState<ScopeTreeRow | null>(formattedPerimeter)
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
      perimeter: {
        perimeterId: selectedPerimeter?.id ?? null,
        perimeterName: selectedPerimeter?.name ?? null
      }
    }
    onChangeFilters(_filtersCopy)
    onClose()
    setLoadingOnValidate(false)
  }

  return (
    <Dialog open>
      <DialogTitle>Filtrer par :</DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container direction="column">
          <Typography variant="h6">URL :</Typography>
          <Autocomplete
            options={urls}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => _onChangeValue('url', value)}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionner l'URL" />}
            value={_filters.url}
            style={{ margin: '1em' }}
          />
        </Grid>
        <Grid container direction="column">
          <Typography variant="h6">Utilisateur :</Typography>
          <TextField
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
            renderOption={(props, option) => <li {...props}>{option}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionner les codes de statut" />}
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
            renderOption={(props, option) => <li {...props}>{option}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionner les méthodes HTTP" />}
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
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'fr'}>
                <DatePicker
                  onChange={(date) => _onChangeValue('afterDate', date ?? null)}
                  value={_filters.afterDate}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="standard"
                      error={dateError}
                      helperText={dateError && 'La date doit être au format "JJ/MM/AAAA"'}
                      style={{ width: 'calc(100% - 120px)' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid container alignItems="baseline" className={classes.datePickers}>
              <FormLabel component="legend" className={classes.dateLabel}>
                Avant le :
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'fr'}>
                <DatePicker
                  onChange={(date) => _onChangeValue('beforeDate', date ?? null)}
                  value={_filters.beforeDate}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      variant="standard"
                      error={dateError}
                      helperText={dateError && 'La date doit être au format "JJ/MM/AAAA"'}
                      style={{ width: 'calc(100% - 120px)' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            {dateError && (
              <Typography className={classes.dateError}>
                Vous ne pouvez pas sélectionner de date de début supérieure à la date de fin.
              </Typography>
            )}
          </div>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Périmètre :</Typography>
          {selectedPerimeter ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{selectedPerimeter.name.split('.').join(' ')}</Typography>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button disabled={loadingOnValidate || dateError || userError} onClick={onSubmit} color="primary">
          {loadingOnValidate ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>

      <PerimetersDialog
        perimeter={selectedPerimeter}
        onChangePerimeter={setSelectedPerimeter}
        open={openPerimeters}
        onClose={() => setOpenPerimeters(false)}
        isManageable={false}
        userRights={userRights}
      />
    </Dialog>
  )
}

export default LogsFilters
