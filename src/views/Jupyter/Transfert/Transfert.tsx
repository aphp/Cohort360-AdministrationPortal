import React, { Fragment, useEffect, useState } from 'react'

import { Button, CircularProgress, CssBaseline, Grid, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import useStyles from './styles'
import { Cohort, JupyterMachine, JupyterTransferForm, Order, Provider } from 'types'
import useDebounce from 'components/Console-Admin/CareSite/use-debounce'
import { getProviders } from 'services/Console-Admin/providersService'
import { getProviderCohorts } from 'services/Console-Admin/cohortsService'
import { getJupyterMachines } from 'services/Jupyter/workingEnvironmentsService'

const defaultTransfer: JupyterTransferForm = {
  user: null,
  cohort: null,
  jupyterMachine: null
}

const ERROR_ENVIRONMENT = 'error_environment'
const ERROR_USER = 'error_user'
const ERROR_COHORT = 'error_cohort'

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const Transfert: React.FC = () => {
  const classes = useStyles()

  const [loadingOnSearchProvider, setLoadingOnSearchProvider] = useState(false)
  const [loadingOnGetCohorts, setLoadingOnGetCohorts] = useState(false)
  const [loadingOnGetJupyterMachines, setLoadingOnGetJupyterMachines] = useState(false)
  const [transferRequest, setTransferRequest] = useState(defaultTransfer)
  const [error /* setError */] = useState<typeof ERROR_ENVIRONMENT | typeof ERROR_USER | typeof ERROR_COHORT | null>(
    null
  )
  const [providersSearchResults, setProvidersSearchResults] = useState<Provider[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [cohortsOptions, setCohortsOptions] = useState<Cohort[]>([])
  const [jupyterMachines, setJupyterMachines] = useState<JupyterMachine[]>([])

  const debouncedSearchTerm = useDebounce(700, searchInput)

  const _onChangeValue = (key: 'user' | 'cohort' | 'jupyterMachine', value: any) => {
    const _transferRequest = { ...transferRequest }
    _transferRequest[key] = value
    setTransferRequest(_transferRequest)
  }

  useEffect(() => {
    const _searchProviders = async () => {
      try {
        setLoadingOnSearchProvider(true)

        const providersResp = await getProviders(orderDefault, 1, debouncedSearchTerm)

        setProvidersSearchResults(providersResp.providers)

        setLoadingOnSearchProvider(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs', error)
        setProvidersSearchResults([])
        setLoadingOnSearchProvider(false)
      }
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 0) {
      _searchProviders()
    } else {
      setProvidersSearchResults([])
    }
  }, [debouncedSearchTerm])

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
    const _getJupyterMachines = async () => {
      try {
        setLoadingOnGetJupyterMachines(true)

        const jupyterMachinesResp = await getJupyterMachines()

        setJupyterMachines(jupyterMachinesResp)
        setLoadingOnGetJupyterMachines(false)
      } catch (error) {
        console.error('Erreur lors de la récupération des machines Jupyter', error)
        setJupyterMachines([])
        setLoadingOnGetJupyterMachines(false)
      }
    }

    _getJupyterMachines()
  }, [])

  return (
    <Grid container direction="column">
      <Grid container direction="column" alignItems="center">
        <CssBaseline />
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" className={classes.title} align="center">
            Transfert vers un environnement de travail
          </Typography>

          <Typography align="left" variant="h3">
            Choix de l'utilisateur
          </Typography>
          <Autocomplete
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
                label="Rechercher un utilisateur"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loadingOnSearchProvider ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }}
                className={classes.autocomplete}
              />
            )}
          />

          <Typography align="left" variant="h3">
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
              renderInput={(params) => <TextField {...params} label="Sélectionnez une cohorte" variant="outlined" />}
              className={classes.autocomplete}
            />
          )}

          <Typography align="left" variant="h3">
            Choix de l'environnement Jupyter
          </Typography>
          {loadingOnGetJupyterMachines ? (
            <CircularProgress style={{ margin: '16px auto 24px' }} />
          ) : (
            <Autocomplete
              noOptionsText="Aucune machine disponible"
              getOptionLabel={(option) => option.name}
              options={jupyterMachines}
              onChange={(event, value) => _onChangeValue('jupyterMachine', value)}
              value={transferRequest.jupyterMachine}
              renderOption={(option) => <React.Fragment>{option.name}</React.Fragment>}
              renderInput={(params) => (
                <TextField {...params} label="Sélectionnez une machine Jupyter" variant="outlined" />
              )}
              className={classes.autocomplete}
            />
          )}

          <Button variant="contained" disableElevation className={classes.validateButton}>
            Envoyer
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Transfert
