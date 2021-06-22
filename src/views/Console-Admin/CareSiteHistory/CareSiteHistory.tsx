import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { CircularProgress, Grid, Typography } from "@material-ui/core"

import useStyles from "./styles"
import {
  getCareSite,
  getCareSiteAccesses,
} from "services/Console-Admin/careSiteService"
import RightsTable from "components/Console-Admin/Rights/RightsTable/RightsTable"
import { Access } from "types"

const CareSiteHistory: React.FC = () => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [careSiteName, setCareSiteName] = useState<string | undefined>()
  const [careSiteAccesses, setCareSiteAccesses] =
    useState<Access[] | undefined>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const { careSiteId } = useParams<{ careSiteId: string }>()

  const _getCareSiteAccesses = () => {
    setLoading(true)
    getCareSite(careSiteId).then((careSiteResp) =>
      setCareSiteName(careSiteResp ?? "Inconnu")
    )
    getCareSiteAccesses(careSiteId)
      .then((careSiteAccessesResp) => {
        setCareSiteAccesses(careSiteAccessesResp?.accesses)
        setTotal(careSiteAccessesResp?.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    _getCareSiteAccesses()
  }, [careSiteId, careSiteAccesses?.length, page]) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            {careSiteAccesses && (
              <>
                <Typography
                  variant="h1"
                  color="primary"
                  className={classes.title}
                >
                  Périmètre {careSiteName}
                </Typography>
                <RightsTable
                  displayName={true}
                  loading={loading}
                  page={page}
                  setPage={setPage}
                  total={total}
                  accesses={careSiteAccesses}
                  getAccesses={_getCareSiteAccesses}
                />
              </>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default CareSiteHistory
