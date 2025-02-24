import React, { useEffect, useState } from 'react'
import { Alert, CircularProgress, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router'

import { getProfile } from 'services/Console-Admin/profilesService'
import ProfileComponent from 'components/Console-Admin/Accesses/Profile'
import useStyles from './styles'
import { Profile, User, Role } from 'types'
import { getUser } from 'services/Console-Admin/usersService'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import { getRoles } from 'services/Console-Admin/rolesService'

const ProfilesView: React.FC = () => {
  const { classes } = useStyles()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | undefined>()
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [profiles, setProfiles] = useState<Profile[] | undefined>()
  const [roles, setRoles] = useState<Role[] | undefined>()

  const { user_id } = useParams<{ user_id: string }>()

  const _user_id = user_id ? user_id : ''

  useEffect(() => {
    const _getRoles = async () => {
      try {
        const rolesResp = await getRoles()
        setRoles(rolesResp)
      } catch (error) {
        console.error('Erreur lors de la récupération des habilitations', error)
      }
    }

    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights()

        setUserRights(getUserRightsResponse)
      } catch (error) {
        console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
        setLoading(false)
      }
    }

    const _getProfile = async () => {
      try {
        setLoading(true)

        const userResp = await getUser(_user_id)

        setUser(userResp)

        const profileResp = await getProfile(user_id)

        setProfiles(profileResp)

        setLoading(false)
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur ou du profile`, error)
        setProfiles(undefined)
        setLoading(false)
      }
    }

    _getUserRights()
    _getProfile()
    _getRoles()
  }, [user_id])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={10}>
            <Typography variant="h1" align="center" className={classes.title}>
              {user?.lastname?.toLocaleUpperCase()} {user?.firstname} - id APH : {user?.username}
            </Typography>
            <>
              {profiles ? (
                profiles.length > 0 ? (
                  <>
                    {profiles.map((profile: Profile, index: number) => (
                      <ProfileComponent key={index} profile={profile} userRights={userRights} roles={roles} />
                    ))}
                  </>
                ) : (
                  <Alert severity="error" className={classes.alert}>
                    Cet utilisateur ne possède pas de profil.
                  </Alert>
                )
              ) : (
                <Alert severity="error" className={classes.alert}>
                  Erreur lors de la récupération des données de l'utilisateur, veuillez réessayer ultérieurement ou
                  vérifier vos droits.
                </Alert>
              )}
            </>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default ProfilesView
