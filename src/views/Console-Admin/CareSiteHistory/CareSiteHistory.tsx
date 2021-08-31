import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { CircularProgress, Grid, Typography } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import useStyles from "./styles"
import {
  getCareSite,
  getCareSiteAccesses,
} from "services/Console-Admin/careSiteService"
import RightsTable from "components/Console-Admin/Rights/RightsTable/RightsTable"
import SearchBar from "components/SearchBar/SearchBar"
import { Access } from "types"

const CareSiteHistory: React.FC = () => {
  const classes = useStyles()

  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [careSiteName, setCareSiteName] = useState<string | undefined>()
  const [careSiteAccesses, setCareSiteAccesses] = useState<
    Access[] | undefined
  >()
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const { careSiteId } = useParams<{ careSiteId: string }>()

  const _getCareSiteAccesses = async () => {
    try {
      setLoadingPage(true)

      const careSiteResp = await getCareSite(careSiteId)
      setCareSiteName(careSiteResp ?? "Inconnu")

      const careSiteAccessesResp = await getCareSiteAccesses(
        careSiteId,
        page,
        searchInput
      )
      setCareSiteAccesses(careSiteAccessesResp?.accesses)
      setTotal(careSiteAccessesResp?.total)

      setLoadingPage(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des accès", error)
      setCareSiteAccesses(undefined)
      setTotal(0)
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [searchInput])

  useEffect(() => {
    _getCareSiteAccesses()
  }, [careSiteId]) // eslint-disable-line

  useEffect(() => {
    const fetchCareSiteAccesses = async () => {
      try {
        setLoadingData(true)

        const careSiteAccessesResp = await getCareSiteAccesses(
          careSiteId,
          page,
          searchInput
        )

        setCareSiteAccesses(careSiteAccessesResp?.accesses)
        setTotal(careSiteAccessesResp?.total)

        setLoadingData(false)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des accès liés à un périmètre.",
          error
        )
        setCareSiteAccesses(undefined)
        setTotal(0)

        setLoadingData(false)
      }
    }

    fetchCareSiteAccesses()
  }, [careSiteAccesses?.length, searchInput, page]) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" color="primary" className={classes.title}>
              Périmètre {careSiteName}
            </Typography>
            {careSiteAccesses ? (
              <>
                <Grid
                  container
                  item
                  justify="flex-end"
                  alignItems="center"
                  className={classes.searchBar}
                >
                  <SearchBar
                    searchInput={searchInput}
                    onChangeInput={setSearchInput}
                  />
                </Grid>
                <RightsTable
                  displayName={true}
                  loading={loadingData}
                  page={page}
                  setPage={setPage}
                  total={total}
                  accesses={careSiteAccesses}
                  getAccesses={_getCareSiteAccesses}
                />
              </>
            ) : (
              <Alert severity="error" style={{ width: "100%" }}>
                Erreur lors de la récupération des droits de ce périmètre,
                veuillez réessayer ultérieurement ou vérifier vos droits.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default CareSiteHistory
