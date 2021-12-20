import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Tooltip,
  Snackbar
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import Pagination from '@material-ui/lab/Pagination'

import AssignmentIcon from '@material-ui/icons/Assignment'
import EditIcon from '@material-ui/icons/Edit'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import VisibilityIcon from '@material-ui/icons/Visibility'

import ProviderDialog from '../ProviderForm/ProviderForm'
import SearchBar from '../../../SearchBar/SearchBar'

import useStyles from './styles'
import { Order, Provider, UserRole } from 'types'
import { useAppSelector } from 'state'
import { fetchProviders, setSelectedProvider } from 'state/providers'

type ProvidersTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const ProvidersTable: React.FC<ProvidersTableProps> = ({ userRights }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    providers: { loading, providersList, total, selectedProvider }
  } = useAppSelector((state) => ({ providers: state.providers }))
  const columns =
    !userRights.right_read_admin_accesses_same_level &&
    !userRights.right_read_admin_accesses_inferior_levels &&
    !userRights.right_read_data_accesses_same_level &&
    !userRights.right_read_data_accesses_inferior_levels &&
    !userRights.right_edit_users &&
    !userRights.right_read_logs
      ? [
          {
            label: 'Identifiant APH',
            code: 'provider_source_value'
          },
          {
            label: 'Nom',
            code: 'lastname'
          },
          {
            label: 'Prénom',
            code: 'firstname'
          },
          {
            label: 'Email',
            code: 'email'
          }
        ]
      : [
          {
            label: 'Identifiant APH',
            code: 'provider_source_value'
          },
          {
            label: 'Nom',
            code: 'lastname'
          },
          {
            label: 'Prénom',
            code: 'firstname'
          },
          {
            label: 'Email',
            code: 'email'
          },
          {
            label: 'Actions'
          }
        ]

  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')

  const [addProviderSuccess, setAddProviderSuccess] = useState(false)
  const [addProviderFail, setAddProviderFail] = useState(false)
  const [editProviderSuccess, setEditProviderSuccess] = useState(false)
  const [editProviderFail, setEditProviderFail] = useState(false)

  useEffect(() => {
    setPage(1)
    getData()
  }, [searchInput])

  useEffect(() => {
    getData()
  }, [order, page]) // eslint-disable-line

  const getData = async () => {
    try {
      if (loading) return

      dispatch(fetchProviders({ page, searchInput, order }))
    } catch (error) {
      console.error('Erreur lors de la récupération des providers', error)
    }
  }

  const createSortHandler = (property: any) => () => {
    const isAsc: boolean = order.orderBy === property && order.orderDirection === 'asc'
    const _orderDirection = isAsc ? 'desc' : 'asc'

    setOrder({
      orderBy: property,
      orderDirection: _orderDirection
    })
  }

  return (
    <Grid container justify="flex-end">
      <Grid
        container
        item
        justify={userRights.right_add_users ? 'space-between' : 'flex-end'}
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
        <Grid container item xs={6} justify="flex-end" alignItems="center">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column, index: number) => (
                <TableCell
                  key={index}
                  sortDirection={order.orderBy === column.code ? order.orderDirection : false}
                  align="center"
                  className={classes.tableHeadCell}
                >
                  {column.label !== 'Actions' ? (
                    <TableSortLabel
                      active={order.orderBy === column.code}
                      direction={order.orderBy === column.code ? order.orderDirection : 'asc'}
                      onClick={createSortHandler(column.code)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className={classes.loadingSpinnerContainer}>
                    <CircularProgress size={50} />
                  </div>
                </TableCell>
              </TableRow>
            ) : providersList && providersList.length === 0 ? (
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
                        if (
                          userRights.right_read_admin_accesses_same_level ||
                          userRights.right_read_admin_accesses_inferior_levels ||
                          userRights.right_read_data_accesses_same_level ||
                          userRights.right_read_data_accesses_inferior_levels
                        ) {
                          history.push(`/console-admin/user-profile/${provider.provider_id}`)
                        }
                      }}
                    >
                      <TableCell align="center">{provider.provider_source_value}</TableCell>
                      <TableCell align="center">{provider.lastname}</TableCell>
                      <TableCell align="center">{provider.firstname}</TableCell>
                      <TableCell align="center">{provider.email ?? '-'}</TableCell>
                      {(userRights.right_read_admin_accesses_same_level ||
                        userRights.right_read_admin_accesses_inferior_levels ||
                        userRights.right_read_data_accesses_same_level ||
                        userRights.right_read_data_accesses_inferior_levels ||
                        userRights.right_edit_users ||
                        userRights.right_read_logs) && (
                        <TableCell align="center">
                          {(userRights.right_read_admin_accesses_same_level ||
                            userRights.right_read_admin_accesses_inferior_levels ||
                            userRights.right_read_data_accesses_same_level ||
                            userRights.right_read_data_accesses_inferior_levels) && (
                            <Tooltip title="Visualiser les accès de l'utilisateur" style={{ padding: '0 12px' }}>
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation()
                                  history.push(`/console-admin/user-profile/${provider.provider_id}`)
                                }}
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
                                  history.push({
                                    pathname: '/console-admin/logs',
                                    search: `?user=${provider.provider_source_value}`
                                  })
                                }}
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
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        className={classes.pagination}
        count={Math.ceil(total / 100)}
        shape="rounded"
        onChange={(event, page: number) => setPage(page)}
        page={page}
      />

      {selectedProvider !== null && (
        <ProviderDialog
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
        <Snackbar
          open
          onClose={() => {
            if (addProviderSuccess) setAddProviderSuccess(false)
            if (editProviderSuccess) setEditProviderSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (addProviderSuccess) setAddProviderSuccess(false)
              if (editProviderSuccess) setEditProviderSuccess(false)
            }}
          >
            {addProviderSuccess && "L'utilisateur a bien été créé."}
            {editProviderSuccess && "L'utilisateur a bien été édité."}
          </Alert>
        </Snackbar>
      )}
      {(addProviderFail || editProviderFail) && (
        <Snackbar
          open
          onClose={() => {
            if (addProviderFail) setAddProviderFail(false)
            if (editProviderFail) setEditProviderFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (addProviderFail) setAddProviderFail(false)
              if (editProviderFail) setEditProviderFail(false)
            }}
          >
            {addProviderFail && "Erreur lors de la création de l'utilisateur."}
            {editProviderFail && "Erreur lors de l'édition de l'utilisateur."}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default ProvidersTable
