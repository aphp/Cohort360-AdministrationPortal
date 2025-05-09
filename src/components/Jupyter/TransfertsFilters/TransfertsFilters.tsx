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
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import useStyles from './styles'
import { ExportFilters } from 'types'

type TransfertsFiltersProps = {
  filters: ExportFilters
  onChangeFilters: (filters: ExportFilters) => void
  onClose: () => void
}

const transfertTypes = [
  { display: 'CSV', code: 'csv' },
  { display: 'Jupyter', code: 'hive' }
]
const statusOptions = [
  {
    display: 'Annulé',
    code: 'cancelled'
  },
  {
    display: 'Confirmé',
    code: 'validated'
  },
  {
    display: 'En attente',
    code: 'pending,started,new'
  },
  {
    display: 'Erreur',
    code: 'failed'
  },
  {
    display: 'Refusé',
    code: 'denied'
  },
  {
    display: 'Terminé',
    code: 'finished'
  }
]

const TransfertsFilters: React.FC<TransfertsFiltersProps> = ({ filters, onChangeFilters, onClose }) => {
  const { classes } = useStyles()

  const [_filters, setFilters] = useState(filters)
  const [dateError, setDateError] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)

  useEffect(() => {
    if (moment(_filters.insert_datetime_gte).isAfter(_filters.insert_datetime_lte)) {
      setDateError(true)
    } else {
      setDateError(false)
    }
  }, [_filters])

  const _onChangeValue = (
    key: 'exportType' | 'insert_datetime_gte' | 'insert_datetime_lte' | 'request_job_status',
    value: any
  ) => {
    const _filtersCopy = { ..._filters }
    _filtersCopy[key] = value

    setFilters(_filtersCopy)
  }

  const onSubmit = () => {
    setLoadingOnValidate(true)
    const _insert_datetime_gte = moment(_filters.insert_datetime_gte).isValid()
      ? moment(_filters.insert_datetime_gte).format('YYYY-MM-DD h:mm:ss')
      : null
    const _insert_datetime_lte = moment(_filters.insert_datetime_lte).isValid()
      ? moment(_filters.insert_datetime_lte).format('YYYY-MM-DD h:mm:ss')
      : null
    const _filtersCopy = {
      ..._filters,
      insert_datetime_gte: _insert_datetime_gte,
      insert_datetime_lte: _insert_datetime_lte
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
          <Typography variant="h6">Type de transfert :</Typography>
          <Autocomplete
            multiple
            getOptionLabel={(option) => option.display}
            options={transfertTypes}
            onChange={(event, value) => _onChangeValue('exportType', value)}
            renderOption={(props, option) => <li {...props}>{option.display}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionner un ou plusieurs type de transfert" />}
            value={_filters.exportType}
            style={{ margin: '1em' }}
          />
        </Grid>

        <Grid container direction="column">
          <Typography variant="h6">Statut :</Typography>
          <Autocomplete
            multiple
            getOptionLabel={(option) => option.display}
            options={statusOptions}
            onChange={(event, value) => _onChangeValue('request_job_status', value)}
            renderOption={(props, option) => <li {...props}>{option.display}</li>}
            renderInput={(params) => <TextField {...params} label="Sélectionner un ou plusieurs statut" />}
            value={_filters.request_job_status}
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
                  onChange={(date) => _onChangeValue('insert_datetime_gte', date ?? null)}
                  value={_filters.insert_datetime_gte}
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
                  onChange={(date) => _onChangeValue('insert_datetime_lte', date ?? null)}
                  value={_filters.insert_datetime_lte}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button disabled={loadingOnValidate || dateError} onClick={onSubmit} color="primary">
          {loadingOnValidate ? <CircularProgress /> : 'Valider'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransfertsFilters
