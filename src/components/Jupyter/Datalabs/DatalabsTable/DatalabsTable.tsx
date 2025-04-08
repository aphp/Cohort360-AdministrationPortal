import React, { useEffect, useState } from 'react'

import { Button, CircularProgress, Grid, TableCell, TableRow, Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

import useStyles from './styles'
import { Column, Order, UserRole, Datalab, InfrastructureProvider } from 'types'
import DatalabsForm from 'components/Jupyter/DatalabsForm/DatalabsForm'
import { getDatalabs, getInfrastructureProviders } from 'services/Jupyter/datalabsService'
import DataTable from 'components/DataTable/DataTable'
import SearchBar from 'components/SearchBar/SearchBar'
import useDebounce from 'components/Console-Admin/Perimeter/use-debounce'
import CommonSnackbar from 'components/Snackbar/Snackbar'
import moment from 'moment/moment'

type DatalabsTableProps = {
  userRights: UserRole
}

const orderDefault = { orderBy: 'name', orderDirection: 'asc' } as Order

const DatalabsTable: React.FC<DatalabsTableProps> = ({ userRights }) => {
  const { classes } = useStyles()

  const [loading, setLoading] = useState(false)
  const [datalabs, setDatalabs] = useState<Datalab[]>([])
  const [selectedDatalab, setSelectedDatalab] = useState<Datalab | null>(null)
  const [infrastructureProviders, setInfrastructureProviders] = useState<InfrastructureProvider[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [order, setOrder] = useState(orderDefault)
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearchTerm = useDebounce(500, searchInput)
  const rowsPerPage = 20

  const columns: Column[] = [
    {
      label: 'Intitulé',
      align: 'center',
      sortableColumn: true
    },
    {
      label: "Fournisseur d'infrastructure",
      align: 'center'
    },
    {
      label: 'Créé le',
      align: 'center'
    }
  ]

  const [addDatalabSuccess, setAddDatalabSuccess] = useState(false)
  const [addDatalabFail, setAddDatalabFail] = useState(false)

  const _getDatalabs = async (_page: number) => {
    try {
      setLoading(true)

      const datalabsResp = await getDatalabs(order, _page, searchInput.trim())

      setDatalabs(datalabsResp?.datalabs)
      setTotal(datalabsResp?.total)

      setLoading(false)
    } catch (error) {
      setLoading(false)
      setDatalabs([])
      setTotal(0)
      console.error('Erreur lors de la récupération des infos du formulaire', error)
    }
  }

  useEffect(() => {
    setPage(1)
    _getDatalabs(1)
  }, [debouncedSearchTerm, order])

  const onChangePage = (value: number) => {
    setPage(value)
    _getDatalabs(value)
  }

  const handleAddNewDatalab = async () => {
    const infrastructureProvidersResp = await getInfrastructureProviders()
    setInfrastructureProviders(infrastructureProvidersResp)
    setSelectedDatalab({
      uuid: '',
      created_at: '',
      name: '',
      infrastructure_provider: infrastructureProvidersResp[0] ?? '-'
    })
  }

  const handleOnCloseForm = async () => {
    setSelectedDatalab(null)
    await _getDatalabs(page)
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid
        container
        item
        justifyContent={userRights.right_manage_datalabs ? 'space-between' : 'flex-end'}
        style={{ margin: '12px 0' }}
      >
        {userRights.right_manage_datalabs && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => handleAddNewDatalab()}
          >
            Nouveau datalab
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
        ) : !datalabs || datalabs?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Typography className={classes.loadingSpinnerContainer}>Aucun résultat à afficher</Typography>
            </TableCell>
          </TableRow>
        ) : (
          datalabs.map((datalab) => {
            return (
              datalab && (
                <TableRow key={datalab.uuid} className={classes.tableBodyRows} hover>
                  <TableCell align="center">{datalab.name}</TableCell>
                  <TableCell align="center">{datalab.infrastructure_provider.name}</TableCell>
                  <TableCell align="center">{moment(datalab.created_at).format('DD/MM/YYYY')}</TableCell>
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedDatalab !== null && (
        <DatalabsForm
          userRights={userRights}
          selectedDatalab={selectedDatalab}
          infrastructureProviders={infrastructureProviders}
          onClose={() => handleOnCloseForm()}
          onAddDatalabSuccess={setAddDatalabSuccess}
          onAddDatalabFail={setAddDatalabFail}
        />
      )}

      {addDatalabSuccess && (
        <CommonSnackbar
          onClose={() => setAddDatalabSuccess(false)}
          severity="success"
          message="Le datalab a bien été rajouté."
        />
      )}
      {addDatalabFail && (
        <CommonSnackbar
          onClose={() => setAddDatalabFail(false)}
          severity="error"
          message="Erreur lors de la création du datalab."
        />
      )}
    </Grid>
  )
}

export default DatalabsTable
