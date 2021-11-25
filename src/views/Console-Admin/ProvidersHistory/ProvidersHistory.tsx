import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useParams } from "react-router"

import { getProfile } from "services/Console-Admin/providersHistoryService"
import Rights from "components/Console-Admin/Rights/Rights"
import useStyles from "./styles"
import { Profile, Provider } from "types"
import { getProvider } from "services/Console-Admin/providersService"
import { useAppSelector } from "state"
import { getUserRights, userDefaultRoles } from "utils/userRoles"

const ProviderHistory: React.FC = () => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<Provider | undefined>()
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [rights, setRights] = useState<Profile[] | undefined>()
  const { me } = useAppSelector((state) => ({ me: state.me }))

  const { providerId } = useParams<{ providerId: string }>()

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights(
          me?.providerSourceValue
        )

        setUserRights(getUserRightsResponse)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des habilitations de l'utilisateur",
          error
        )
        setLoading(false)
      }
    }

    const getProviderHistory = async () => {
      try {
        setLoading(true)

        const providerResp = await getProvider(providerId)

        setProvider(providerResp)

        const rightsResp = await getProfile(providerId)

        setRights(rightsResp)

        setLoading(false)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du provider ou du profile",
          error
        )
        setRights(undefined)
        setLoading(false)
      }
    }

    _getUserRights()
    getProviderHistory()
  }, [providerId]) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" align="center" className={classes.title}>
              {provider?.provider_name} - id APH :{" "}
              {provider?.provider_source_value}
            </Typography>
            <>
              {rights ? (
                rights.length > 0 ? (
                  <>
                    {rights.map((userRight: Profile) => (
                      <Rights right={userRight} userRights={userRights} />
                    ))}
                  </>
                ) : (
                  <Alert severity="error" className={classes.alert}>
                    Cet utilisateur ne possède pas de profil.
                  </Alert>
                )
              ) : (
                <Alert severity="error" className={classes.alert}>
                  Erreur lors de la récupération des données de l'utilisateur,
                  veuillez réessayer ultérieurement ou vérifier vos droits.
                </Alert>
              )}
            </>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default ProviderHistory
