import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert, CircularProgress, Grid, Typography } from '@mui/material'

import HabilitationTable from 'components/HabilitationTable/HabilitationTable'
import { getUsersRole, getRoleUser } from 'services/Console-Admin/rolesService'
import SearchBar from 'components/SearchBar/SearchBar'
import useStyles from './style'
import { UserInHabilitation, Order } from 'types'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const HabilitationUsers: React.FC = () => {
  const [habilitationName, setHabilitationName] = useState<string | undefined>()
  const [usersInHabilitation, setUsersInHabilitation] = useState<UserInHabilitation[] | undefined>([])
  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState(orderDefault)
  const { classes } = useStyles()

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const { habilitationId } = useParams<{ habilitationId: string }>()

  const _habilitationId = habilitationId ?? ''

  const _getHabilitationAccesses = async () => {
    try {
      setLoadingTable(true)
      const habilitationAccessesResp = await getUsersRole(_habilitationId, order, page, searchInput.trim())
      setUsersInHabilitation(habilitationAccessesResp?.accesses)
      setTotal(habilitationAccessesResp?.total)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs liés à une habilitation.', error)
      setUsersInHabilitation([])
      setTotal(0)
    } finally {
      setLoadingTable(false)
    }
  }

  const getHabilitationName = async () => {
    try {
      setLoadingPage(true)
      const habilitationResp = await getRoleUser(_habilitationId)
      setHabilitationName(habilitationResp ?? 'Inconnu')
    } catch (error) {
      console.error("Erreur lors de la récupération du nom de l'habilitation", error)
      setHabilitationName('Inconnu')
    } finally {
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    getHabilitationName()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    _getHabilitationAccesses()
  }, [debouncedSearchTerm, page, order])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={10}>
            <Typography variant="h1" align="center" className={classes.title}>
              Habilitation - {habilitationName}
            </Typography>
            {usersInHabilitation ? (
              <>
                <Grid container item justifyContent="flex-end" alignItems="center" className={classes.searchBar}>
                  <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
                </Grid>
                <HabilitationTable
                  usersInHabilitation={usersInHabilitation}
                  page={page}
                  setPage={setPage}
                  total={total}
                  order={order}
                  setOrder={setOrder}
                  loading={loadingTable}
                />
              </>
            ) : (
              <Alert severity="error" style={{ width: '100%' }}>
                Erreur lors de la récupération des utilisateurs pour cette habilitation, veuillez réessayer
                ultérieurement ou vérifier vos droits.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default HabilitationUsers
