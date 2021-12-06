import React, { useState } from 'react'

import { Button, CircularProgress, CssBaseline, Grid, MenuItem, Select, Typography } from '@material-ui/core'

import useStyles from './styles'

const defaultTransfer = {
  environment: '',
  user: '',
  cohort: ''
}

const environments = [
  {
    label: 'Jupyter 1',
    code: 'Bug request'
  },
  {
    label: 'Jupyter 2',
    code: 'Feature request'
  },
  {
    label: 'Jupyter 3',
    code: 'Other'
  }
]

const fakeUsers = [
  'Audrey Villard',
  'Alexandre Martin',
  'Julien Dubiel',
  'Victor Mariot',
  'Salah Bouyahia',
  'Nicolas Puchois',
  'Mourad Sellam'
]

const cohorts = ['Cohorte 1', 'Cohorte 2', 'Cohorte 3', 'Cohorte 4', 'Cohorte 5', 'Cohorte 6']

const ERROR_ENVIRONMENT = 'error_environment'
const ERROR_USER = 'error_user'
const ERROR_COHORT = 'error_cohort'

const Transfert: React.FC = () => {
  const classes = useStyles()

  const [loading /* setLoading */] = useState(false)
  const [transferRequest, setTransferRequest] = useState(defaultTransfer)
  const [error /* setError */] = useState<typeof ERROR_ENVIRONMENT | typeof ERROR_USER | typeof ERROR_COHORT | null>(
    null
  )

  const _onChangeValue = (key: 'environment' | 'user' | 'cohort', value: any) => {
    const _transferRequest = { ...transferRequest }
    _transferRequest[key] = value
    setTransferRequest(_transferRequest)
  }

  return (
    <Grid container direction="column">
      <Grid container direction="column" alignItems="center">
        <CssBaseline />
        <Grid container item xs={12} sm={9} direction="column">
          {loading ? (
            <CircularProgress size={60} className={classes.loading} />
          ) : (
            <>
              <Typography variant="h1" color="primary" className={classes.title} align="center">
                Transfert Jupyter
              </Typography>

              <Typography align="left" variant="h3">
                Choix de l'environnement Jupyter
              </Typography>
              <Select
                required
                value={transferRequest.environment}
                onChange={(event) => _onChangeValue('environment', event.target.value as string)}
                variant="outlined"
                style={{
                  marginTop: 16,
                  marginBottom: 24,
                  backgroundColor: 'white'
                }}
                error={error === ERROR_ENVIRONMENT}
              >
                {environments.map((environment, index) => (
                  <MenuItem key={index} value={environment.code}>
                    {environment.label}
                  </MenuItem>
                ))}
              </Select>

              <Typography align="left" variant="h3">
                Choix de l'utilisateur
              </Typography>
              <Select
                required
                value={transferRequest.user}
                onChange={(event) => _onChangeValue('user', event.target.value as string)}
                variant="outlined"
                style={{
                  marginTop: 16,
                  marginBottom: 24,
                  backgroundColor: 'white'
                }}
                error={error === ERROR_USER}
              >
                {fakeUsers.map((fakeUser, index) => (
                  <MenuItem key={index} value={fakeUser}>
                    {fakeUser}
                  </MenuItem>
                ))}
              </Select>

              <Typography align="left" variant="h3">
                Choix de la cohorte d'un utilisateur
              </Typography>
              <Select
                required
                value={transferRequest.cohort}
                onChange={(event) => _onChangeValue('cohort', event.target.value as string)}
                variant="outlined"
                style={{
                  marginTop: 16,
                  marginBottom: 24,
                  backgroundColor: 'white'
                }}
                error={error === ERROR_COHORT}
                disabled={transferRequest.user === '' ? true : false}
              >
                {cohorts.map((cohort, index) => (
                  <MenuItem key={index} value={cohort}>
                    {cohort}
                  </MenuItem>
                ))}
              </Select>

              <Button variant="contained" disableElevation className={classes.validateButton}>
                Envoyer
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Transfert
