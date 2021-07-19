import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { useParams } from "react-router"

import { getProfile } from "services/Console-Admin/providersHistoryService"
import Rights from "components/Console-Admin/Rights/Rights"
import useStyles from "./styles"
import { Profile } from "types"

const ProviderHistory: React.FC = () => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<Profile[] | undefined>()

  const { providerId } = useParams<{ providerId: string }>()

  useEffect(() => {
    setLoading(true)
    getProfile(providerId)
      .then((userResp) => {
        setUser(userResp)
      })
      .then(() => setLoading(false))
  }, [providerId])

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : user && user.length > 0 ? (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" color="primary" className={classes.title}>
              {user[0].provider_name} - id APH : {user[0].provider_source_value}
            </Typography>
            {user.map((userRight: Profile) => (
              <Rights right={userRight} />
            ))}
          </Grid>
        ) : (
          <Alert severity="error" className={classes.alert}>
            Erreur lors de la récupération des données de l'utilisateur,
            veuillez réessayer ultérieurement.
          </Alert>
        )}
      </Grid>
    </Grid>
  )
}

export default ProviderHistory
