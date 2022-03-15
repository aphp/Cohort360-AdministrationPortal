import React, { Fragment, useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import ProvidersTable from './components/ProvidersTable/ProvidersTable'
import { getWorkingEnvironmentFormInfos } from 'services/Jupyter/workingEnvironmentsService'
import { getProviders } from 'services/Console-Admin/providersService'
import useDebounce from 'components/Console-Admin/CareSite/use-debounce'
import { JupyterMachine, Order, Provider, UserRole } from 'types'

import useStyles from './styles'

type WorkingEnvironmentsFormProps = {
  userRights: UserRole
  onClose: () => void
  onAddWorkingEnvironmentSuccess: (success: boolean) => void
  onAddWorkingEnvironmentFail: (fail: boolean) => void
}

const workingEnvironmentDefault = {
  name: '',
  usersAssociated: [] as Provider[],
  sshAccess: 'no',
  publicKey: '',
  machines: [],
  jupyter: 'no',
  tensorbroad: 'no',
  brat: 'no',
  rangerhivePolicy: null
}

const rangerhivePolicies = ['default_user', 'default_cse', 'default_dsip', 'default_bdr']

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const WorkingEnvironmentsForm: React.FC<WorkingEnvironmentsFormProps> = ({
  onClose
  // onAddWorkingEnvironmentSuccess,
  // onAddWorkingEnvironmentFail
}) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(true)
  const [loadingOnSearch, setLoadingOnSearch] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)
  const [workingEnvironment, setWorkingEnvironment] = useState(workingEnvironmentDefault)
  const [jupyterMachines, setJupyterMachines] = useState<JupyterMachine[]>([])
  const [providersSearchResults, setProvidersSearchResults] = useState<Provider[]>([])
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearchTerm = useDebounce(700, searchInput)

  const _onChangeValue = (
    key:
      | 'name'
      | 'usersAssociated'
      | 'sshAccess'
      | 'publicKey'
      | 'machines'
      | 'jupyter'
      | 'tensorbroad'
      | 'brat'
      | 'rangerhivePolicy',
    value: any
  ) => {
    const _workingEnvironmentCopy = { ...workingEnvironment }
    // TODO: fix ts-ignore
    // @ts-ignore
    _workingEnvironmentCopy[key] = value

    setWorkingEnvironment(_workingEnvironmentCopy)
  }

  const addProvider = (provider?: Provider | null) => {
    if (!provider) return

    const _usersAssociatedCopy = workingEnvironment.usersAssociated ?? []

    let alreadyExists = false

    for (const user of _usersAssociatedCopy) {
      if (user.displayed_name === provider.displayed_name) {
        alreadyExists = true
      }
    }

    if (!alreadyExists) {
      _usersAssociatedCopy.push(provider)
    }
    _onChangeValue('usersAssociated', _usersAssociatedCopy)
  }

  const onSubmit = () => {
    setLoadingOnValidate(true)
    setWorkingEnvironment(workingEnvironmentDefault)
    onClose()
    setLoadingOnValidate(false)
  }

  useEffect(() => {
    const _getFormInfos = async () => {
      try {
        setLoading(true)

        const formInfosResp = await getWorkingEnvironmentFormInfos()

        setJupyterMachines(formInfosResp?.jupyterMachines ?? [])
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Erreur lors de la récupération des infos du formulaire', error)
      }
    }

    _getFormInfos()
  }, [])

  useEffect(() => {
    const _searchProviders = async () => {
      try {
        setLoadingOnSearch(true)

        const providersResp = await getProviders(orderDefault, 1, debouncedSearchTerm)

        setProvidersSearchResults(providersResp.providers)

        setLoadingOnSearch(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs')
        setProvidersSearchResults([])
        setLoadingOnSearch(false)
      }
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 0) {
      _searchProviders()
    } else {
      setProvidersSearchResults([])
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <Dialog open maxWidth="md" fullWidth onClose={onClose}>
        <DialogTitle className={classes.dialogTitle}>Création d'un environnement de travail :</DialogTitle>
        <DialogContent>
          {loading ? (
            <Grid container justify="center" style={{ padding: 16 }}>
              <CircularProgress size={40} />
            </Grid>
          ) : (
            <>
              <Grid container direction="column">
                <Typography variant="h6">Informations :</Typography>
                <TextField
                  variant="outlined"
                  margin="normal"
                  autoFocus
                  placeholder="Nom unique de l'environnement de travail"
                  value={workingEnvironment.name}
                  onChange={(event) => _onChangeValue('name', event.target.value)}
                  style={{ margin: '1em' }}
                />
              </Grid>

              <Grid container direction="column">
                <Typography variant="h6">Groupe d'utilisateurs :</Typography>
                <div style={{ display: 'flex', flexDirection: 'column', margin: '1em' }}>
                  <FormLabel style={{ marginBottom: 16 }} component="legend">
                    Sélectionnez la liste des utilisateurs associés à cet environnement (génération automatique d'un nom
                    de groupe unique) :
                  </FormLabel>

                  <Autocomplete
                    noOptionsText="Recherchez un utilisateur"
                    clearOnEscape
                    options={providersSearchResults ?? []}
                    loading={loadingOnSearch}
                    onChange={(e, value) => {
                      addProvider(value)
                      setSearchInput('')
                    }}
                    inputValue={searchInput}
                    onInputChange={() => setSearchInput('')}
                    getOptionLabel={(option) =>
                      `${option.provider_source_value} - ${option.lastname?.toLocaleUpperCase()} ${
                        option.firstname
                      } - ${option.email}` ?? ''
                    }
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
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </Fragment>
                          )
                        }}
                        style={{ marginBottom: '1em' }}
                      />
                    )}
                  />

                  <ProvidersTable
                    providersList={workingEnvironment.usersAssociated}
                    onChangeUsersAssociated={_onChangeValue}
                    usersAssociated={workingEnvironment.usersAssociated}
                  />
                </div>
              </Grid>

              <Grid container direction="column">
                <Typography variant="h6">Souhaitez-vous un accès SSH depuis un terminal ?</Typography>
                <RadioGroup
                  style={{ flexDirection: 'row', padding: '0 1em 8px' }}
                  value={workingEnvironment.sshAccess}
                  onChange={(event) => _onChangeValue('sshAccess', event.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                  <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                </RadioGroup>
              </Grid>

              {workingEnvironment.sshAccess === 'yes' && (
                <Grid container direction="column">
                  <Typography variant="h6">Saisissez votre clé publique :</Typography>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    autoFocus
                    placeholder="Clé publique"
                    value={workingEnvironment.publicKey}
                    onChange={(event) => _onChangeValue('publicKey', event.target.value)}
                    style={{ margin: '1em' }}
                  />
                </Grid>
              )}

              <Grid container direction="column">
                <Typography variant="h6">À quelle(s) machine(s) souhaitez-vous connecter Jupyter ?</Typography>
                <Autocomplete
                  multiple
                  options={jupyterMachines}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => _onChangeValue('machines', value)}
                  renderOption={(option) => <React.Fragment>{option.name}</React.Fragment>}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionnez une à plusieurs machines" variant="outlined" />
                  )}
                  value={workingEnvironment.machines}
                  style={{ margin: '1em' }}
                />
              </Grid>

              <Grid container direction="column">
                <Typography variant="h6">Outils :</Typography>

                <div style={{ margin: '1em' }}>
                  <FormLabel style={{ padding: '0 1em 8px' }} component="legend">
                    Jupyter
                  </FormLabel>
                  <RadioGroup
                    style={{ flexDirection: 'row' }}
                    value={workingEnvironment.jupyter}
                    onChange={(event) => _onChangeValue('jupyter', event.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                  </RadioGroup>

                  <FormLabel style={{ padding: '0 1em 8px' }} component="legend">
                    Tensorbroad
                  </FormLabel>
                  <RadioGroup
                    style={{ flexDirection: 'row' }}
                    value={workingEnvironment.tensorbroad}
                    onChange={(event) => _onChangeValue('tensorbroad', event.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                  </RadioGroup>

                  <FormLabel style={{ padding: '0 1em 8px' }} component="legend">
                    Brat
                  </FormLabel>
                  <RadioGroup
                    style={{ flexDirection: 'row' }}
                    value={workingEnvironment.brat}
                    onChange={(event) => _onChangeValue('brat', event.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                  </RadioGroup>
                </div>
              </Grid>

              <Grid container direction="column">
                <Typography variant="h6">Rangerhive Policy</Typography>
                <Autocomplete
                  options={rangerhivePolicies}
                  onChange={(event, value) => _onChangeValue('rangerhivePolicy', value)}
                  renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
                  renderInput={(params) => (
                    <TextField {...params} label="Sélectionnez la configuration" variant="outlined" />
                  )}
                  value={workingEnvironment.rangerhivePolicy}
                  style={{ margin: '1em' }}
                />
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={onSubmit} color="primary">
            {loadingOnValidate ? <CircularProgress /> : 'Valider'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default WorkingEnvironmentsForm
