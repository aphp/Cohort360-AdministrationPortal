import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Grid, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Report'

import useStyles from './styles'

const PortailNoRights = () => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{ height: '100vh' }}
    >
      <Grid item className={classes.item}>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Grid item style={{ padding: 16 }}>
            <WarningIcon style={{ fontSize: 60 }} />
          </Grid>
          <Grid item style={{ padding: '8px 32px' }}>
            <Typography style={{ marginBottom: 16 }} variant="h5" align="center">
              Vous n'avez pas accès au Portail d'administration.
            </Typography>
            <Typography style={{ marginBottom: 16 }} align="center">
              S'il s'agit d'une erreur, vous pouvez contacter le support Portail d'administration à l'adresse suivante:
              dsi-id-recherche-support-cohort360@aphp.fr
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Button variant="outlined" style={{ borderColor: 'currentColor' }} onClick={() => navigate(0)}>
          Retour à la connexion
        </Button>
      </Grid>
    </Grid>
  )
}

export default PortailNoRights
