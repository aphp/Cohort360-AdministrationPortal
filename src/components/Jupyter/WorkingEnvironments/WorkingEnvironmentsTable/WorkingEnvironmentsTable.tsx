import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Snackbar,
  Chip
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import Pagination from '@material-ui/lab/Pagination'

import AddIcon from '@material-ui/icons/Add'

import useStyles from './styles'
import { UserRole, WorkingEnvironment } from 'types'
import WorkingEnvironmentsForm from 'components/Jupyter/WorkingEnvironmentsForm/WorkingEnvironmentsForm'
import { getWorkingEnvironments } from 'services/Jupyter/workingEnvironmentsService'

type WorkingEnvironmentsTableProps = {
  userRights: UserRole
}

const WorkingEnvironmentsTable: React.FC<WorkingEnvironmentsTableProps> = ({ userRights }) => {
  const classes = useStyles()

  const [loading, setLoading] = useState(false)
  const [workingEnvironments, setWorkingEnvironments] = useState<WorkingEnvironment[]>([])
  const [selectedWorkingEnvironment, setSelectedWorkingEnvironment] = useState<any>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const columns = [
    {
      label: 'Numéro de demande'
    },
    {
      label: 'Nom du demandeur'
    },
    {
      label: "Date d'envoi"
    },
    {
      label: 'Créé par'
    },
    {
      label: 'Statut'
    }
  ]

  const [addWorkingEnvironmentSuccess, setAddWorkingEnvironmentSuccess] = useState(false)
  const [addWorkingEnvironmentFail, setAddWorkingEnvironmentFail] = useState(false)

  useEffect(() => {
    const _getWorkingEnvironments = async () => {
      try {
        setLoading(true)

        const workingEnvironmentsResp = await getWorkingEnvironments()

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

    _getWorkingEnvironments()
  }, [])

  return (
    <Grid container justify="flex-end">
      <Grid container item justify={'flex-end'} style={{ margin: '12px 0' }}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon height="15px" fill="#FFF" />}
          className={classes.searchButton}
          onClick={() => setSelectedWorkingEnvironment({})}
        >
          Nouvel environnement
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column, index: number) => (
                <TableCell key={index} align="center" className={classes.tableHeadCell}>
                  {column.label}
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
                      <TableCell align="center">{workingEnvironment.identifier}</TableCell>
                      <TableCell align="center">{workingEnvironment.title}</TableCell>
                      <TableCell align="center">{workingEnvironment.insert_datetime}</TableCell>
                      <TableCell align="center">{workingEnvironment.operation_actors}</TableCell>
                      <TableCell align="center">
                        {workingEnvironment.status === 'validated' ? (
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
                        )}
                      </TableCell>
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

      {selectedWorkingEnvironment !== null && (
        <WorkingEnvironmentsForm
          userRights={userRights}
          onClose={() => setSelectedWorkingEnvironment(null)}
          onAddWorkingEnvironmentSuccess={setAddWorkingEnvironmentSuccess}
          onAddWorkingEnvironmentFail={setAddWorkingEnvironmentFail}
        />
      )}

      {addWorkingEnvironmentSuccess && (
        <Snackbar
          open
          onClose={() => {
            if (addWorkingEnvironmentSuccess) setAddWorkingEnvironmentSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (addWorkingEnvironmentSuccess) setAddWorkingEnvironmentSuccess(false)
            }}
          >
            {addWorkingEnvironmentSuccess && "L'utilisateur a bien été créé."}
          </Alert>
        </Snackbar>
      )}
      {addWorkingEnvironmentFail && (
        <Snackbar
          open
          onClose={() => {
            if (addWorkingEnvironmentFail) setAddWorkingEnvironmentFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (addWorkingEnvironmentFail) setAddWorkingEnvironmentFail(false)
            }}
          >
            {addWorkingEnvironmentFail && "Erreur lors de la création de l'utilisateur."}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default WorkingEnvironmentsTable
