import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardContent, CircularProgress, Grid, Switch, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

import { getPerimeter, getPerimeterAccesses } from 'services/Console-Admin/perimetersService'
import AccessesTable from 'components/Console-Admin/Accesses/AccessesTable/AccessesTable'
import SearchBar from 'components/SearchBar/SearchBar'
import { getUserRights, userDefaultRoles } from 'utils/userRoles'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { getRoles } from 'services/Console-Admin/rolesService'
import { Access, CareSite, Order, Role } from 'types'

import useStyles from './styles'

const orderDefault = { orderBy: 'is_valid', orderDirection: 'asc' } as Order

export const getPerimeterData = (perimeterInfos?: CareSite) => {
  return [
    {
      title: 'Nb de patients',
      number: perimeterInfos?.cohort_size ?? '-'
    },
    {
      title: (
        <>
          Nb utilisateurs
          <Tooltip title="Estimation du nombre d'utilisateurs ayant un accès à un périmètre exactement">
            <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      number: perimeterInfos?.count_allowed_users ?? '-'
    },
    {
      title: (
        <>
          Nb utilisateurs (inf)
          <Tooltip title="Estimation du nombre d'utilisateurs ayant un accès à ce périmètre et/ou au moins un de ses sous périmètres">
            <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      number: perimeterInfos?.count_allowed_users_inferior_levels ?? '-'
    },
    {
      title: (
        <>
          Nb utilisateurs (sup)
          <Tooltip title="Estimation des utilisateurs ayant accès à ce périmètre et/ou au moins un périmètre au-dessus (parent)">
            <InfoIcon color="action" fontSize="small" style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      number: perimeterInfos?.count_allowed_users_above_levels ?? '-'
    }
  ]
}

const PerimeterHistory: React.FC = () => {
  const { classes } = useStyles()

  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [perimeterInfos, setPerimeterInfos] = useState<CareSite | undefined>()
  const [perimeterAccesses, setPerimeterAccesses] = useState<Access[] | undefined>([])
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [order, setOrder] = useState(orderDefault)
  const [roles, setRoles] = useState<Role[]>([])
  const [includeParentPerimeters, setIncludeParentPerimeters] = useState<boolean>(false)
  const [includeChildPerimeters, setIncludeChildPerimeters] = useState<boolean>(false)
  const [userCanReadAccessFromOtherLevels, setUserCanReadAccessFromOtherLevels] = useState<boolean>(false)
  const debouncedSearchTerm = useDebounce(500, searchInput)

  const { perimeterId } = useParams<{ perimeterId: string }>()

  const _perimeterId = perimeterId ? perimeterId : ''

  const perimeterData = getPerimeterData(perimeterInfos)

  const _getPerimeterAccesses = async () => {
    try {
      setLoadingData(true)

      const perimeterAccessesResp = await getPerimeterAccesses(
        _perimeterId,
        order,
        includeParentPerimeters,
        includeChildPerimeters,
        page,
        searchInput.trim()
      )

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

  const _getPerimeterInfos = async () => {
    try {
      setLoadingPage(true)

      const perimeterResp = await getPerimeter(_perimeterId)
      setPerimeterInfos(perimeterResp)

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
        setUserCanReadAccessFromOtherLevels(
          !!(
            getUserRightsResponse.right_read_accesses_above_levels ||
            getUserRightsResponse.right_manage_data_accesses_inferior_levels ||
            getUserRightsResponse.right_manage_admin_accesses_inferior_levels
          )
        )
      } catch (error) {
        console.error("Erreur lors de la récupération des droits de l'utilisateur", error)
      }
    }

    _getUserRights()
    _getPerimeterInfos()
  }, [perimeterId])

  useEffect(() => {
    _getPerimeterAccesses()
  }, [debouncedSearchTerm, page, order, includeParentPerimeters, includeChildPerimeters])

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center">
        {loadingPage ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={10}>
            <Typography variant="h1" align="center" className={classes.title}>
              Périmètre {perimeterInfos?.care_site_source_value ? `${perimeterInfos?.care_site_source_value} - ` : ''}
              {perimeterInfos?.care_site_name ?? 'Inconnu'}
            </Typography>

            <Grid container justifyContent="space-between">
              {perimeterData.map((data, index: number) => (
                <Card key={index} sx={{ minWidth: 275, boxShadow: 0, borderRadius: 2 }}>
                  <CardContent style={{ paddingBottom: 16 }}>
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: '#1069A1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Open Sans', sans-serif",
                        textTransform: 'uppercase',
                        height: 25
                      }}
                      variant="h1"
                      gutterBottom
                    >
                      {data.title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#9FDDE8' }} textAlign={'center'}>
                      {data.number}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid
              container
              justifyContent={userCanReadAccessFromOtherLevels ? 'space-between' : 'flex-end'}
              className={classes.searchBar}
            >
              {userCanReadAccessFromOtherLevels && (
                <Grid display={'flex'}>
                  {userRights.right_read_accesses_above_levels && (
                    <Grid display="flex" alignItems="center">
                      <Typography variant="h3">Afficher les accès sur les périmètres parents</Typography>
                      <Switch
                        checked={includeParentPerimeters}
                        onChange={() => setIncludeParentPerimeters(!includeParentPerimeters)}
                      />
                    </Grid>
                  )}
                  {(userRights.right_manage_data_accesses_inferior_levels ||
                    userRights.right_manage_admin_accesses_inferior_levels) && (
                    <Grid display="flex" alignItems="center">
                      <Typography variant="h3">Afficher les accès sur les périmètres inférieurs</Typography>
                      <Switch
                        checked={includeChildPerimeters}
                        onChange={() => setIncludeChildPerimeters(!includeChildPerimeters)}
                      />
                    </Grid>
                  )}
                </Grid>
              )}
              <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
            </Grid>
            <AccessesTable
              displayName
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
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default PerimeterHistory
