import React, { useEffect, useState } from 'react'

import { CircularProgress, Grid, Typography } from '@mui/material'

import WorkingEnvironmentsTable from 'components/Jupyter/WorkingEnvironments/WorkingEnvironmentsTable/WorkingEnvironmentsTable'

import { getUserRights, userDefaultRoles } from 'utils/userRoles'

import useStyles from './styles'

const WorkingEnvironments = () => {
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
    <Grid id="main-grid-providers" container direction="column">
      <Grid container justifyContent="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" align="center" className={classes.title}>
            Liste des environnements de travail
          </Typography>
          {loading ? (
            <Grid container item justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <WorkingEnvironmentsTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default WorkingEnvironments
