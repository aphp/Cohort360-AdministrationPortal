import React, { Fragment, useEffect, useState } from 'react'

import {
  Autocomplete,
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
} from '@mui/material'

import UsersTable from './components/UsersTable/UsersTable'
import { getJupyterMachines, getRangerHivePolicies } from 'services/Jupyter/workingEnvironmentsService'
import { getUsers } from 'services/Console-Admin/usersService'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { JupyterMachine, Order, User, UserRole } from 'types'

type WorkingEnvironmentsFormProps = {
  userRights: UserRole
  onClose: () => void
  onAddWorkingEnvironmentSuccess: (success: boolean) => void
  onAddWorkingEnvironmentFail: (fail: boolean) => void
}

const workingEnvironmentDefault = {
  name: '',
  usersAssociated: [] as User[],
  sshAccess: 'no',
  publicKey: '',
  machines: [],
  jupyter: 'no',
  tensorboard: 'no',
  brat: 'no',
  rangerhivePolicy: null
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const WorkingEnvironmentsForm: React.FC<WorkingEnvironmentsFormProps> = ({
  onClose
  // onAddWorkingEnvironmentSuccess,
  // onAddWorkingEnvironmentFail
}) => {
  const [loading, setLoading] = useState(true)
  const [loadingOnSearch, setLoadingOnSearch] = useState(false)
  const [loadingOnValidate, setLoadingOnValidate] = useState(false)
  const [workingEnvironment, setWorkingEnvironment] = useState(workingEnvironmentDefault)
  const [jupyterMachines, setJupyterMachines] = useState<JupyterMachine[]>([])
  const [rangerhivePolicies, setRangerhivePolicies] = useState([])
  const [usersSearchResults, setUsersSearchResults] = useState<User[]>([])
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
      | 'tensorboard'
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

  const addUser = (user?: User | null) => {
    if (!user) return

    const _usersAssociatedCopy = workingEnvironment.usersAssociated ?? []

    let alreadyExists = false

    for (const _user of _usersAssociatedCopy) {
      if (user.display_name === _user.display_name) {
        alreadyExists = true
      }
    }

    if (!alreadyExists) {
      _usersAssociatedCopy.push(user)
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

        const jupyterMachinesResp = await getJupyterMachines()
        const rangerhivePoliciesResp = await getRangerHivePolicies()

        setJupyterMachines(jupyterMachinesResp ?? [])
        setRangerhivePolicies(rangerhivePoliciesResp ?? [])
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Erreur lors de la récupération des infos du formulaire', error)
      }
    }

    _getFormInfos()
  }, [])

  useEffect(() => {
    const _searchUsers = async () => {
      try {
        setLoadingOnSearch(true)

        const usersResp = await getUsers(orderDefault, 1, debouncedSearchTerm)

        setUsersSearchResults(usersResp.users)

        setLoadingOnSearch(false)
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs')
        setUsersSearchResults([])
        setLoadingOnSearch(false)
      }
    }

    if (debouncedSearchTerm && debouncedSearchTerm?.length > 0) {
      _searchUsers()
    } else {
      setUsersSearchResults([])
    }
  }, [debouncedSearchTerm])

  return (
    <>
      <Dialog open maxWidth="md" fullWidth onClose={onClose}>
        <DialogTitle>Création d'un environnement de travail :</DialogTitle>
        <DialogContent>
          {loading ? (
            <Grid container justifyContent="center" style={{ padding: 16 }}>
              <CircularProgress size={40} />
            </Grid>
          ) : (
            <>
              <Grid container direction="column">
                <Typography variant="h6">Informations :</Typography>
                <TextField
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
                    options={usersSearchResults ?? []}
                    loading={loadingOnSearch}
                    onChange={(e, value) => {
                      addUser(value)
                      setSearchInput('')
                    }}
                    inputValue={searchInput}
                    onInputChange={() => setSearchInput('')}
                    getOptionLabel={(option) =>
                      `${option.username} - ${option.lastname?.toLocaleUpperCase()} ${
                        option.firstname
                      } - ${option.email}` ?? ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Rechercher un utilisateur"
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

                  <UsersTable
                    usersList={workingEnvironment.usersAssociated}
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
                  <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                  <FormControlLabel value="no" control={<Radio />} label="Non" />
                </RadioGroup>
              </Grid>

              {workingEnvironment.sshAccess === 'yes' && (
                <Grid container direction="column">
                  <Typography variant="h6">Saisissez votre clé publique :</Typography>
                  <TextField
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
                  renderOption={(props, option) => <li {...props}>{option.name}</li>}
                  renderInput={(params) => <TextField {...params} label="Sélectionnez une à plusieurs machines" />}
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
                    <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio />} label="Non" />
                  </RadioGroup>

                  <FormLabel style={{ padding: '0 1em 8px' }} component="legend">
                    Tensorboard
                  </FormLabel>
                  <RadioGroup
                    style={{ flexDirection: 'row' }}
                    value={workingEnvironment.tensorboard}
                    onChange={(event) => _onChangeValue('tensorboard', event.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio />} label="Non" />
                  </RadioGroup>

                  <FormLabel style={{ padding: '0 1em 8px' }} component="legend">
                    Brat
                  </FormLabel>
                  <RadioGroup
                    style={{ flexDirection: 'row' }}
                    value={workingEnvironment.brat}
                    onChange={(event) => _onChangeValue('brat', event.target.value)}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Oui" />
                    <FormControlLabel value="no" control={<Radio />} label="Non" />
                  </RadioGroup>
                </div>
              </Grid>

              <Grid container direction="column">
                <Typography variant="h6">Rangerhive Policy</Typography>
                <Autocomplete
                  options={rangerhivePolicies}
                  onChange={(event, value) => _onChangeValue('rangerhivePolicy', value)}
                  renderOption={(props, option) => <li {...props}>{option}</li>}
                  renderInput={(params) => <TextField {...params} label="Sélectionnez la configuration" />}
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
