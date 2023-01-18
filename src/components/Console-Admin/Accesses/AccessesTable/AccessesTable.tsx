import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core'

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
import { Access, Column, Order, Role, ScopeTreeRow, UserRole } from 'types'
import moment from 'moment'
import { onDeleteOrTerminateAccess } from 'services/Console-Admin/providersHistoryService'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'

type AccessesTableProps = {
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
  roles?: Role[]
}

const AccessesTable: React.FC<AccessesTableProps> = ({
  displayName,
  loading,
  page,
  setPage,
  total,
  accesses,
  getAccesses,
  order,
  setOrder,
  userRights,
  roles
}) => {
  const classes = useStyles()
  const history = useHistory()

  const [selectedAccess, setSelectedAccess] = useState<(Access & { perimeter?: null | ScopeTreeRow }) | null>(null)
  const [deleteAccess, setDeleteAccess] = useState<Access | null>(null)
  const [editAccessSuccess, setEditAccessSuccess] = useState(false)
  const [editAccessFail, setEditAccessFail] = useState(false)
  const [deleteAccessSuccess, setDeleteAccessSuccess] = useState(false)
  const [deleteAccessFail, setDeleteAccessFail] = useState(false)
  const [terminateAccess, setTerminateAccess] = useState(false)
  const [loadingOnConfirm, setLoadingOnConfirm] = useState(false)

  const columns: Column[] = [
    ...(displayName
      ? ([
          {
            label: 'Nom',
            align: 'left'
          },
          {
            label: 'Périmètre parent',
            code: 'care_site_name',
            align: 'center',
            sortableColumn: true
          }
        ] as Column[])
      : ([
          {
            label: 'Périmètre',
            code: 'care_site_name',
            align: 'left',
            sortableColumn: true
          }
        ] as Column[])),
    {
      label: 'Habilitation',
      code: 'role_name',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Date de début',
      code: 'start_datetime',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Date de fin',
      code: 'end_datetime',
      align: 'center',
      sortableColumn: true
    },
    {
      label: 'Actif',
      code: 'is_valid',
      align: 'center',
      sortableColumn: true
    }
  ]

  const manageAccessesUserRights =
    userRights.right_manage_admin_accesses_same_level ||
    userRights.right_manage_admin_accesses_inferior_levels ||
    userRights.right_manage_data_accesses_same_level ||
    userRights.right_manage_data_accesses_inferior_levels ||
    userRights.right_manage_review_transfer_jupyter ||
    userRights.right_manage_transfer_jupyter ||
    userRights.right_manage_export_csv ||
    userRights.right_manage_env_unix_users

  const _columns =
    manageAccessesUserRights || userRights.right_read_logs
      ? [...columns, { label: 'Actions', align: 'center' } as Column]
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

  const onClose = () => {
    setSelectedAccess(null)
    getAccesses()
  }

  return (
    <Grid container justify="flex-end">
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
        ) : accesses && accesses.length > 0 ? (
          accesses.map((access: Access) => {
            return (
              <TableRow key={access.id} className={classes.tableBodyRows}>
                {displayName && (
                  <TableCell align="left">
                    {access.provider_history.lastname?.toLocaleUpperCase()} {access.provider_history.firstname}
                    <IconButton
                      onClick={() =>
                        history.push(`/console-admin/user-profile/${access.provider_history.provider_source_value}`)
                      }
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell align={'left'}>
                  {access.perimeter?.names?.source_value} - {access.perimeter?.names?.name}
                </TableCell>
                <TableCell align="center">
                  <div className={classes.roleColumn}>
                    {access?.role?.name}
                    {roles && (
                      <Tooltip
                        classes={{ tooltip: classes.tooltip }}
                        // @ts-ignore
                        title={roles
                          .find((role: Role) => role.role_id === access.role?.id)
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
                {(manageAccessesUserRights || userRights.right_read_logs) && (
                  <TableCell align="center">
                    <Grid container item alignContent="center" justify="space-between" wrap="nowrap">
                      {manageAccessesUserRights && (
                        <>
                          <Grid item xs={userRights.right_read_logs ? 4 : 6}>
                            {(access.actual_start_datetime || access.actual_end_datetime) && (
                              <Tooltip title="Éditer l'accès">
                                <IconButton
                                  onClick={() => {
                                    setSelectedAccess(access as Access & { perimeter?: null | ScopeTreeRow })
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
      </DataTable>

      {selectedAccess && (
        <AccessForm
          open
          onClose={onClose}
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
            {deleteAccess?.perimeter?.names?.name} ?
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
        <CommonSnackbar
          onClose={() => {
            if (editAccessSuccess) setEditAccessSuccess(false)
            if (deleteAccessSuccess) setDeleteAccessSuccess(false)
          }}
          severity="success"
          message={
            editAccessSuccess
              ? "Les dates d'accès ont bien été éditées."
              : deleteAccessSuccess
              ? `L'accès a bien été ${terminateAccess ? 'clôturé' : 'supprimé'}.`
              : ''
          }
        />
      )}
      {(editAccessFail || deleteAccessFail) && (
        <CommonSnackbar
          onClose={() => {
            if (editAccessFail) setEditAccessFail(false)
            if (deleteAccessFail) setDeleteAccessFail(false)
          }}
          severity="error"
          message={
            editAccessFail
              ? "Erreur lors de l'édition de l'accès"
              : deleteAccessFail
              ? `Erreur lors de la ${terminateAccess ? 'clôture' : 'suppression'} de l'accès.`
              : ''
          }
        />
      )}
    </Grid>
  )
}

export default AccessesTable
