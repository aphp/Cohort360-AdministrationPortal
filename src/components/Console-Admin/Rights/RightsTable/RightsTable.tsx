import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import AssignmentIcon from '@material-ui/icons/Assignment'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import InfoIcon from '@material-ui/icons/Info'
import LaunchIcon from '@material-ui/icons/Launch'
import TimerOffIcon from '@material-ui/icons/TimerOff'

import useStyles from './styles'
import AccessForm from '../AccessForm/AccessForm'
import { Access, Order, Role, UserRole } from 'types'
import { Alert } from '@material-ui/lab'
import moment from 'moment'
import { getRoles } from 'services/Console-Admin/rolesService'
import { onDeleteOrTerminateAccess } from 'services/Console-Admin/providersHistoryService'

type RightsTableProps = {
  displayName: boolean
  loading: boolean
  page: number
  setPage: (page: number) => void
  total: number
  accesses: Access[] | undefined
  getAccesses: () => void
  order: Order
  setOrder: (order: Order) => void
  userRights: UserRole
}

const RightsTable: React.FC<RightsTableProps> = ({
  displayName,
  loading,
  page,
  setPage,
  total,
  accesses,
  getAccesses,
  order,
  setOrder,
  userRights
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [selectedAccess, setSelectedAccess] = useState<Access | null>(null)
  const [roles, setRoles] = useState<Role[] | undefined>()
  const [deleteAccess, setDeleteAccess] = useState<Access | null>(null)
  const [editAccessSuccess, setEditAccessSuccess] = useState(false)
  const [editAccessFail, setEditAccessFail] = useState(false)
  const [deleteAccessSuccess, setDeleteAccessSuccess] = useState(false)
  const [deleteAccessFail, setDeleteAccessFail] = useState(false)
  const [terminateAccess, setTerminateAccess] = useState(false)
  const [loadingOnConfirm, setLoadingOnConfirm] = useState(false)

  const rowsPerPage = 100

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
    if (editAccessSuccess) getAccesses()
    if (deleteAccessSuccess) getAccesses()
  }, [editAccessSuccess, deleteAccessSuccess]) // eslint-disable-line

  const columns = displayName
    ? [
        {
          label: 'Nom'
        },
        {
          label: 'Périmètre parent',
          code: 'care_site_name'
        },
        {
          label: 'Habilitation',
          code: 'role_name'
        },
        {
          label: 'Date de début',
          code: 'start_datetime'
        },
        {
          label: 'Date de fin',
          code: 'end_datetime'
        },
        {
          label: 'Actif',
          code: 'is_valid'
        }
      ]
    : [
        {
          label: 'Périmètre',
          code: 'care_site_name'
        },
        {
          label: 'Habilitation',
          code: 'role_name'
        },
        {
          label: 'Date de début',
          code: 'start_datetime'
        },
        {
          label: 'Date de fin',
          code: 'end_datetime'
        },
        {
          label: 'Actif',
          code: 'is_valid'
        }
      ]

  const _columns =
    userRights.right_manage_admin_accesses_same_level ||
    userRights.right_manage_admin_accesses_inferior_levels ||
    userRights.right_manage_data_accesses_same_level ||
    userRights.right_manage_data_accesses_inferior_levels ||
    userRights.right_read_logs
      ? [...columns, { label: 'Actions' }]
      : [...columns]

  const handleDeleteAction = async () => {
    try {
      setLoadingOnConfirm(true)
      const terminateAccessResp = await onDeleteOrTerminateAccess(terminateAccess, deleteAccess?.care_site_history_id)

      if (terminateAccessResp) {
        setDeleteAccessSuccess(true)
      } else {
        setDeleteAccessFail(true)
      }

      setLoadingOnConfirm(false)
      getAccesses()
      setDeleteAccess(null)
    } catch (error) {
      console.error("Erreur lors de la suppression ou la clôture de l'accès", error)
      setLoadingOnConfirm(false)
      setDeleteAccessFail(true)
      setDeleteAccess(null)
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
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {_columns.map((column, index) => (
                <TableCell
                  key={index}
                  sortDirection={order.orderBy === column.code ? order.orderDirection : false}
                  align={
                    displayName
                      ? column.label === 'Nom' || column.label === 'Périmètre'
                        ? 'left'
                        : 'center'
                      : 'center'
                  }
                  className={classes.tableHeadCell}
                >
                  {column.label !== 'Actions' && column.label !== 'Nom' ? (
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
            ) : accesses && accesses.length > 0 ? (
              accesses.map((access: Access) => {
                return (
                  <TableRow key={access.id} className={classes.tableBodyRows}>
                    {displayName && (
                      <TableCell align="left">
                        {access.provider_history.lastname} {access.provider_history.firstname}
                        <IconButton
                          onClick={() => history.push(`/user-profile/${access.provider_history.provider_id}`)}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell align={'left'}>
                      {access.care_site.care_site_source_value} - {access.care_site.care_site_name}
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.roleColumn}>
                        {access?.role?.name}
                        {roles && (
                          <Tooltip
                            classes={{ tooltip: classes.tooltip }}
                            // @ts-ignore
                            title={roles
                              .find((role: Role) => role.role_id === access.role_id)
                              ?.help_text.map((text, index: number) => (
                                <Typography key={index}>- {text}</Typography>
                              ))}
                          >
                            <InfoIcon color="action" fontSize="small" className={classes.infoIcon} />
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {access.actual_start_datetime ? moment(access.actual_start_datetime).format('DD/MM/YYYY') : '-'}
                    </TableCell>
                    <TableCell align="center">
                      {access.actual_end_datetime ? moment(access.actual_end_datetime).format('DD/MM/YYYY') : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={access.is_valid ? 'Accès actif' : 'Accès inactif'}>
                        {access.is_valid ? (
                          <CheckCircleIcon style={{ color: '#BDEA88' }} />
                        ) : (
                          <CancelIcon style={{ color: '#ED6D91' }} />
                        )}
                      </Tooltip>
                    </TableCell>
                    {(userRights.right_manage_admin_accesses_same_level ||
                      userRights.right_manage_admin_accesses_inferior_levels ||
                      userRights.right_manage_data_accesses_same_level ||
                      userRights.right_manage_data_accesses_inferior_levels ||
                      userRights.right_read_logs) && (
                      <TableCell align="center">
                        <Grid container item alignContent="center" justify="space-between">
                          {(userRights.right_manage_admin_accesses_same_level ||
                            userRights.right_manage_admin_accesses_inferior_levels ||
                            userRights.right_manage_data_accesses_same_level ||
                            userRights.right_manage_data_accesses_inferior_levels) && (
                            <>
                              <Grid item xs={userRights.right_read_logs ? 4 : 6}>
                                {(access.actual_start_datetime || access.actual_end_datetime) && (
                                  <Tooltip title="Éditer l'accès">
                                    <IconButton
                                      onClick={() => {
                                        setSelectedAccess(access)
                                      }}
                                      style={{ padding: '4px 12px' }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Grid>
                              <Grid item xs={userRights.right_read_logs ? 4 : 6}>
                                {access.actual_start_datetime &&
                                  moment(access.actual_start_datetime).isSameOrBefore(moment(), 'day') &&
                                  access.is_valid && (
                                    <Tooltip title="Clôturer l'accès">
                                      <IconButton
                                        onClick={() => {
                                          setDeleteAccess(access)
                                          setTerminateAccess(true)
                                        }}
                                        style={{ padding: '4px 12px' }}
                                      >
                                        <TimerOffIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                {access.actual_start_datetime &&
                                  moment(access.actual_start_datetime).isAfter(moment(), 'day') && (
                                    <Tooltip title="Supprimer l'accès">
                                      <IconButton
                                        onClick={() => {
                                          setDeleteAccess(access)
                                          setTerminateAccess(false)
                                        }}
                                        style={{ padding: '4px 12px' }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                              </Grid>
                            </>
                          )}
                          {userRights.right_read_logs && (
                            <Grid item xs={4}>
                              <Tooltip title="Voir les logs de l'accès">
                                <IconButton
                                  onClick={() => {
                                    history.push({
                                      pathname: '/console-admin/logs',
                                      search: `?access=${access.care_site_history_id}`
                                    })
                                  }}
                                  style={{ padding: '4px 12px' }}
                                >
                                  <AssignmentIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          )}
                        </Grid>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        className={classes.pagination}
        count={Math.ceil(total / rowsPerPage)}
        shape="rounded"
        onChange={(event, page: number) => setPage(page)}
        page={page}
      />

      {selectedAccess && (
        <AccessForm
          open
          onClose={() => setSelectedAccess(null)}
          access={selectedAccess}
          onSuccess={setEditAccessSuccess}
          onFail={setEditAccessFail}
          userRights={userRights}
        />
      )}

      <Dialog open={deleteAccess ? true : false} onClose={() => setDeleteAccess(null)}>
        <DialogContent>
          <Typography>
            Êtes-vous sûr(e) de vouloir {terminateAccess ? 'clôturer' : 'supprimer'} cet accès sur le périmètre{' '}
            {deleteAccess?.care_site.care_site_name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccess(null)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteAction} disabled={loading}>
            {loadingOnConfirm ? <CircularProgress /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {(editAccessSuccess || deleteAccessSuccess) && (
        <Snackbar
          open
          onClose={() => {
            if (editAccessSuccess) setEditAccessSuccess(false)
            if (deleteAccessSuccess) setDeleteAccessSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (editAccessSuccess) setEditAccessSuccess(false)
              if (deleteAccessSuccess) setDeleteAccessSuccess(false)
            }}
          >
            {editAccessSuccess && "Les dates d'accès ont bien été éditées."}
            {deleteAccessSuccess && `L'accès a bien été ${terminateAccess ? 'clôturé' : 'supprimé'}.`}
          </Alert>
        </Snackbar>
      )}
      {(editAccessFail || deleteAccessFail) && (
        <Snackbar
          open
          onClose={() => {
            if (editAccessFail) setEditAccessFail(false)
            if (deleteAccessFail) setDeleteAccessFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (editAccessFail) setEditAccessFail(false)
              if (deleteAccessFail) setDeleteAccessFail(false)
            }}
          >
            {editAccessFail && "Erreur lors de l'édition de l'accès."}
            {deleteAccessFail && `Erreur lors de la ${terminateAccess ? 'clôture' : 'suppression'} de l'accès.`}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default RightsTable
