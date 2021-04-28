import React, { useEffect, useState } from "react"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import { useParams } from "react-router"

import { submitGetProfile } from "services/Console-Admin/providersHistoryService"
import RightsTable from "components/Console-Admin/RightsTable/RightsTable"
import useStyles from "./styles"

const ProviderHistory: React.FC = () => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState()

  const { providerId } = useParams<{ providerId: string }>()

  useEffect(() => {
    setLoading(true)
    submitGetProfile(providerId)
      .then((userResp) => {
        setUser(userResp)
        console.log(`userResp`, userResp)
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
                {user.map((userRight) => (
                  <RightsTable right={userRight} />
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
