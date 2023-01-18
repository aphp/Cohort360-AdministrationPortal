import React, { useEffect, useState } from 'react'
import moment from 'moment'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'

import { Button, Chip, CircularProgress, Grid, TableCell, TableRow, Typography, Tooltip } from '@material-ui/core'
import { ReactComponent as FilterIcon } from 'assets/icones/filter.svg'

import AddIcon from '@material-ui/icons/Add'

import DataTable from 'components/DataTable/DataTable'
import TransfertForm from 'components/Jupyter/TransfertForm/TransfertForm'
import SearchBar from 'components/SearchBar/SearchBar'
import CommonSnackbar from 'components/Snackbar/Snackbar'
import { getExportsList } from 'services/Jupyter/jupyterExportService'
import TransfertsFilters from '../TransfertsFilters/TransfertsFilters'

import { Column, Export, ExportFilters, JupyterTransferForm, Order, UserRole } from 'types'
import useStyles from './styles'

type TransfertsTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'insert_datetime', orderDirection: 'desc' } as Order

const defaultFilters: ExportFilters = {
  exportType: [],
  request_job_status: [],
  insert_datetime_gte: null,
  insert_datetime_lte: null
}

const TransfertsTable: React.FC<TransfertsTableProps> = ({ userRights }) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(true)
  const [exportsList, setExportsList] = useState<Export[]>([])
  const [selectedTransferRequest, setSelectedTransferRequest] = useState<JupyterTransferForm | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [openFilters, setOpenFilters] = useState(false)

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
      code: 'insert_datetime'
    },
    {
      label: 'Statut',
      align: 'center'
    }
  ]

  const [addTransfertRequestSuccess, setAddTransfertRequestSuccess] = useState(false)
  const [addTransfertRequestFail, setAddTransfertRequestFail] = useState(false)

  const rowsPerPage = 100

  const createWorkingEnvironmentUserRights =
    userRights.right_manage_env_unix_users && userRights.right_manage_env_user_links

  const _getExportsList = async () => {
    try {
      setLoading(true)

      const exportsList = await getExportsList(page, rowsPerPage, order, filters, debouncedSearchTerm)

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

  const getLabel = (status: Export['request_job_status']) => {
    switch (status) {
      case 'denied':
        return 'Refusé'
      case 'cancelled':
        return 'Annulé'
      case 'failed':
        return 'Erreur'
      default:
        break
    }
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

  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    } else {
      _getExportsList()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    _getExportsList()
  }, [page, order, filters])

  useEffect(() => {
    if (addTransfertRequestSuccess) _getExportsList()
  }, [addTransfertRequestSuccess])

  return (
    <Grid container justifyContent="flex-end">
      <Grid
        container
        item
        justifyContent={createWorkingEnvironmentUserRights ? 'space-between' : 'flex-end'}
        style={{ margin: '12px 0' }}
      >
        {createWorkingEnvironmentUserRights && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setSelectedTransferRequest({} as JupyterTransferForm)}
          >
            Nouveau transfert
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
        setPage={setPage}
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
        {!loading && (!exportsList || exportsList?.length === 0) ? (
          <TableRow>
            <TableCell colSpan={9}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
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
                      : 'psql'}
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.target_env !== '' ? exportRequest.target_env : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={exportRequest.target_name ?? '-'}>
                      <Typography style={{ maxWidth: 200 }} noWrap>
                        {exportRequest.target_name ?? '-'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.insert_datetime ? moment(exportRequest.insert_datetime).format('DD/MM/YYYY') : '-'}
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.request_job_status === 'validated' ||
                    exportRequest.request_job_status === 'finished' ? (
                      <Chip label="Validé" size="small" style={{ backgroundColor: '#28a745', color: 'white' }} />
                    ) : exportRequest.request_job_status === 'new' ||
                      exportRequest.request_job_status === 'pending' ||
                      exportRequest.request_job_status === 'started' ? (
                      <Chip label="En cours" size="small" style={{ backgroundColor: '#ffc107' }} />
                    ) : exportRequest.request_job_status === 'denied' ||
                      exportRequest.request_job_status === 'cancelled' ||
                      exportRequest.request_job_status === 'failed' ? (
                      <Chip
                        label={getLabel(exportRequest.request_job_status)}
                        size="small"
                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              )
            )
          })
        )}
      </DataTable>
      {selectedTransferRequest !== null && (
        <TransfertForm
          userRights={userRights}
          onClose={() => setSelectedTransferRequest(null)}
          selectedTransferRequest={selectedTransferRequest}
          setSelectedTransferRequest={setSelectedTransferRequest}
          onAddTransfertRequestSuccess={setAddTransfertRequestSuccess}
          onAddTransfertRequestFail={setAddTransfertRequestFail}
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

      {addTransfertRequestSuccess && (
        <CommonSnackbar
          onClose={() => {
            if (addTransfertRequestSuccess) setAddTransfertRequestSuccess(false)
          }}
          severity="success"
          message={'La demande de transfert a bien été créée.'}
        />
      )}

      {addTransfertRequestFail && (
        <CommonSnackbar
          onClose={() => {
            if (addTransfertRequestFail) setAddTransfertRequestFail(false)
          }}
          severity="error"
          message={'Erreur lors de la création la demande de transfert.'}
        />
      )}
    </Grid>
  )
}

export default TransfertsTable
