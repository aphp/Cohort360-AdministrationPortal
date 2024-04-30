import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Button, CircularProgress, Grid, IconButton, TableCell, TableRow, Typography, Tooltip } from '@mui/material'

import AssignmentIcon from '@mui/icons-material/Assignment'
import EditIcon from '@mui/icons-material/Edit'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VisibilityIcon from '@mui/icons-material/Visibility'

import UserForm from '../UserForm/UserForm'
import SearchBar from '../../../SearchBar/SearchBar'

import useStyles from './styles'
import { Column, Order, User, UserRole } from 'types'
import { useAppSelector } from 'state'
import { fetchUsers, setSelectedUser } from 'state/users'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'

type UsersTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'lastname', orderDirection: 'asc' } as Order

const UsersTable: React.FC<UsersTableProps> = ({ userRights }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    users: { loading, usersList, total, selectedUser }
  } = useAppSelector((state) => ({ users: state.users }))
  const columns: Column[] = [
    {
      label: 'Identifiant APH',
      code: 'username',
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
    userRights.right_read_data_accesses_inferior_levels ||
    userRights.right_manage_export_csv_accesses ||
    userRights.right_manage_export_jupyter_accesses

  const actionsUserRights = readAccessesUserRights || userRights.right_manage_users || userRights.right_read_logs

  const _columns = actionsUserRights ? [...columns, { label: 'Actions', align: 'center' } as Column] : [...columns]

  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')
  const [openUserForm, setOpenUserForm] = useState(false)

  const [addUserSuccess, setAddUserSuccess] = useState(false)
  const [addUserFail, setAddUserFail] = useState(false)
  const [editUserSuccess, setEditUserSuccess] = useState(false)
  const [editUserFail, setEditUserFail] = useState(false)

  const debouncedSearchTerm = useDebounce(500, searchInput)
  const rowsPerPage = 20

  useEffect(() => {
    setPage(1)
    getData(1)
  }, [debouncedSearchTerm, order])

  useEffect(() => {
    if (addUserSuccess || editUserSuccess) {
      setPage(1)
      getData(1)
    }
  }, [addUserSuccess, editUserSuccess])

  const getData = async (_page: number) => {
    try {
      if (loading) return

      dispatch<any>(fetchUsers({ page: _page, searchInput, order }))
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error)
    }
  }

  const onChangePage = (value: number) => {
    setPage(value)
    getData(value)
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid
        container
        item
        justifyContent={userRights.right_manage_users ? 'space-between' : 'flex-end'}
        style={{ margin: '12px 0' }}
      >
        {userRights.right_manage_users && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<PersonAddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setOpenUserForm(true)}
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
        onChangePage={onChangePage}
        rowsPerPage={rowsPerPage}
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
        ) : !usersList || usersList?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
          usersList.map((user: User) => {
            return (
              user && (
                <TableRow
                  key={user.username}
                  className={classes.tableBodyRows}
                  hover
                  onClick={() => {
                    if (readAccessesUserRights) {
                      navigate(`/console-admin/user-profile/${user.username}`)
                    }
                  }}
                >
                  <TableCell align="center">
                    <Typography onClick={(event) => event.stopPropagation()}>{user.username}</Typography>
                  </TableCell>
                  <TableCell align="center">{user.lastname?.toLocaleUpperCase()}</TableCell>
                  <TableCell align="center">{user.firstname}</TableCell>
                  <TableCell align="center">{user.email ?? '-'}</TableCell>
                  {actionsUserRights && (
                    <TableCell align="center">
                      {readAccessesUserRights && (
                        <Tooltip title="Visualiser les accès de l'utilisateur" style={{ padding: '0 12px' }}>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate(`/console-admin/user-profile/${user.username}`)
                            }}
                            size="large"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {userRights.right_manage_users && (
                        <Tooltip title="Éditer l'utilisateur" style={{ padding: '0 12px' }}>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              dispatch(setSelectedUser(user))
                              setOpenUserForm(true)
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
                                search: `?user=${user.username}`
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

      {openUserForm && (
        <UserForm
          open
          onClose={() => {
            setOpenUserForm(false)
            dispatch(setSelectedUser({ username: '' }))
          }}
          selectedUser={selectedUser}
          onAddUserSuccess={setAddUserSuccess}
          onEditUserSuccess={setEditUserSuccess}
          onAddUserFail={setAddUserFail}
          onEditUserFail={setEditUserFail}
        />
      )}

      {(addUserSuccess || editUserSuccess) && (
        <CommonSnackbar
          severity="success"
          onClose={() => {
            if (addUserSuccess) setAddUserSuccess(false)
            if (editUserSuccess) setEditUserSuccess(false)
          }}
          message={`L'utilisateur a bien été ${addUserSuccess ? 'créé' : ''}${editUserSuccess ? 'édité' : ''}.`}
        />
      )}
      {(addUserFail || editUserFail) && (
        <CommonSnackbar
          severity="error"
          onClose={() => {
            if (addUserFail) setAddUserFail(false)
            if (editUserFail) setEditUserFail(false)
          }}
          message={`Erreur lors de ${addUserFail ? 'la création' : ''}${
            editUserFail ? "l'édition" : ''
          } de l'utilisateur.`}
        />
      )}
    </Grid>
  )
}

export default UsersTable
