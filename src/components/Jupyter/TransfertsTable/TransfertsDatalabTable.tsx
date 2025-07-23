import React, { useEffect, useState } from 'react'
import moment from 'moment'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  TableCell,
  TableRow,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { ReactComponent as FilterIcon } from 'assets/icones/filter.svg'

import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import AssignmentIcon from '@mui/icons-material/Assignment'

import DataTable from 'components/DataTable/DataTable'
import TransfertDatalabForm from 'components/Jupyter/TransfertForm/TransfertDatalabForm'
import TransfertsFilters from 'components/Jupyter/TransfertsFilters/TransfertsFilters'
import SearchBar from 'components/SearchBar/SearchBar'
import CommonSnackbar from 'components/Snackbar/Snackbar'
import { getDatalabExportsList, getExportLogs, retryExportRequest } from 'services/Jupyter/jupyterExportService'

import { Column, DatalabTransferForm, Export, ExportFilters, Order, UserRole } from 'types'
import useStyles from './styles'
import { extractFilename } from 'utils/download'

type TransfertsDatalabTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'created_at', orderDirection: 'desc' } as Order

const defaultFilters: ExportFilters = {
  exportType: [],
  request_job_status: [],
  insert_datetime_gte: null,
  insert_datetime_lte: null
}

const TransfertsDatalabTable: React.FC<TransfertsDatalabTableProps> = ({ userRights }) => {
  const { classes } = useStyles()

  const [loading, setLoading] = useState(true)
  const [exportsList, setExportsList] = useState<Export[]>([])
  const [selectedTransferRequest, setSelectedTransferRequest] = useState<DatalabTransferForm | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [openFilters, setOpenFilters] = useState(false)
  const [dialogOpen, setOpenDialog] = useState(false)
  const [selectedExport, setSelectedExport] = useState<Export | undefined>()

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const columns: Column[] = [
    {
      label: 'N° de cohorte',
      align: 'center'
    },
    {
      label: 'Nom',
      align: 'center'
    },
    {
      label: 'Nombre de patients',
      align: 'center'
    },
    {
      label: 'Propriétaire',
      align: 'center',
      sortableColumn: true,
      code: 'owner'
    },
    {
      label: "Type d'export",
      align: 'center',
      sortableColumn: true,
      code: 'output_format'
    },
    {
      label: 'Environnement de travail',
      align: 'center'
    },
    { label: 'Nom Jupyter/CSV', align: 'center' },
    {
      label: 'Date de la demande',
      align: 'center',
      sortableColumn: true,
      code: 'created_at'
    },
    {
      label: 'Statut',
      align: 'center'
    }
  ]

  const [addTransferRequestSuccess, setAddTransferRequestSuccess] = useState(false)
  const [addTransferRequestFail, setAddTransferRequestFail] = useState(false)
  const [retryExportFail, setRetryExportFail] = useState(false)
  const [retryExportSuccess, setRetryExportSuccess] = useState(false)
  const [downloadLogsFail, setDownloadLogsFail] = useState<boolean>(false)
  const [downloadLogsFailMessage, setDownloadLogsFailMessage] = useState<string>('')

  const rowsPerPage = 20

  const _getExportsList = async (_page: number) => {
    try {
      setLoading(true)

      const exportsList = await getDatalabExportsList(_page, rowsPerPage, order, filters, debouncedSearchTerm)

      setExportsList(exportsList.list)
      setTotal(exportsList?.total)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      setExportsList([])
      setTotal(0)
      console.error('Erreur lors de la récupération de la liste des exports', error)
    }
  }

  const getExportsChips = (status: Export['request_job_status']) => {
    const chipProps = {
      label: 'Inconnu',
      backgroundColor: '#dc3545',
      color: '#FFF'
    }

    switch (status) {
      case 'finished':
        chipProps['label'] = 'Terminé'
        chipProps['backgroundColor'] = '#28A745'
        break
      case 'validated':
        chipProps['label'] = 'Confirmé'
        chipProps['backgroundColor'] = '#FFC107'
        chipProps['color'] = '#153D8A'
        break
      case 'new':
      case 'pending':
      case 'started':
        chipProps['label'] = 'En cours'
        chipProps['backgroundColor'] = '#FFC107'
        chipProps['color'] = '#153D8A'
        break
      case 'denied':
        chipProps['label'] = 'Refusé'
        break
      case 'cancelled':
        chipProps['label'] = 'Annulé'
        break
      case 'failed':
        chipProps['label'] = 'Erreur'
        break
      default:
        break
    }

    return (
      <Chip
        label={chipProps.label}
        size="small"
        style={{ backgroundColor: chipProps.backgroundColor, color: chipProps.color }}
      />
    )
  }

  const handleDeleteChip = (
    filter: 'exportType' | 'request_job_status' | 'insert_datetime_gte' | 'insert_datetime_lte',
    value?: {} | string | null
  ) => {
    switch (filter) {
      case 'exportType':
        setFilters({ ...filters, [filter]: filters[filter].filter((elem) => elem !== value) })
        break
      case 'request_job_status':
        setFilters({ ...filters, [filter]: filters[filter].filter((elem) => elem !== value) })
        break
      case 'insert_datetime_gte':
      case 'insert_datetime_lte':
        setFilters({ ...filters, [filter]: null })
        break
      default:
        break
    }
  }

  const onChangePage = (value: number) => {
    setPage(value)
    _getExportsList(value)
  }

  useEffect(() => {
    setPage(1)
    _getExportsList(1)
  }, [debouncedSearchTerm, order, filters])

  useEffect(() => {
    if (addTransferRequestSuccess) {
      setPage(1)
      _getExportsList(1)
    }
  }, [addTransferRequestSuccess])

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const retryExport = async (exportRequest: Export) => {
    const retryOk = await retryExportRequest(exportRequest.uuid)
    if (retryOk) {
      setRetryExportSuccess(true)
      _getExportsList(page)
    } else {
      setRetryExportFail(true)
    }
  }

  const downloadLogs = async (exportRequest: Export) => {
    try {
      const logsResponse = await getExportLogs(exportRequest.uuid)
      if (logsResponse) {
        const filename = extractFilename(logsResponse.headers['content-disposition'])
        const blob = new Blob([logsResponse.data], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error: any) {
      const errorMessage = await error.response.data.text()
      setDownloadLogsFailMessage(errorMessage)
      setDownloadLogsFail(true)
    }
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid
        container
        item
        justifyContent={
          userRights.right_export_jupyter_nominative || userRights.right_export_jupyter_pseudonymized
            ? 'space-between'
            : 'flex-end'
        }
        style={{ margin: '12px 0' }}
      >
        {(userRights.right_export_jupyter_nominative || userRights.right_export_jupyter_pseudonymized) && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setSelectedTransferRequest({} as DatalabTransferForm)}
          >
            Nouvel export
          </Button>
        )}
        <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
          <Button
            variant="contained"
            disableElevation
            startIcon={<FilterIcon height="15px" fill="#FFF" />}
            className={classes.filterButton}
            onClick={() => setOpenFilters(true)}
          >
            Filtrer
          </Button>
        </Grid>
        <Grid container item justifyContent="flex-end">
          {filters.exportType.length > 0 &&
            filters.exportType.map((exportType) => (
              <Chip
                key={exportType.code}
                className={classes.filterChip}
                label={`Export ${exportType.display}`}
                onDelete={() => handleDeleteChip('exportType', exportType)}
                color="primary"
                variant="outlined"
              />
            ))}
          {filters.request_job_status.length > 0 &&
            filters.request_job_status.map((status) => (
              <Chip
                key={status.code}
                className={classes.filterChip}
                label={`Statut "${status.display}"`}
                onDelete={() => handleDeleteChip('request_job_status', status)}
                color="primary"
                variant="outlined"
              />
            ))}
          {filters.insert_datetime_gte && (
            <Chip
              className={classes.filterChip}
              label={`Après le : ${moment(filters.insert_datetime_gte).format('DD/MM/YYYY')}`}
              onDelete={() => handleDeleteChip('insert_datetime_gte')}
              color="primary"
              variant="outlined"
            />
          )}
          {filters.insert_datetime_lte && (
            <Chip
              className={classes.filterChip}
              label={`Avant le : ${moment(filters.insert_datetime_lte).format('DD/MM/YYYY')}`}
              onDelete={() => handleDeleteChip('insert_datetime_lte')}
              color="primary"
              variant="outlined"
            />
          )}
        </Grid>
      </Grid>
      <DataTable
        columns={columns}
        order={order}
        setOrder={setOrder}
        page={page}
        onChangePage={onChangePage}
        rowsPerPage={rowsPerPage}
        total={total}
      >
        {loading && (
          <TableRow>
            <TableCell colSpan={9}>
              <div className={classes.loadingSpinnerContainer}>
                <CircularProgress size={50} />
              </div>
            </TableCell>
          </TableRow>
        )}
        {!loading && (!exportsList || exportsList?.length === 0) && (
          <TableRow>
            <TableCell colSpan={9}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        )}
        {!loading &&
          exportsList &&
          exportsList?.length > 0 &&
          exportsList.map((exportRequest, index) => {
            return (
              exportRequest && (
                <TableRow key={index} className={classes.tableBodyRows} hover>
                  <TableCell align="center">{exportRequest.cohort_id ?? '-'}</TableCell>
                  <TableCell align="center">
                    {exportRequest.cohort_name !== '' ? exportRequest.cohort_name : '-'}
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.patients_count !== '' ? exportRequest.patients_count : '-'}
                  </TableCell>
                  <TableCell align="center">{exportRequest.owner !== '' ? exportRequest.owner : '-'}</TableCell>
                  <TableCell align="center">
                    {exportRequest.output_format === 'csv'
                      ? 'CSV'
                      : exportRequest.output_format === 'hive'
                        ? 'Jupyter'
                        : 'XLSX'}
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.target_datalab !== '' ? exportRequest.target_datalab : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={exportRequest.target_name ?? '-'}>
                      <Typography style={{ maxWidth: 200 }} noWrap>
                        {exportRequest.target_name ?? '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.created_at ? moment(exportRequest.created_at).format('DD/MM/YYYY') : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Grid display="flex" alignItems="center">
                      {getExportsChips(exportRequest.request_job_status)}
                      {userRights.right_full_admin && exportRequest.request_job_status === 'failed' && (
                        <>
                          <Tooltip title="Relancer l'export">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setOpenDialog(true)
                                setSelectedExport(exportRequest)
                              }}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Télécharger les logs">
                            <IconButton
                              onClick={() => {
                                downloadLogs(exportRequest)
                              }}
                            >
                              <AssignmentIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Grid>
                  </TableCell>
                </TableRow>
              )
            )
          })}
      </DataTable>
      {selectedTransferRequest !== null && (
        <TransfertDatalabForm
          userRights={userRights}
          onClose={() => setSelectedTransferRequest(null)}
          selectedTransferRequest={selectedTransferRequest}
          setSelectedTransferRequest={setSelectedTransferRequest}
          onAddTransferRequestSuccess={setAddTransferRequestSuccess}
          onAddTransferRequestFail={setAddTransferRequestFail}
        />
      )}
      {openFilters && (
        <TransfertsFilters
          filters={filters}
          onChangeFilters={(newFilters) => {
            setFilters(newFilters)
            setPage(1)
          }}
          onClose={() => setOpenFilters(false)}
        />
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="retry-export-title"
        aria-describedby="retry-export-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="retry-export-title">Relancer l'export</DialogTitle>
        <DialogContent style={{ margin: '0 5%', backgroundColor: '#F8F8FFC8' }}>
          <Grid display="flex" justifyContent="space-between" marginTop="5px">
            <Typography variant="h3">Type d'export</Typography>
            <Typography>{selectedExport?.output_format ?? '---'}</Typography>
          </Grid>
          <Grid display="flex" justifyContent="space-between" marginTop="5px">
            <Typography variant="h3">Cohorte</Typography>
            <Typography>
              {selectedExport?.cohort_name} (N° {selectedExport?.cohort_id})
            </Typography>
          </Grid>
          <Grid display="flex" justifyContent="space-between" marginTop="5px">
            <Typography variant="h3">Nombre de patients</Typography>
            <Typography>{selectedExport?.patients_count ?? '---'}</Typography>
          </Grid>
          <Grid display="flex" justifyContent="space-between" marginTop="5px">
            <Typography variant="h3">Propriétaire</Typography>
            <Typography>{selectedExport?.owner ?? '---'}</Typography>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation()
              handleCloseDialog()
              retryExport(selectedExport!)
            }}
            color="primary"
          >
            Relancer
          </Button>
        </DialogActions>
      </Dialog>

      {addTransferRequestSuccess && (
        <CommonSnackbar
          onClose={() => {
            if (addTransferRequestSuccess) setAddTransferRequestSuccess(false)
          }}
          severity="success"
          message={'La demande de transfert a bien été créée.'}
        />
      )}

      {addTransferRequestFail && (
        <CommonSnackbar
          onClose={() => {
            if (addTransferRequestFail) setAddTransferRequestFail(false)
          }}
          severity="error"
          message={'Erreur lors de la création la demande de transfert.'}
        />
      )}
      {retryExportSuccess && (
        <CommonSnackbar
          onClose={() => {
            if (retryExportSuccess) setRetryExportSuccess(false)
          }}
          severity="success"
          message={"L'export a bien été relancé."}
        />
      )}
      {retryExportFail && (
        <CommonSnackbar
          onClose={() => {
            if (retryExportFail) setRetryExportFail(false)
          }}
          severity="error"
          message={"Erreur lors de la relance de l'export."}
        />
      )}
      {downloadLogsFail && (
        <CommonSnackbar
          onClose={() => {
            if (downloadLogsFail) setDownloadLogsFail(false)
          }}
          severity="error"
          message={`Erreur lors du téléchargement des logs: ${downloadLogsFailMessage}`}
        />
      )}
    </Grid>
  )
}

export default TransfertsDatalabTable
