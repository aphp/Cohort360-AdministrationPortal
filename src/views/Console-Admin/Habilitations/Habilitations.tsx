import React, { useEffect, useState } from 'react'

import { CircularProgress, Grid, Typography } from '@mui/material'

import HabilitationsTable from 'components/Console-Admin/Habilitations/HabilitationsTable/HabilitationsTable'

import { getUserRights, userDefaultRoles } from 'utils/userRoles'

import useStyles from './styles'

const Habilitations: React.FC = () => {
  const { classes } = useStyles()
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
        console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
        setLoading(false)
      }
    }

    _getUserRights()
  }, [])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        <Grid container item xs={12} sm={10}>
          <Typography variant="h1" align="center" className={classes.title}>
            Liste des habilitations
          </Typography>
          {loading ? (
            <Grid container item justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <HabilitationsTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Habilitations
