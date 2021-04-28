import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import * as QueryString from "query-string"
// import { useDispatch } from "react-redux"



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
  TableSortLabel,
  Typography,
  Paper,
  TextField,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
import Autocomplete from "@material-ui/lab/Autocomplete"

import PersonAddIcon from "@material-ui/icons/PersonAdd"

import SearchBar from "../../../SearchBar/SearchBar"
import AddUserDialog from "../AddProviderForm/AddProviderForm"

import useStyles from "./styles"
import { submitGetProviders } from "services/Console-Admin/providersService"

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
  ]

  const [providers, setProviders] = useState(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshed, /*setRefreshed*/] = useState(true)
  const [orderBy, setOrderBy] = useState<string>("lastname")
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc")
  const [searchInput, setSearchInput] = useState("")
  const [searchBy, setSearchBy] = useState(columns[1])

  const [open, setOpen] = useState(false)

  console.log(`orderBy`, orderBy)
  console.log(
    `window.location.search`,
    QueryString.parse(window.location.search)
  )
  console.log(`page`, page)
  console.log(`total`, total)
  console.log(`searchBy`, searchBy)
  console.log(`providers`, providers)

  useEffect(() => {
    setPage(1)
  }, [searchInput])

  useEffect(() => {
    getData(orderBy, orderDirection, page)
  }, [orderBy, orderDirection, searchInput, page]) // eslint-disable-line

  useEffect(() => {
    if (searchInput) {
      getData(orderBy, orderDirection, page)
    }
  }, [searchBy]) // eslint-disable-line

  const getData = async (
    orderBy: string,
    orderDirection: string,
    page?: number
  ) => {
    if (refreshed) {
      const urlSearch = searchInput ? `&${searchBy.code}=${searchInput}` : ""
      const urlOrderingDirection = orderDirection === "desc" ? "-" : ""

      console.log(`urlSearch`, urlSearch)

      // history.push(
      //   `/users/page=${page}&ordering=${orderDirection}${orderBy}${urlSearch}`
      // )

      history.push({
        pathname: "/users",
        search: `?page=${page}&ordering=${urlOrderingDirection}${orderBy}${urlSearch}`,
      })
    }
    setLoading(true)
    submitGetProviders(orderBy, orderDirection, page, searchBy, searchInput)
      .then((resp) => {
        console.log(`resp`, resp)
        if (resp) {
          setProviders(resp.providers.length === 0 ? undefined : resp.providers)
          setTotal(resp.total)
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false)
      })
  }

  const createSortHandler = (property: any) => (
    event: React.MouseEvent<unknown>
  ) => {
    const isAsc: boolean = orderBy === property && orderDirection === "asc"
    const _orderDirection = isAsc ? "desc" : "asc"

    setOrderDirection(_orderDirection)
    setOrderBy(property)
  }

  const handleChangeAutocomplete = (
    event: React.ChangeEvent<{}>,
    value: { label: string; code: string } | null
  ) => {
    if (value) setSearchBy(value)
  }

  return (
    <Grid container justify="flex-end">
      <Grid
        container
        item
        justify="space-between"
        style={{ margin: "12px 0" }}
        alignItems="center"
      >
        <Button
          variant="contained"
          disableElevation
          startIcon={<PersonAddIcon height="15px" fill="#FFF" />}
          className={classes.searchButton}
          onClick={() => setOpen(true)}
        >
          Nouvel utilisateur
        </Button>
        <Grid container item xs={6} justify="flex-end" alignItems="center">
          <Autocomplete
            options={columns}
            getOptionLabel={(option) => option.label}
            onChange={handleChangeAutocomplete}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rechercher par..."
                variant="outlined"
              />
            )}
            value={searchBy}
            style={{ width: "200px" }}
          />
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
                  <TableSortLabel
                    active={orderBy === column.code}
                    direction={orderBy === column.code ? orderDirection : "asc"}
                    onClick={createSortHandler(column.code)}
                  >
                    {column.label}
                  </TableSortLabel>
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
            ) : // @ts-ignore
            !providers ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // @ts-ignore
              providers.map((provider: any) => {
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

      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
      />
    </Grid>
  )
}

export default ProvidersTable
