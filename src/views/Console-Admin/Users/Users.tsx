import React, { useEffect, useState } from 'react'
import { CircularProgress, Grid, Typography } from '@mui/material'

import UsersTable from 'components/Console-Admin/users/UsersTable/UsersTable'

import { getUserRights, userDefaultRoles } from 'utils/userRoles'

import useStyles from './styles'

const UsersView: React.FC = () => {
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
    <Grid id="main-grid-users" container direction="column">
      <Grid container justifyContent="center">
        <Grid container item xs={12} sm={10}>
          <Typography variant="h1" align="center" className={classes.title}>
            Liste des utilisateurs
          </Typography>
          {loading ? (
            <Grid container item justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : (
            <UsersTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UsersView
