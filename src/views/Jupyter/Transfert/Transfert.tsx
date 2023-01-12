import React, { useEffect, useState } from 'react'

import { CircularProgress, CssBaseline, Grid, Typography } from '@material-ui/core'

import TransfertsTable from 'components/Jupyter/TransfertsTable/TransfertsTable'

import { getUserRights, userDefaultRoles } from 'utils/userRoles'

import useStyles from './styles'

const Transfert: React.FC = () => {
  const classes = useStyles()

  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights()

        setUserRights(getUserRightsResponse)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des habilitations de l'utilisateur", error)
        setLoading(false)
      }
    }

    _getUserRights()
  }, []) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container direction="column" alignItems="center">
        <CssBaseline />
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" className={classes.title} align="center">
            Liste des demandes de transfert
          </Typography>
          {loading ? (
            <Grid container item justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <TransfertsTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Transfert
