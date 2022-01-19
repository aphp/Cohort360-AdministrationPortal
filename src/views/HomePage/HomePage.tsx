import React from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import ComputerIcon from '@material-ui/icons/Computer'
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid'
import logo from 'assets/images/portail-black.png'

import useStyles from './styles'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'state'
import { userDefaultRoles } from 'utils/userRoles'

const HomePage = () => {
  const classes = useStyles()
  const history = useHistory()

  const { me } = useAppSelector((state) => ({ me: state.me }))
  const userRights = me?.userRights ?? userDefaultRoles

  const consolePages = [
    {
      name: 'Liste des utilisateurs',
      pathname: '/console-admin/users',
      rightsToSee: userRights.right_read_users
    },
    {
      name: 'Périmètres',
      pathname: '/console-admin/caresites',
      rightsToSee:
        userRights.right_read_users ||
        userRights.right_read_admin_accesses_same_level ||
        userRights.right_read_admin_accesses_inferior_levels ||
        userRights.right_read_data_accesses_same_level ||
        userRights.right_read_data_accesses_inferior_levels
    },
    {
      name: 'Habilitations',
      pathname: '/console-admin/habilitations',
      rightsToSee: true
    },
    {
      name: 'Logs',
      pathname: '/console-admin/logs',
      rightsToSee: userRights.right_read_logs
    }
  ]

  const jupyterPages = [
    {
      name: 'Transfert Jupyter',
      pathname: `/espace-jupyter/transfert`,
      rightsToSee: userRights.right_review_transfer_jupyter
    }
  ]

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
            {consolePages.map(
              (page, index: number) =>
                page.rightsToSee && (
                  <Button
                    key={index}
                    variant="contained"
                    disableElevation
                    onClick={() => history.push(page.pathname)}
                    className={classes.linkButton}
                  >
                    {page.name}
                  </Button>
                )
            )}
          </Grid>
          {userRights.right_review_transfer_jupyter && (
            <Grid container item className={classes.box} xs={12} sm={4} direction="column" alignItems="center">
              <FlipCameraAndroidIcon style={{ fontSize: 100, marginBottom: 12 }} />
              <Typography variant="h6" style={{ fontSize: 16, marginBottom: 28, lineHeight: 'inherit' }}>
                Espace Jupyter
              </Typography>
              {jupyterPages.map(
                (page, index: number) =>
                  page.rightsToSee && (
                    <Button
                      key={index}
                      variant="contained"
                      disableElevation
                      onClick={() => history.push(page.pathname)}
                      className={classes.linkButton}
                    >
                      {page.name}
                    </Button>
                  )
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage
