import React, { useEffect, useState } from "react"

import {
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
  IconButton,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

import EditIcon from "@material-ui/icons/Edit"

import useStyles from "./styles"

const RightsTable: React.FC = () => {
  const classes = useStyles()

  const [profiles, setProfiles] = useState(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderBy, setOrderBy] = useState<string>("lastName")
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc")

  const rowsPerPage = 50

  useEffect(() => {}, []) // eslint-disable-line

  const createSortHandler = (property: any) => (
    event: React.MouseEvent<unknown>
  ) => {
    const isAsc: boolean = orderBy === property && orderDirection === "asc"
    const _orderDirection = isAsc ? "desc" : "asc"

    setOrderDirection(_orderDirection)
    setOrderBy(property)
  }

  const columns = [
    {
      label: "Périmètre",
      code: "caresite",
    },
    {
      label: "Droit",
      code: "right",
    },
    {
      label: "Accès",
      code: "access",
    },
    {
      label: "Date",
      code: "date",
    },
    {
      label: "Actif",
      code: "isActive",
    },
  ]

  return (
    <Grid container justify="flex-end">
      <Grid container justify="space-between">
        <Typography align="left" variant="h2" className={classes.title}>
          Type de droit
        </Typography>
        <IconButton
          size="small"
          onClick={() => console.log("clic sur le bouton edit")}
        >
          <EditIcon />
        </IconButton>
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
            !profiles ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // @ts-ignore
              profiles.map((profile: any) => {
                return (
                  profile && (
                    <TableRow
                      key={profile.id}
                      className={classes.tableBodyRows}
                      hover
                      onClick={() => window.open(`/profile/${profile.id}`)}
                    >
                      <TableCell align="center">
                        {profile.providerSourceValue}
                      </TableCell>
                      <TableCell align="center">{profile.lastName}</TableCell>
                      <TableCell align="center">{profile.firstName}</TableCell>
                      <TableCell align="center">{profile.email}</TableCell>
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
        count={Math.ceil(total / rowsPerPage)}
        shape="rounded"
        // onChange={onChangePage}
        page={page}
      />
    </Grid>
  )
}

export default RightsTable
