import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Button, CircularProgress, Grid, IconButton, TableCell, TableRow, Typography, Tooltip } from '@mui/material'

import AssignmentIcon from '@mui/icons-material/Assignment'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VisibilityIcon from '@mui/icons-material/Visibility'

import ProviderForm from '../ProviderForm/ProviderForm'
import SearchBar from '../../../SearchBar/SearchBar'

import useStyles from './styles'
import { Column, Order, Provider, UserRole } from 'types'
import { useAppSelector } from 'state'
import { fetchProviders, setSelectedProvider } from 'state/providers'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'

type ProvidersTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const ProvidersTable: React.FC<ProvidersTableProps> = ({ userRights }) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    providers: { loading, providersList, total, selectedProvider }
  } = useAppSelector((state) => ({ providers: state.providers }))
  const columns: Column[] = [
    {
      label: 'Identifiant APH',
      code: 'provider_source_value',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Nom',
      code: 'lastname',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Prénom',
      code: 'firstname',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Email',
      code: 'email',
      align: 'center',
      sortableColumn: true
    }
  ]

  const readAccessesUserRights =
    userRights.right_read_admin_accesses_same_level ||
    userRights.right_read_admin_accesses_inferior_levels ||
    userRights.right_read_data_accesses_same_level ||
    userRights.right_read_data_accesses_inferior_levels

  const actionsUserRights = readAccessesUserRights || userRights.right_edit_users || userRights.right_read_logs

  const _columns = actionsUserRights ? [...columns, { label: 'Actions', align: 'center' } as Column] : [...columns]

  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')

  const [addProviderSuccess, setAddProviderSuccess] = useState(false)
  const [addProviderFail, setAddProviderFail] = useState(false)
  const [editProviderSuccess, setEditProviderSuccess] = useState(false)
  const [editProviderFail, setEditProviderFail] = useState(false)

  const debouncedSearchTerm = useDebounce(500, searchInput)

  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    } else {
      getData()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    getData()
  }, [order, page]) // eslint-disable-line

  useEffect(() => {
    if (addProviderSuccess || editProviderSuccess) getData()
  }, [addProviderSuccess, editProviderSuccess])

  const getData = async () => {
    try {
      if (loading) return

      dispatch<any>(fetchProviders({ page, searchInput, order }))
    } catch (error) {
      console.error('Erreur lors de la récupération des providers', error)
    }
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid
        container
        item
        justifyContent={userRights.right_add_users ? 'space-between' : 'flex-end'}
        style={{ margin: '12px 0' }}
      >
        {userRights.right_add_users && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<PersonAddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => dispatch(setSelectedProvider({}))}
          >
            Nouvel utilisateur
          </Button>
        )}
        <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
        </Grid>
      </Grid>

      <DataTable
        columns={_columns}
        order={order}
        setOrder={setOrder}
        page={page}
        setPage={setPage}
        rowsPerPage={100}
        total={total}
      >
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <div className={classes.loadingSpinnerContainer}>
                <CircularProgress size={50} />
              </div>
            </TableCell>
          </TableRow>
        ) : !providersList || providersList?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
          providersList.map((provider: Provider) => {
            return (
              provider && (
                <TableRow
                  key={provider.provider_id}
                  className={classes.tableBodyRows}
                  hover
                  onClick={() => {
                    if (readAccessesUserRights) {
                      navigate(`/console-admin/user-profile/${provider.provider_source_value}`)
                    }
                  }}
                >
                  <TableCell align="center">
                    <Typography onClick={(event) => event.stopPropagation()}>
                      {provider.provider_source_value}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{provider.lastname?.toLocaleUpperCase()}</TableCell>
                  <TableCell align="center">{provider.firstname}</TableCell>
                  <TableCell align="center">{provider.email ?? '-'}</TableCell>
                  {actionsUserRights && (
                    <TableCell align="center">
                      {readAccessesUserRights && (
                        <Tooltip title="Visualiser les accès de l'utilisateur" style={{ padding: '0 12px' }}>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate(`/console-admin/user-profile/${provider.provider_source_value}`)
                            }}
                            size="large"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {userRights.right_edit_users && (
                        <Tooltip title="Éditer l'utilisateur" style={{ padding: '0 12px' }}>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              dispatch(setSelectedProvider(provider))
                            }}
                            size="large"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {userRights.right_read_logs && (
                        <Tooltip title="Voir les logs de l'utilisateur" style={{ padding: '0 12px' }}>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate({
                                pathname: '/console-admin/logs',
                                search: `?user=${provider.provider_source_value}`
                              })
                            }}
                            size="large"
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedProvider !== null && (
        <ProviderForm
          open
          onClose={() => dispatch(setSelectedProvider(null))}
          selectedProvider={selectedProvider}
          onAddProviderSuccess={setAddProviderSuccess}
          onEditProviderSuccess={setEditProviderSuccess}
          onAddProviderFail={setAddProviderFail}
          onEditProviderFail={setEditProviderSuccess}
        />
      )}

      {(addProviderSuccess || editProviderSuccess) && (
        <CommonSnackbar
          severity="success"
          onClose={() => {
            if (addProviderSuccess) setAddProviderSuccess(false)
            if (editProviderSuccess) setEditProviderSuccess(false)
          }}
          message={`L'utilisateur a bien été ${addProviderSuccess && 'créé'}${editProviderSuccess && 'édité'}.`}
        />
      )}
      {(addProviderFail || editProviderFail) && (
        <CommonSnackbar
          severity="error"
          onClose={() => {
            if (addProviderFail) setAddProviderFail(false)
            if (editProviderFail) setEditProviderFail(false)
          }}
          message={`Erreur lors de ${addProviderFail && 'la création'}${
            editProviderFail && "l'édition"
          } de l'utilisateur.`}
        />
      )}
    </Grid>
  )
}

export default ProvidersTable
