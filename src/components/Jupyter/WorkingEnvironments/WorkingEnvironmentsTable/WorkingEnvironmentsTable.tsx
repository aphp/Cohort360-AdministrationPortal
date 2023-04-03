import React, { useEffect, useState } from 'react'

import { Button, CircularProgress, Grid, TableCell, TableRow, Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import useStyles from './styles'
import { Column, Order, UserRole, WorkingEnvironment } from 'types'
import WorkingEnvironmentsForm from 'components/Jupyter/WorkingEnvironmentsForm/WorkingEnvironmentsForm'
import { getWorkingEnvironments } from 'services/Jupyter/workingEnvironmentsService'
import DataTable from 'components/DataTable/DataTable'
import SearchBar from 'components/SearchBar/SearchBar'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import CommonSnackbar from 'components/Snackbar/Snackbar'

type WorkingEnvironmentsTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'username', orderDirection: 'asc' } as Order

const WorkingEnvironmentsTable: React.FC<WorkingEnvironmentsTableProps> = ({ userRights }) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [workingEnvironments, setWorkingEnvironments] = useState<WorkingEnvironment[]>([])
  const [selectedWorkingEnvironment, setSelectedWorkingEnvironment] = useState<any>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearchTerm = useDebounce(500, searchInput)

  const columns: Column[] = [
    {
      label: "Nom de l'environnement",
      align: 'center',
      sortableColumn: true,
      code: 'username'
    },
    {
      label: "Date d'envoi",
      align: 'center'
    },
    {
      label: 'Créé par',
      align: 'center'
    },
    {
      label: 'Statut',
      align: 'center'
    }
  ]

  const [addWorkingEnvironmentSuccess, setAddWorkingEnvironmentSuccess] = useState(false)
  const [addWorkingEnvironmentFail, setAddWorkingEnvironmentFail] = useState(false)

  const createWorkingEnvironmentUserRights =
    userRights.right_manage_env_unix_users && userRights.right_manage_env_user_links

  const _getWorkingEnvironments = async () => {
    try {
      setLoading(true)

      const workingEnvironmentsResp = await getWorkingEnvironments(order, page, false, searchInput.trim())

      setWorkingEnvironments(workingEnvironmentsResp?.workingEnvironments)
      setTotal(workingEnvironmentsResp?.total)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      setWorkingEnvironments([])
      setTotal(0)
      console.error('Erreur lors de la récupération des infos du formulaire', error)
    }
  }

  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    } else {
      _getWorkingEnvironments()
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    _getWorkingEnvironments()
  }, [page, order])

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
            onClick={() => setSelectedWorkingEnvironment({})}
          >
            Nouvel environnement
          </Button>
        )}
        <Grid container item xs={6} justifyContent="flex-end" alignItems="center">
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
        ) : !workingEnvironments || workingEnvironments?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
          workingEnvironments.map((workingEnvironment) => {
            return (
              workingEnvironment && (
                <TableRow key={workingEnvironment.uid} className={classes.tableBodyRows} hover>
                  <TableCell align="center">{workingEnvironment.username}</TableCell>
                  <TableCell align="center">{/* {workingEnvironment.insert_datetime} */}</TableCell>
                  <TableCell align="center">{/* {workingEnvironment.operation_actors} */}</TableCell>
                  <TableCell align="center">
                    {/* {workingEnvironment.status === 'validated' ? (
                          <Chip label="Validé" style={{ backgroundColor: '#28a745', color: 'white' }} />
                        ) : workingEnvironment.status === 'new' || workingEnvironment.status === 'in progress' ? (
                          <Chip label="En cours" style={{ backgroundColor: '#ffc107', color: 'black' }} />
                        ) : workingEnvironment.status === 'not_validated' ||
                          workingEnvironment.status === 'aborted' ||
                          workingEnvironment.status === 'closed' ? (
                          <Chip
                            label={
                              workingEnvironment.status === 'not_validated'
                                ? 'Non validé'
                                : workingEnvironment.status === 'aborted'
                                ? 'Interrompu'
                                : workingEnvironment.status === 'closed'
                                ? 'Fermé'
                                : 'Erreur'
                            }
                            style={{ backgroundColor: '#dc3545', color: 'black' }}
                          />
                        ) : (
                          '-'
                        )} */}
                  </TableCell>
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedWorkingEnvironment !== null && (
        <WorkingEnvironmentsForm
          userRights={userRights}
          onClose={() => setSelectedWorkingEnvironment(null)}
          onAddWorkingEnvironmentSuccess={setAddWorkingEnvironmentSuccess}
          onAddWorkingEnvironmentFail={setAddWorkingEnvironmentFail}
        />
      )}

      {addWorkingEnvironmentSuccess && (
        <CommonSnackbar
          onClose={() => setAddWorkingEnvironmentSuccess(false)}
          severity="success"
          message="L'utilisateur a bien été créé."
        />
      )}
      {addWorkingEnvironmentFail && (
        <CommonSnackbar
          onClose={() => setAddWorkingEnvironmentFail(false)}
          severity="error"
          message="Erreur lors de la création de l'utilisateur."
        />
      )}
    </Grid>
  )
}

export default WorkingEnvironmentsTable
