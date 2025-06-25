import React, { useEffect, useState } from 'react'

import { Button, Chip, CircularProgress, Grid, Pagination, Typography } from '@mui/material'

import LogsFilters from 'components/Console-Admin/Logs/LogsFilters/LogsFilters'
import LogsTable from 'components/Console-Admin/Logs/LogsTable/LogsTable'

import { getLogs } from 'services/Console-Admin/logsService'
import { Log, LogsFiltersObject } from 'types'

import { ReactComponent as FilterIcon } from 'assets/icones/filter.svg'

import useStyles from './styles'
import moment from 'moment'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'

const filtersDefault = {
  urls: undefined,
  user: null,
  httpMethod: [],
  statusCode: [],
  afterDate: null,
  beforeDate: null,
  access: null,
  perimeter: { perimeterId: null, perimeterName: null }
}

const Logs: React.FC = () => {
  const { classes } = useStyles()

  const search = window.location.search
  const user = new URLSearchParams(search).get('user')
  const access = new URLSearchParams(search).get('access')
  const perimeterId = new URLSearchParams(search).get('perimeterId')
  const perimeterName = new URLSearchParams(search).get('perimeterName')

  const [loading, setLoading] = useState(false)
  const [loadingRights, setLoadingRights] = useState(true)
  const [openFilters, setOpenFilters] = useState(false)
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [filters, setFilters] = useState<LogsFiltersObject>({
    ...filtersDefault,
    user: user,
    access: access,
    perimeter: { perimeterId: perimeterId, perimeterName: perimeterName }
  })
  const [logs, setLogs] = useState<Log[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const rowsPerPage = 20

  const _getLogs = async () => {
    try {
      setLoading(true)

      const logsResp = await getLogs(filters, page)

      setLogs(logsResp?.logs)
      setTotal(logsResp?.total)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des logs', error)
      setLoading(false)
    }
  }

  const _getUserRights = async () => {
    try {
      setLoadingRights(true)

      const getUserRightsResponse = await getUserRights()

      setUserRights(getUserRightsResponse)
      setLoadingRights(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
      setLoadingRights(false)
    }
  }

  useEffect(() => {
    _getUserRights()
  }, [])

  useEffect(() => {
    _getLogs()
  }, [page, filters])

  const handleDeleteChip = (filterName: string, value?: any) => {
    const _filters = { ...filters }

    switch (filterName) {
      case 'user':
      case 'afterDate':
      case 'beforeDate':
      case 'access':
        _filters[filterName] = null
        break
      case 'url':
        _filters['url'] = undefined
        break
      case 'perimeter':
        _filters['perimeter'] = { perimeterId: null, perimeterName: null }
        break
      case 'httpMethod':
      case 'statusCode':
        _filters[filterName] = _filters[filterName].filter((item) => item !== value)
        break
    }

    setFilters(_filters)
    setPage(1)
  }

  return (
    <>
      <Grid container direction="column">
        <Grid container justifyContent="center">
          <Grid container item xs={12} sm={10} justifyContent="flex-end">
            <Typography variant="h1" align="center" className={classes.title}>
              Liste des logs
            </Typography>

            {loadingRights ? (
              <Grid container item justifyContent="center">
                <CircularProgress />
              </Grid>
            ) : (
              <>
                {userRights.right_full_admin && (
                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<FilterIcon height="15px" fill="#FFF" />}
                    className={classes.filterButton}
                    onClick={() => setOpenFilters(true)}
                  >
                    Filtrer
                  </Button>
                )}

                <Grid container item justifyContent="flex-end">
                  {filters.url && (
                    <Chip
                      className={classes.filterChip}
                      label={`URL : ${filters.url.label}`}
                      onDelete={() => handleDeleteChip('url')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.user && (
                    <Chip
                      className={classes.filterChip}
                      label={`Utilisateur : ${filters.user}`}
                      onDelete={() => handleDeleteChip('user')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.httpMethod.length > 0 &&
                    filters.httpMethod.map((method: string, index: number) => (
                      <Chip
                        key={index}
                        className={classes.filterChip}
                        label={`Méthode : ${method}`}
                        onDelete={() => handleDeleteChip('httpMethod', method)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  {filters.statusCode.length > 0 &&
                    filters.statusCode.map((code: string, index: number) => (
                      <Chip
                        key={index}
                        className={classes.filterChip}
                        label={`Code : ${code}`}
                        onDelete={() => handleDeleteChip('statusCode', code)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  {filters.afterDate && (
                    <Chip
                      className={classes.filterChip}
                      label={`Après le : ${moment(filters.afterDate).format('DD/MM/YYYY')}`}
                      onDelete={() => handleDeleteChip('afterDate')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.beforeDate && (
                    <Chip
                      className={classes.filterChip}
                      label={`Avant le : ${moment(filters.beforeDate).format('DD/MM/YYYY')}`}
                      onDelete={() => handleDeleteChip('beforeDate')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.access && (
                    <Chip
                      className={classes.filterChip}
                      label={`Accès : ${filters.access}`}
                      onDelete={() => handleDeleteChip('access')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.perimeter.perimeterId && (
                    <Chip
                      className={classes.filterChip}
                      label={`Périmètre : ${filters.perimeter.perimeterName?.split('.').join(' ')}`}
                      onDelete={() => handleDeleteChip('perimeter')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Grid>

                <LogsTable loading={loading} logs={logs} />
                <Pagination
                  className={classes.pagination}
                  count={Math.ceil(total / rowsPerPage)}
                  shape="circular"
                  onChange={(event, page: number) => setPage(page)}
                  page={page}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Grid>

      {openFilters && (
        <LogsFilters
          filters={filters}
          onChangeFilters={(newFilters) => {
            setFilters(newFilters)
            setPage(1)
          }}
          onClose={() => setOpenFilters(false)}
          userRights={userRights}
        />
      )}
    </>
  )
}

export default Logs
