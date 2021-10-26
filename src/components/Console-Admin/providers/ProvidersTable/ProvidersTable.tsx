import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
// import { useDispatch } from "react-redux"

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  Tooltip,
  Snackbar,
} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import Pagination from "@material-ui/lab/Pagination"

import AssignmentIcon from "@material-ui/icons/Assignment"
import EditIcon from "@material-ui/icons/Edit"
import PersonAddIcon from "@material-ui/icons/PersonAdd"
import VisibilityIcon from "@material-ui/icons/Visibility"

import ProviderDialog from "../ProviderForm/ProviderForm"
import SearchBar from "../../../SearchBar/SearchBar"

import { getProviders } from "services/Console-Admin/providersService"
import useStyles from "./styles"
import { Provider } from "types"

const ProvidersTable = () => {
  const classes = useStyles()
  // const dispatch = useDispatch()
  const history = useHistory()

  const columns = [
    {
      label: "Identifiant APH",
      code: "provider_source_value",
    },
    {
      label: "Nom",
      code: "lastname",
    },
    {
      label: "Prénom",
      code: "firstname",
    },
    {
      label: "Email",
      code: "email",
    },
    {
      label: "Actions",
    },
  ]

  const [providers, setProviders] = useState<Provider[] | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshed /*setRefreshed*/] = useState(true)
  const [orderBy, setOrderBy] = useState<string>("lastname")
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc")
  const [searchInput, setSearchInput] = useState("")
  const [addProviderSuccess, setAddProviderSuccess] = useState(false)
  const [addProviderFail, setAddProviderFail] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  )
  const [editProviderSuccess, setEditProviderSuccess] = useState(false)
  const [editProviderFail, setEditProviderFail] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [searchInput])

  useEffect(() => {
    getData(orderBy, orderDirection, page)
  }, [orderBy, orderDirection, searchInput, page]) // eslint-disable-line

  useEffect(() => {
    if (addProviderSuccess) getData(orderBy, orderDirection)
    if (editProviderSuccess) getData(orderBy, orderDirection)
  }, [addProviderSuccess, editProviderSuccess]) // eslint-disable-line

  const getData = async (
    orderBy: string,
    orderDirection: string,
    page?: number
  ) => {
    try {
      const _page = page ? page : 1
      if (refreshed) {
        const urlSearch = searchInput ? `&search=${searchInput}` : ""
        const urlOrderingDirection = orderDirection === "desc" ? "-" : ""

        history.push({
          pathname: "/users",
          search: `?page=${_page}&ordering=${urlOrderingDirection}${orderBy}${urlSearch}`,
        })
      }

      setLoading(true)

      const providersResp = await getProviders(
        orderBy,
        orderDirection,
        _page,
        searchInput
      )

      if (providersResp) {
        setProviders(
          providersResp.providers.length === 0
            ? undefined
            : providersResp.providers
        )
        setTotal(providersResp.total)
      }

      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des providers", error)
      setProviders(null)
      setTotal(0)
      setLoading(false)
    }
  }

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      const isAsc: boolean = orderBy === property && orderDirection === "asc"
      const _orderDirection = isAsc ? "desc" : "asc"

      setOrderDirection(_orderDirection)
      setOrderBy(property)
    }

  return (
    <Grid container justify="flex-end">
      <Grid container item justify="space-between" style={{ margin: "12px 0" }}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<PersonAddIcon height="15px" fill="#FFF" />}
          className={classes.searchButton}
          onClick={() => setSelectedProvider({})}
        >
          Nouvel utilisateur
        </Button>
        <Grid container item xs={6} justify="flex-end" alignItems="center">
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column) => (
                <TableCell
                  sortDirection={
                    orderBy === column.code ? orderDirection : false
                  }
                  align="center"
                  className={classes.tableHeadCell}
                >
                  {column.label !== "Actions" ? (
                    <TableSortLabel
                      active={orderBy === column.code}
                      direction={
                        orderBy === column.code ? orderDirection : "asc"
                      }
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
            ) : !providers ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider: Provider) => {
                return (
                  provider && (
                    <TableRow
                      key={provider.provider_id}
                      className={classes.tableBodyRows}
                      hover
                      onClick={() =>
                        history.push(`/user-profile/${provider.provider_id}`)
                      }
                    >
                      <TableCell align="center">
                        {provider.provider_source_value}
                      </TableCell>
                      <TableCell align="center">{provider.lastname}</TableCell>
                      <TableCell align="center">{provider.firstname}</TableCell>
                      <TableCell align="center">
                        {provider.email ?? "-"}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip
                          title="Visualiser les accès de l'utilisateur"
                          style={{ padding: "0 12px" }}
                        >
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              history.push(
                                `/user-profile/${provider.provider_id}`
                              )
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Éditer l'utilisateur"
                          style={{ padding: "0 12px" }}
                        >
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedProvider(provider)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Voir les logs de l'utilisateur"
                          style={{ padding: "0 12px" }}
                        >
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              history.push({
                                pathname: "/logs",
                                search: `?user=${provider.provider_source_value}`,
                              })
                            }}
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Tooltip>
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

      {selectedProvider && (
        <ProviderDialog
          open
          onClose={() => setSelectedProvider(null)}
          selectedProvider={selectedProvider}
          onAddProviderSuccess={setAddProviderSuccess}
          onEditProviderSuccess={setEditProviderSuccess}
          onAddProviderFail={setAddProviderFail}
          onEditProviderFail={setEditProviderSuccess}
        />
      )}

      {(addProviderSuccess || editProviderSuccess) && (
        <Snackbar
          open
          onClose={() => {
            if (addProviderSuccess) setAddProviderSuccess(false)
            if (editProviderSuccess) setEditProviderSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (addProviderSuccess) setAddProviderSuccess(false)
              if (editProviderSuccess) setEditProviderSuccess(false)
            }}
          >
            {addProviderSuccess && "L'utilisateur a bien été créé."}
            {editProviderSuccess && "L'utilisateur a bien été édité."}
          </Alert>
        </Snackbar>
      )}
      {(addProviderFail || editProviderFail) && (
        <Snackbar
          open
          onClose={() => {
            if (addProviderFail) setAddProviderFail(false)
            if (editProviderFail) setEditProviderFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (addProviderFail) setAddProviderFail(false)
              if (editProviderFail) setEditProviderFail(false)
            }}
          >
            {addProviderFail && "Erreur lors de la création de l'utilisateur."}
            {editProviderFail && "Erreur lors de l'édition de l'utilisateur."}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default ProvidersTable
