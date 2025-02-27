import React, { useEffect, useState } from 'react'

import {
  Button,
  Chip,
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
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import useStyles from './styles'
import { Column, Order, UserRole } from 'types'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'
import MaintenanceDialog from './MaintenanceDialog'
import {
  MaintenancePhase,
  MaintenancePhaseCreation,
  deleteMaintenancePhase,
  listMaintenancePhases
} from 'services/Console-Admin/maintenanceService'

type MaintenanceTableProps = {
  userRights: UserRole
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ userRights }) => {
  const { classes } = useStyles()
  const [order, setOrder] = useState<Order>({
    orderBy: 'start_datetime', // Default sort column
    orderDirection: 'desc' // Default sort direction
  })

  const columns: Column[] = [
    {
      code: 'start_datetime',
      label: 'Date de début',
      sortableColumn: true,
      align: 'left'
    },
    {
      code: 'end_datetime',
      label: 'Date de fin',
      sortableColumn: true,
      align: 'left'
    },
    {
      label: 'Type',
      align: 'left'
    },
    {
      label: 'Statut',
      align: 'left'
    },
    {
      label: 'Titre',
      align: 'left'
    }
  ]

  if (userRights.right_full_admin || userRights.right_read_users) {
    columns.push({
      label: 'Actions',
      align: 'right'
    })
  }

  const [loading, setLoading] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenancePhaseCreation | MaintenancePhase | null>(
    null
  )
  const [maintenances, setMaintenances] = useState<MaintenancePhase[] | null>(null)
  const [deleteMaintenanceItem, setDeleteMaintenanceItem] = useState<MaintenancePhase | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [addMaintenanceSuccess, setAddMaintenanceSuccess] = useState(false)
  const [addMaintenanceFail, setAddMaintenanceFail] = useState(false)
  const [editMaintenanceSuccess, setEditMaintenanceSuccess] = useState(false)
  const [editMaintenanceFail, setEditMaintenanceFail] = useState(false)
  const [deleteMaintenanceSuccess, setDeleteMaintenanceSuccess] = useState(false)
  const [deleteMaintenanceFail, setDeleteMaintenanceFail] = useState(false)

  useEffect(() => {
    getMaintenances()
  }, [page, order])
  useEffect(() => {
    if (addMaintenanceSuccess) getMaintenances()
    if (editMaintenanceSuccess) getMaintenances()
    if (deleteMaintenanceSuccess) getMaintenances()
  }, [addMaintenanceSuccess, editMaintenanceSuccess, deleteMaintenanceSuccess])

  const getMaintenances = async () => {
    try {
      setLoading(true)
      const response = await listMaintenancePhases(page, 20, order)
      setMaintenances(response.results)
      setTotal(response.total)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des phases de maintenance', error)
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleDeleteMaintenance = async () => {
    try {
      if (!deleteMaintenanceItem) return
      const deleteResponse = await deleteMaintenancePhase(deleteMaintenanceItem.id)

      if (deleteResponse) {
        setDeleteMaintenanceSuccess(true)
      } else {
        setDeleteMaintenanceFail(true)
      }
      setDeleteMaintenanceItem(null)
    } catch (error) {
      console.error('Erreur lors de la suppression de la phase de maintenance', error)
      setDeleteMaintenanceFail(true)
      setDeleteMaintenanceItem(null)
    }
  }

  const renderStatus = (maintenance: MaintenancePhase) => {
    const now = new Date()
    const startDate = new Date(maintenance.start_datetime)
    const endDate = new Date(maintenance.end_datetime)

    if (now < startDate) {
      // Upcoming maintenance (grey)
      return (
        <Chip
          label="Planifiée"
          color="default"
          size="small"
          sx={{
            backgroundColor: '#E0E0E0',
            fontWeight: 500
          }}
        />
      )
    } else if (now >= startDate && now <= endDate) {
      // Active maintenance (warning color)
      return <Chip label="En cours" color="warning" size="small" sx={{ fontWeight: 500 }} />
    } else {
      // Past maintenance (green)
      return <Chip label="Terminée" color="success" size="small" sx={{ fontWeight: 500 }} />
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR')
  }

  return (
    <Grid container justifyContent="flex-end" className={classes.table}>
      {userRights.right_full_admin && (
        <Grid container justifyContent="flex-end" alignItems="center">
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.buttons}
            onClick={() =>
              setSelectedMaintenance({
                subject: 'Maintenance du ' + new Date().toLocaleDateString(),
                message: '',
                type: 'partial',
                start_datetime: new Date().toISOString(),
                end_datetime: new Date(Date.now() + 3600000).toISOString()
              })
            }
          >
            Nouvelle phase de maintenance
          </Button>
        </Grid>
      )}
      <DataTable
        columns={columns}
        order={order}
        setOrder={setOrder}
        page={page}
        setPage={setPage}
        total={total}
        rowsPerPage={20}
        onChangePage={handlePageChange}
      >
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <div className={classes.loadingSpinnerContainer}>
                <CircularProgress size={50} />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          maintenances &&
          maintenances.map((maintenance: MaintenancePhase) => {
            return (
              maintenance && (
                <TableRow key={maintenance.id} className={classes.tableBodyRows} hover>
                  <TableCell align="left">{formatDate(maintenance.start_datetime)}</TableCell>
                  <TableCell align="left">{formatDate(maintenance.end_datetime)}</TableCell>
                  <TableCell align="left">
                    {maintenance.type === 'partial' ? 'Maintenance' : 'Application indisponible'}
                  </TableCell>
                  <TableCell align="left">{renderStatus(maintenance)}</TableCell>
                  <TableCell align="left">{maintenance.subject}</TableCell>
                  {userRights.right_full_admin && (
                    <TableCell align="right">
                      <Tooltip title="Editer la maintenance">
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedMaintenance(maintenance)
                          }}
                          size="large"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer la maintenance">
                        <IconButton
                          onClick={() => {
                            setDeleteMaintenanceItem(maintenance)
                          }}
                          size="large"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedMaintenance && (
        <MaintenanceDialog
          open
          userRights={userRights}
          selectedMaintenance={selectedMaintenance}
          onClose={() => setSelectedMaintenance(null)}
          onAddMaintenanceSuccess={setAddMaintenanceSuccess}
          onEditMaintenanceSuccess={setEditMaintenanceSuccess}
          onAddMaintenanceFail={setAddMaintenanceFail}
          onEditMaintenanceFail={setEditMaintenanceFail}
        />
      )}

      {deleteMaintenanceItem && (
        <Dialog open onClose={() => setDeleteMaintenanceItem(null)}>
          <DialogContent>
            <Typography>
              Êtes-vous sûr(e) de vouloir supprimer cette maintenance ? Si elle est actuellement en cours, Cohort360
              repassera dans son fonctionnement standard et aucune interruption ni restriction de service n'aura lieu.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteMaintenanceItem(null)} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleDeleteMaintenance}>Confirmer</Button>
          </DialogActions>
        </Dialog>
      )}

      {(addMaintenanceSuccess || editMaintenanceSuccess || deleteMaintenanceSuccess) && (
        <CommonSnackbar
          onClose={() => {
            if (addMaintenanceSuccess) setAddMaintenanceSuccess(false)
            if (editMaintenanceSuccess) setEditMaintenanceSuccess(false)
            if (deleteMaintenanceSuccess) setDeleteMaintenanceSuccess(false)
          }}
          severity="success"
          message={`La phase de maintenance a bien été ${
            (addMaintenanceSuccess && 'créée') ||
            (editMaintenanceSuccess && 'éditée') ||
            (deleteMaintenanceSuccess && 'supprimée')
          }.`}
        />
      )}
      {(addMaintenanceFail || editMaintenanceFail || deleteMaintenanceFail) && (
        <CommonSnackbar
          onClose={() => {
            if (addMaintenanceFail) setAddMaintenanceFail(false)
            if (editMaintenanceFail) setEditMaintenanceFail(false)
            if (deleteMaintenanceFail) setDeleteMaintenanceFail(false)
          }}
          severity="error"
          message={`Erreur lors de ${
            (addMaintenanceFail && 'la création') ||
            (editMaintenanceFail && "l'édition") ||
            (deleteMaintenanceFail && 'la suppression')
          } de la phase de maintenance.`}
        />
      )}
    </Grid>
  )
}

export default MaintenanceTable
