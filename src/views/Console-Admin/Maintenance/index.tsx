/* eslint-disable react/react-in-jsx-scope */
import { CircularProgress, Grid, Typography } from '@mui/material'
import useStyles from './styles'
import { useEffect, useState } from 'react'
import MaintenanceTable from 'components/Console-Admin/MaintenanceTable'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import { UserRole } from 'types'

const MaintenanceManagement = () => {
  const { classes } = useStyles()
  const [userRights, setUserRights] = useState<UserRole>(userDefaultRoles)
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
    }, []) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        <Grid container item xs={12} sm={10}>
          <Grid container>
            <Typography variant="h1" align="center" className={classes.title}>
              Gestion des maintenances
            </Typography>
          </Grid>
          <Grid container item>
            {loading ? (
              <Grid container justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : (
              <MaintenanceTable userRights={userRights} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MaintenanceManagement
