import React, { useEffect, useState } from 'react'

import { Button, Chip, CircularProgress, Grid, TableCell, TableRow, Typography, Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import AddIcon from '@material-ui/icons/Add'

import useStyles from './styles'
import { Column, Export, Order, UserRole } from 'types'
import TransfertForm from 'components/Jupyter/TransfertForm/TransfertForm'
import DataTable from 'components/DataTable/DataTable'
import SearchBar from 'components/SearchBar/SearchBar'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import { getExportsList } from 'services/Jupyter/jupyterExportService'
import moment from 'moment'

type TransfertsTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'username', orderDirection: 'asc' } as Order

// const defaultTransferRequest = {
//   output_format: '',
//   cohort_id: 0,
//   provider_source_value: '',
//   target_unix_account: 0,
//   shift_dates: false,
//   nominative: false
// }

const TransfertsTable: React.FC<TransfertsTableProps> = ({ userRights }) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [exportsList, setExportsList] = useState<Export[]>([])
  const [selectedTransferRequest, setSelectedTransferRequest] = useState<any>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const columns: Column[] = [
    {
      label: 'N° de cohorte',
      align: 'center'
      //   sortableColumn: true,
      //   code: 'username'
    },
    {
      label: 'Propriétaire de la cohorte',
      align: 'center'
    },
    {
      label: "Type d'export",
      align: 'center'
    },
    {
      label: 'Environnement de travail',
      align: 'center'
    },
    {
      label: 'Création de la demande',
      align: 'center'
    },
    {
      label: 'Statut',
      align: 'center'
    },
    {
      label: 'Actions',
      align: 'center'
    }
  ]

  const [addTransfertRequestSuccess, setAddTransfertRequestSuccess] = useState(false)
  const [addTransfertRequestFail, setAddTransfertRequestFail] = useState(false)

  const createWorkingEnvironmentUserRights =
    userRights.right_manage_env_unix_users && userRights.right_manage_env_user_links

  const _getExportsList = async () => {
    try {
      setLoading(true)

      const exportsList = await getExportsList(page, searchInput)

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

  console.log('exportsList', exportsList)

  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    } else {
      _getExportsList()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    _getExportsList()
  }, [page, order])

  useEffect(() => {
    if (addTransfertRequestSuccess) _getExportsList()
  }, [addTransfertRequestSuccess])

  return (
    <Grid container justify="flex-end">
      <Grid
        container
        item
        justify={createWorkingEnvironmentUserRights ? 'space-between' : 'flex-end'}
        style={{ margin: '12px 0' }}
      >
        {createWorkingEnvironmentUserRights && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setSelectedTransferRequest({})}
          >
            Nouveau transfert
          </Button>
        )}
        <Grid container item xs={6} justify="flex-end" alignItems="center">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
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
        ) : !exportsList || exportsList?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
          exportsList.map((exportRequest) => {
            return (
              exportRequest && (
                <TableRow key={exportRequest.id} className={classes.tableBodyRows} hover>
                  <TableCell align="center">{exportRequest.cohort_id}</TableCell>
                  <TableCell align="center">{exportRequest.owner}</TableCell>
                  <TableCell align="center">
                    {exportRequest.output_format === 'csv'
                      ? 'CSV'
                      : exportRequest.output_format === 'hive'
                      ? 'Jupyter'
                      : 'psql'}
                  </TableCell>
                  <TableCell align="center">{exportRequest.target_unix_account ?? '-'}</TableCell>
                  <TableCell align="center">
                    {exportRequest.insert_datetime ? moment(exportRequest.insert_datetime).format('DD/MM/YYYY') : ''}
                  </TableCell>
                  <TableCell align="center">
                    {exportRequest.status === 'validated' ? (
                      <Chip label="Validé" style={{ backgroundColor: '#28a745', color: 'white' }} />
                    ) : exportRequest.status === 'new' || exportRequest.status === 'running' ? (
                      <Chip label="En cours" style={{ backgroundColor: '#ffc107', color: 'black' }} />
                    ) : exportRequest.status === 'denied' ||
                      exportRequest.status === 'canceled' ||
                      exportRequest.status === 'to delete' ||
                      exportRequest.status === 'deleted' ||
                      exportRequest.status === 'failed' ? (
                      <Chip
                        label={() => {
                          switch (exportRequest.status) {
                            case 'denied':
                              'Non validé'
                              break
                            case 'canceled':
                              'Annulé'
                              break
                            case 'to delete':
                              'À supprimer'
                              break
                            case 'deleted':
                              'Supprimé'
                              break
                            default:
                              break
                          }
                        }}
                        style={{ backgroundColor: '#dc3545', color: 'black' }}
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

      {addTransfertRequestSuccess && (
        <Snackbar
          open
          onClose={() => {
            if (addTransfertRequestSuccess) setAddTransfertRequestSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (addTransfertRequestSuccess) setAddTransfertRequestSuccess(false)
            }}
          >
            {addTransfertRequestSuccess && "L'utilisateur a bien été créé."}
          </Alert>
        </Snackbar>
      )}
      {addTransfertRequestFail && (
        <Snackbar
          open
          onClose={() => {
            if (addTransfertRequestFail) setAddTransfertRequestFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (addTransfertRequestFail) setAddTransfertRequestFail(false)
            }}
          >
            {addTransfertRequestFail && 'Erreur lors de la création la demande de transfert.'}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default TransfertsTable
