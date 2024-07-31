import React from 'react'
import { Button, Grid, Typography } from '@mui/material'
import ComputerIcon from '@mui/icons-material/Computer'
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid'
import logo from 'assets/images/portail-black.png'

import useStyles from './styles'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'state'
import { userDefaultRoles } from 'utils/userRoles'
import { ENABLE_DATALABS } from '../../constants'

const HomePage = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()

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
      pathname: '/console-admin/perimeters',
      rightsToSee:
        userRights.right_read_admin_accesses_same_level ||
        userRights.right_read_accesses_above_levels ||
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
      rightsToSee:
        userRights.right_manage_export_jupyter_accesses ||
        userRights.right_export_jupyter_nominative ||
        userRights.right_export_jupyter_pseudonymized
    },
    {
      name: 'Transfert Datalab',
      pathname: `/espace-jupyter/export`,
      rightsToSee:
        userRights.right_manage_export_jupyter_accesses ||
        userRights.right_export_jupyter_nominative ||
        userRights.right_export_jupyter_pseudonymized
    },
    {
      name: 'Environnements de travail',
      pathname: `/espace-jupyter/working-environments`,
      rightsToSee: userRights.right_read_datalabs
    }
    // {
    //   name: 'Environnements de travail',
    //   pathname: `/espace-jupyter/working-environments`,
    //   rightsToSee: userRights.right_read_datalabs
    // }
  ]

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12} container direction="column" alignItems="center">
        <img src={logo} alt="Logo Portail" style={{ width: 300, paddingTop: 60 }} />
        <Typography variant="h1" align="center" className={classes.title}>
          Bienvenue sur le portail de l'EDS
        </Typography>
        <Grid item xs={12} lg={8} container justifyContent="space-around">
          <Grid item xs={12} sm={3} container direction="column" alignItems="center" className={classes.box}>
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
                    onClick={() => navigate(page.pathname)}
                    className={classes.linkButton}
                  >
                    {page.name}
                  </Button>
                )
            )}
          </Grid>
          {(userRights.right_manage_export_jupyter_accesses ||
            userRights.right_export_jupyter_nominative ||
            userRights.right_export_jupyter_pseudonymized ||
            userRights.right_read_datalabs) && ENABLE_DATALABS && (
            <Grid item xs={12} sm={3} container direction="column" alignItems="center" className={classes.box}>
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
                      onClick={() => navigate(page.pathname)}
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
