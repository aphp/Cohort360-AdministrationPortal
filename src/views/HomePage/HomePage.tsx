import React from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import ComputerIcon from '@material-ui/icons/Computer'
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid'
import logo from 'assets/images/portail-black.png'

import useStyles from './styles'
import { useHistory } from 'react-router-dom'

const HomePage = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Grid container direction="column" alignItems="center">
      <Grid container item xs={12} sm={8} direction="column" alignItems="center">
        <img src={logo} alt="Logo Portail" style={{ width: 300, paddingTop: 60 }} />
        <Typography variant="h1" align="center" className={classes.title}>
          Bienvenue sur le portail de l'EDS
        </Typography>
        <Grid container item justify="space-around">
          <Grid container item className={classes.box} xs={12} sm={4} direction="column" alignItems="center">
            <ComputerIcon style={{ fontSize: 100, marginBottom: 12 }} />
            <Typography variant="h6" style={{ fontSize: 16, marginBottom: 28, lineHeight: 'inherit' }}>
              Console Admin
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => history.push('/console-admin/users')}
              className={classes.linkButton}
            >
              Liste des utilisateurs
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => history.push('/console-admin/caresites')}
              className={classes.linkButton}
            >
              Périmètres
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => history.push('/console-admin/habilitations')}
              className={classes.linkButton}
            >
              Habilitations
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => history.push('/console-admin/logs')}
              className={classes.linkButton}
            >
              Logs
            </Button>
          </Grid>
          <Grid container item className={classes.box} xs={12} sm={4} direction="column" alignItems="center">
            <FlipCameraAndroidIcon style={{ fontSize: 100, marginBottom: 12 }} />
            <Typography variant="h6" style={{ fontSize: 16, marginBottom: 28, lineHeight: 'inherit' }}>
              Espace Jupyter
            </Typography>
            <Button
              variant="contained"
              disableElevation
              onClick={() => history.push('/espace-jupyter/transfert')}
              className={classes.linkButton}
            >
              Transfert Jupyter
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage
