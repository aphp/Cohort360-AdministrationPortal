import React, { Fragment, useEffect, useState } from 'react'
import clsx from 'clsx'

import {
  Button,
  Checkbox,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import InfoIcon from '@material-ui/icons/Info'

import { Cohort, ExportTableType, JupyterTransferForm, Order, Provider, WorkingEnvironment } from 'types'
import { getProviders } from 'services/Console-Admin/providersService'
import { getProviderCohorts } from 'services/Console-Admin/cohortsService'
import { getWorkingEnvironments } from 'services/Jupyter/workingEnvironmentsService'
import export_table from './export_tables'

import useStyles from './styles'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { jupyterTransfer } from 'services/Jupyter/jupyterExportService'
import { Alert } from '@material-ui/lab'

const defaultTransfer: JupyterTransferForm = {
  user: null,
  cohort: null,
  workingEnvironment: null,
  confidentiality: 'pseudo',
  shiftDates: 'no',
  tables: []
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const Transfert: React.FC = () => {
  const classes = useStyles()

  const [loadingOnSearchProvider, setLoadingOnSearchProvider] = useState(false)
  const [loadingOnGetCohorts, setLoadingOnGetCohorts] = useState(false)
  const [loadingOnWorkingEnvironments, setLoadingOnWorkingEnvironments] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)
  const [transferRequest, setTransferRequest] = useState(defaultTransfer)

  const [providersSearchResults, setProvidersSearchResults] = useState<Provider[]>([])
  const [providerSearchInput, setProviderSearchInput] = useState('')
  const [environmentSearchInput, setEnvironmentSearchInput] = useState('')
  const [cohortsOptions, setCohortsOptions] = useState<Cohort[]>([])
  const [workingEnvironments, setWorkingEnvironments] = useState<WorkingEnvironment[]>([])
  const [transferRequestSuccess, setTransferRequestSuccess] = useState(false)
  const [transferRequestFail, setTransferRequestFail] = useState(false)

  const debouncedProviderSearchTerm = useDebounce(700, providerSearchInput)
  const debouncedEnvironmentSearchTerm = useDebounce(700, environmentSearchInput)

  const _onChangeValue = (
    key: 'user' | 'cohort' | 'workingEnvironment' | 'confidentiality' | 'shiftDates' | 'tables',
    value: any
  ) => {
    const _transferRequest = { ...transferRequest }
    // @ts-ignore
    _transferRequest[key] = value
    setTransferRequest(_transferRequest)
  }

  const handleChangeTables = (tableId: string) => {
    let existingTableIds: string[] = transferRequest.tables
    const foundItem = existingTableIds.find((existingTableId) => existingTableId === tableId)
    if (foundItem) {
      const index = existingTableIds.indexOf(foundItem)
      existingTableIds.splice(index, 1)
    } else {
      // Attention règle particulière
      if (tableId === 'fact_relationship') {
        const careSiteItem = existingTableIds.find((existingTableId) => existingTableId === 'care_site')
        if (!careSiteItem) {
          existingTableIds = [...existingTableIds, 'care_site']
        }
      }
      if (tableId === 'concept_relationship') {
        const careSiteItem = existingTableIds.find((existingTableId) => existingTableId === 'concept')
        if (!careSiteItem) {
          existingTableIds = [...existingTableIds, 'concept']
        }
      }

      existingTableIds = [...existingTableIds, tableId]
    }
    _onChangeValue('tables', existingTableIds)
  }

  useEffect(() => {
    const _searchProviders = async () => {
      try {
        setLoadingOnSearchProvider(true)

        const providersResp = await getProviders(orderDefault, 1, debouncedProviderSearchTerm)

        setProvidersSearchResults(providersResp.providers)

        setLoadingOnSearchProvider(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs', error)
        setProvidersSearchResults([])
        setLoadingOnSearchProvider(false)
      }
    }

    if (debouncedProviderSearchTerm && debouncedProviderSearchTerm?.length > 0) {
      _searchProviders()
    } else {
      setProvidersSearchResults([])
    }
  }, [debouncedProviderSearchTerm])

  useEffect(() => {
    const _getProviderCohorts = async () => {
      try {
        setLoadingOnGetCohorts(true)

        const cohortsResp = await getProviderCohorts(transferRequest.user?.provider_source_value)

        setCohortsOptions(cohortsResp)

        setLoadingOnGetCohorts(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des cohortes de l'utilisateur", error)
        setCohortsOptions([])
        setLoadingOnGetCohorts(false)
      }
    }

    setTransferRequest({ ...transferRequest, ['cohort']: null })
    if (transferRequest.user !== null) {
      _getProviderCohorts()
    }
  }, [transferRequest.user])

  useEffect(() => {
    const _getWorkingEnvironments = async () => {
      try {
        setLoadingOnWorkingEnvironments(true)

        const workingEnvironmentsResp = await getWorkingEnvironments(orderDefault, 1, true, environmentSearchInput)

        setWorkingEnvironments(workingEnvironmentsResp?.workingEnvironments)
        setLoadingOnWorkingEnvironments(false)
      } catch (error) {
        console.error('Erreur lors de la récupération des machines Jupyter', error)
        setWorkingEnvironments([])
        setLoadingOnWorkingEnvironments(false)
      }
    }

    if (debouncedEnvironmentSearchTerm && debouncedEnvironmentSearchTerm?.length > 0) {
      _getWorkingEnvironments()
    } else {
      setWorkingEnvironments([])
    }
  }, [debouncedEnvironmentSearchTerm])

  const onSubmit = async () => {
    try {
      setLoadingOnValidate(true)

      const transferData = {
        output_format: 'hive',
        cohort_id: transferRequest.cohort?.fhir_group_id,
        provider_source_value: transferRequest.user?.provider_source_value,
        target_unix_account: transferRequest.workingEnvironment?.uid,
        tables: transferRequest.tables.map((table: string) => ({
          omop_table_name: table
        })),
        shift_dates: transferRequest.shiftDates === 'yes',
        nominative: transferRequest.confidentiality === 'nomi'
      }

      const transferRequestResp = await jupyterTransfer(transferData)

      transferRequestResp ? setTransferRequestSuccess(true) : setTransferRequestFail(true)

      setTransferRequest(defaultTransfer)
      setLoadingOnValidate(false)
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error)
      setTransferRequestFail(false)
      setTransferRequest(defaultTransfer)
      setLoadingOnValidate(false)
    }
  }

  return (
    <Grid container direction="column">
      <Grid container direction="column" alignItems="center">
        <CssBaseline />
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" className={classes.title} align="center">
            Transfert vers un environnement de travail
          </Typography>
          {loadingOnValidate ? (
            <Grid container justify="center" style={{ padding: 16 }}>
              <CircularProgress size={40} />
            </Grid>
          ) : (
            <>
              <Typography align="left" variant="h6">
                Choix de l'utilisateur
              </Typography>
              <Autocomplete
                className={classes.autocomplete}
                noOptionsText="Recherchez un utilisateur"
                options={providersSearchResults ?? []}
                loading={loadingOnSearchProvider}
                onChange={(e, value) => _onChangeValue('user', value)}
                getOptionLabel={(option) =>
                  `${option.provider_source_value} - ${option.lastname?.toLocaleUpperCase()} ${option.firstname} - ${
                    option.email
                  }` ?? ''
                }
                value={transferRequest.user}
                getOptionSelected={(option, value) => option.provider_id === value.provider_id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recherchez un utilisateur"
                    variant="outlined"
                    value={providerSearchInput}
                    onChange={(e) => setProviderSearchInput(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loadingOnSearchProvider ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      )
                    }}
                  />
                )}
              />

              <Typography align="left" variant="h6">
                Choix de la cohorte de l'utilisateur
              </Typography>
              {loadingOnGetCohorts ? (
                // TODO: pourquoi pas remplacer par un skeleton?
                <CircularProgress style={{ margin: '16px auto 24px' }} />
              ) : (
                <Autocomplete
                  noOptionsText="Aucune cohorte disponible"
                  disabled={transferRequest.user === null}
                  getOptionLabel={(option) => option.name}
                  options={cohortsOptions}
                  onChange={(event, value) => _onChangeValue('cohort', value)}
                  value={transferRequest.cohort}
                  renderOption={(option) => <React.Fragment>{option.name}</React.Fragment>}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionnez une cohorte" variant="outlined" />
                  )}
                  className={classes.autocomplete}
                />
              )}

              <Typography align="left" variant="h6">
                Choix des accès
              </Typography>
              <RadioGroup
                className={classes.radioGroup}
                value={transferRequest.confidentiality}
                onChange={(event) => _onChangeValue('confidentiality', event.target.value)}
              >
                <FormControlLabel value="pseudo" control={<Radio color="primary" />} label="Pseudonymisé" />
                <FormControlLabel value="nomi" control={<Radio color="primary" />} label="Nominatif" />
              </RadioGroup>

              <Typography align="left" variant="h6">
                Choix des tables à exporter
              </Typography>

              <List className={clsx(classes.list, classes.autocomplete)}>
                {export_table
                  .filter((table) =>
                    transferRequest.confidentiality === 'pseudo'
                      ? table.nominative !== true
                      : table.nominative === true || table.nominative === false
                  )
                  .map(({ table_name, table_id }: ExportTableType) => (
                    <ListItem key={table_id}>
                      <ListItemText
                        disableTypography
                        primary={
                          <Grid container direction="row" alignItems="center">
                            <Typography variant="body1">{table_name} - </Typography>
                            <Typography variant="body1" style={{ fontStyle: 'italic', paddingLeft: 4 }}>
                              {table_id}
                            </Typography>
                          </Grid>
                        }
                      />

                      <ListItemSecondaryAction>
                        <Checkbox
                          checked={!!transferRequest.tables.find((tableId: string) => tableId === table_id)}
                          onChange={() => handleChangeTables(table_id)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>

              <Typography align="left" variant="h6">
                Décaler les dates des évènements
              </Typography>
              <RadioGroup
                className={classes.radioGroup}
                value={transferRequest.shiftDates}
                onChange={(event) => _onChangeValue('shiftDates', event.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
              </RadioGroup>

              <Typography align="left" variant="h6">
                Choix de l'environnement de travail Jupyter
              </Typography>
              <Autocomplete
                className={classes.autocomplete}
                noOptionsText="Recherchez un environnement de travail Jupyter"
                options={workingEnvironments ?? []}
                loading={loadingOnWorkingEnvironments}
                onChange={(e, value) => _onChangeValue('workingEnvironment', value)}
                getOptionLabel={(option) => `${option.username}` ?? ''}
                value={transferRequest.workingEnvironment}
                getOptionSelected={(option, value) => option.uid === value.uid}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recherchez un environnement de travail Jupyter"
                    variant="outlined"
                    value={environmentSearchInput}
                    onChange={(e) => setEnvironmentSearchInput(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Fragment>
                          {loadingOnWorkingEnvironments ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </Fragment>
                      )
                    }}
                  />
                )}
              />

              <div style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                <InfoIcon color="action" className={classes.infoIcon} />
                <Typography component="span">Tous les champs sont obligatoires.</Typography>
              </div>

              <Button
                variant="contained"
                disableElevation
                className={classes.validateButton}
                disabled={
                  transferRequest.user === null ||
                  transferRequest.cohort === null ||
                  transferRequest.tables.length === 0 ||
                  transferRequest.workingEnvironment === null
                }
                onClick={onSubmit}
              >
                Envoyer
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      {transferRequestSuccess && (
        <Snackbar
          open
          onClose={() => setTransferRequestSuccess(false)}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setTransferRequestSuccess(false)}>
            La demande de transfert a bien été envoyée.
          </Alert>
        </Snackbar>
      )}
      {transferRequestFail && (
        <Snackbar
          open
          onClose={() => setTransferRequestFail(false)}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setTransferRequestFail(false)}>
            Erreur lors de l'envoi de la demande de transfert.
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default Transfert
