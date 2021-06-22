import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
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
        ) : (
          <Grid container item xs={12} sm={9}>
            {user && (
              <>
                <Typography
                  variant="h1"
                  color="primary"
                  className={classes.title}
                >
                  {user[0].provider_name} - id APH :{" "}
                  {user[0].provider_source_value}
                </Typography>
                {user.map((userRight: Profile) => (
                  <Rights right={userRight} />
                ))}
              </>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default ProviderHistory
