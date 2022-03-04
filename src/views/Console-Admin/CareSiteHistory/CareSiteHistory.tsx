import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { CircularProgress, Grid, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import useStyles from './styles'
import { getCareSite, getCareSiteAccesses } from 'services/Console-Admin/careSiteService'
import RightsTable from 'components/Console-Admin/Rights/RightsTable/RightsTable'
import SearchBar from 'components/SearchBar/SearchBar'
import { Access, Order, Role } from 'types'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import useDebounce from 'components/Console-Admin/CareSite/use-debounce'
import { getRoles } from 'services/Console-Admin/rolesService'

const orderDefault = { orderBy: 'is_valid', orderDirection: 'asc' } as Order

const CareSiteHistory: React.FC = () => {
  const classes = useStyles()

  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [careSiteName, setCareSiteName] = useState<string | undefined>()
  const [careSiteAccesses, setCareSiteAccesses] = useState<Access[] | undefined>([])
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState(orderDefault)
  const [roles, setRoles] = useState<Role[] | undefined>()

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const { careSiteId } = useParams<{ careSiteId: string }>()

  const _getCareSiteAccesses = async () => {
    try {
      setLoadingData(true)

      const careSiteAccessesResp = await getCareSiteAccesses(careSiteId, order, page, searchInput.trim())

      setCareSiteAccesses(careSiteAccessesResp?.accesses)
      setTotal(careSiteAccessesResp?.total)

      setLoadingData(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des accès liés à un périmètre.', error)
      setCareSiteAccesses(undefined)
      setTotal(0)

      setLoadingData(false)
    }
  }

  const _getCareSiteName = async () => {
    try {
      setLoadingPage(true)

      const careSiteResp = await getCareSite(careSiteId)
      setCareSiteName(careSiteResp ?? 'Inconnu')

      setLoadingPage(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des accès', error)
      setCareSiteAccesses(undefined)
      setTotal(0)
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    const _getRoles = async () => {
      try {
        const rolesResp = await getRoles()
        setRoles(rolesResp)
      } catch (error) {
        console.error('Erreur lors de la récupération des habilitations', error)
      }
    }

    _getRoles()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoadingPage(true)
        const getUserRightsResponse = await getUserRights()

        setUserRights(getUserRightsResponse)
      } catch (error) {
        console.error("Erreur lors de la récupération des habilitations de l'utilisateur", error)
      }
    }

    _getUserRights()
    _getCareSiteName()
  }, [careSiteId]) // eslint-disable-line

  useEffect(() => {
    _getCareSiteAccesses()
  }, [debouncedSearchTerm, page, order]) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" align="center" className={classes.title}>
              Périmètre {careSiteName}
            </Typography>
            {careSiteAccesses ? (
              <>
                <Grid container item justify="flex-end" alignItems="center" className={classes.searchBar}>
                  <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
                </Grid>
                <RightsTable
                  displayName={true}
                  loading={loadingData}
                  page={page}
                  setPage={setPage}
                  total={total}
                  accesses={careSiteAccesses}
                  getAccesses={_getCareSiteAccesses}
                  order={order}
                  setOrder={setOrder}
                  userRights={userRights}
                  roles={roles}
                />
              </>
            ) : (
              <Alert severity="error" style={{ width: '100%' }}>
                Erreur lors de la récupération des droits de ce périmètre, veuillez réessayer ultérieurement ou vérifier
                vos droits.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default CareSiteHistory
