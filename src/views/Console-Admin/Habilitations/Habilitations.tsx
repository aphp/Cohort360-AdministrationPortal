import React, { useEffect, useState } from 'react'

import { CircularProgress, Grid, Typography } from '@material-ui/core'

import RolesTable from 'components/Console-Admin/Roles/RolesTable/RolesTable'

import { getUserRights, userDefaultRoles } from 'utils/userRoles'

import useStyles from './styles'

const Habilitations: React.FC = () => {
  const classes = useStyles()
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [loading, setLoading] = useState(false)

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
      <Grid container justify="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" align="center" className={classes.title}>
            Liste des habilitations
          </Typography>
          {loading ? (
            <Grid container item justify="center">
              <CircularProgress />
            </Grid>
          ) : (
            <RolesTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Habilitations
