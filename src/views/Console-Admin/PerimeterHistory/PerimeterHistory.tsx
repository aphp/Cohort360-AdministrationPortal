import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert, CircularProgress, Grid, Typography } from '@mui/material'

import useStyles from './styles'
import { getPerimeter, getPerimeterAccesses } from 'services/Console-Admin/perimetersService'
import AccessesTable from 'components/Console-Admin/Accesses/AccessesTable/AccessesTable'
import SearchBar from 'components/SearchBar/SearchBar'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { getRoles } from 'services/Console-Admin/rolesService'
import { Access, Order, Role } from 'types'

const orderDefault = { orderBy: 'is_valid', orderDirection: 'asc' } as Order

const PerimeterHistory: React.FC = () => {
  const { classes } = useStyles()

  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [perimeterName, setPerimeterName] = useState<string | undefined>()
  const [perimeterAccesses, setPerimeterAccesses] = useState<Access[] | undefined>([])
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState(orderDefault)
  const [roles, setRoles] = useState<Role[]>([])

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const { perimeterId } = useParams<{ perimeterId: string }>()

  const _perimeterId = perimeterId ? perimeterId : ''

  const _getPerimeterAccesses = async () => {
    try {
      setLoadingData(true)

      const perimeterAccessesResp = await getPerimeterAccesses(_perimeterId, order, page, searchInput.trim())

      setPerimeterAccesses(perimeterAccessesResp?.accesses)
      setTotal(perimeterAccessesResp?.total)

      setLoadingData(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des accès liés à un périmètre.', error)
      setPerimeterAccesses(undefined)
      setTotal(0)

      setLoadingData(false)
    }
  }

  const _getPerimeterName = async () => {
    try {
      setLoadingPage(true)

      const perimeterResp = await getPerimeter(_perimeterId)
      setPerimeterName(perimeterResp ?? 'Inconnu')

      setLoadingPage(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des accès', error)
      setPerimeterAccesses(undefined)
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
    _getPerimeterName()
  }, [perimeterId]) // eslint-disable-line

  useEffect(() => {
    _getPerimeterAccesses()
  }, [debouncedSearchTerm, page, order]) // eslint-disable-line

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" align="center" className={classes.title}>
              Périmètre {perimeterName}
            </Typography>
            {perimeterAccesses ? (
              <>
                <Grid container item justifyContent="flex-end" alignItems="center" className={classes.searchBar}>
                  <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
                </Grid>
                <AccessesTable
                  displayName={true}
                  loading={loadingData}
                  page={page}
                  setPage={setPage}
                  total={total}
                  accesses={perimeterAccesses}
                  getAccesses={_getPerimeterAccesses}
                  order={order}
                  setOrder={setOrder}
                  userRights={userRights}
                  roles={roles}
                />
              </>
            ) : (
              <Alert severity="error" style={{ width: '100%' }}>
                Erreur lors de la récupération des accès de ce périmètre, veuillez réessayer ultérieurement ou vérifier
                vos habilitations.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default PerimeterHistory
