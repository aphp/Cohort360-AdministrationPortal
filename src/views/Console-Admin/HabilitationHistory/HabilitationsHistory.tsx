import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Alert, CircularProgress, Grid, Typography } from '@mui/material'

import HabilitationTable from 'components/HabilitationTable/HabilitationTable'
import { getUsersHabilitation, getRoleUser } from 'services/Console-Admin/rolesService'
import SearchBar from 'components/SearchBar/SearchBar'
import useStyles from './style'
import { Habilitation, Order } from 'types'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const HabilitationsHistory: React.FC = () => {
  const [habilitationName, setHabilitationName] = useState<string | undefined>()
  const [habilitations, setHabilitations] = useState<Habilitation[] | undefined>([])
  const [loadingPage, setLoadingPage] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState(orderDefault)
  const { classes } = useStyles()

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const { habilitationId } = useParams<{ habilitationId: string }>()

  const _habilitationId = habilitationId ? habilitationId : ''

  const _getHabilitationAccesses = async () => {
    try {
      setLoadingPage(true)
      const habilitationAccessesResp = await getUsersHabilitation(_habilitationId, order, page, searchInput.trim())
      setHabilitations(habilitationAccessesResp?.accesses)
      setTotal(habilitationAccessesResp?.total)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs liés à une habilitation.', error)
      setHabilitations([])
      setTotal(0)
    } finally {
      setLoadingPage(false)
    }
  }

  const getHabilitationName = async () => {
    const habilitationResp = await getRoleUser(_habilitationId)
    setHabilitationName(habilitationResp ?? 'Inconnu')
  }

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  useEffect(() => {
    getHabilitationName()
  }, [habilitationName])

  useEffect(() => {
    _getHabilitationAccesses()
  }, [debouncedSearchTerm, page, order])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            <Typography variant="h1" align="center" className={classes.title}>
              Habilitation - {habilitationName}
            </Typography>
            {habilitations ? (
              <>
                <Grid container item justifyContent="flex-end" alignItems="center" className={classes.searchBar}>
                  <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
                </Grid>
                <HabilitationTable
                  habilitations={habilitations}
                  page={page}
                  setPage={setPage}
                  total={total}
                  order={order}
                  setOrder={setOrder}
                />
              </>
            ) : (
              <Alert severity="error" style={{ width: '100%' }}>
                Erreur lors de la récupération des utilisateurs pour cette habilitation, veuillez réessayer
                ultérieurement ou vérifier vos habilitations.
              </Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default HabilitationsHistory
