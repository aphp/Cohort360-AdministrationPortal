import React, { useEffect, useState } from "react"

import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

import AddIcon from "@material-ui/icons/Add"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"

import useStyles from "./styles"
import AddAccessForm from "../providers/AddAccessForm/AddAccessForm"

type RightsTableProps = {
  right: any
}

const RightsTable: React.FC<RightsTableProps> = ({ right }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [profiles, setProfiles] = useState(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderBy, setOrderBy] = useState<string>("lastName")
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc")

  const rowsPerPage = 50

  console.log(`right`, right)

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
      <Grid container justify="space-between" alignItems="center">
        <Typography align="left" variant="h2" className={classes.title}>
          {/* @ts-ignore */}
          Type de droit : {right.cdm_source}
        </Typography>
        {right.cdm_source === "MANUAL" && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.searchButton}
            onClick={() => setOpen(true)}
          >
            Nouvel accès
          </Button>
        )}
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
            !right ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="center">{right.perimeter}</TableCell>
                <TableCell align="center">{right.right}</TableCell>
                <TableCell align="center">{right.access}</TableCell>
                <TableCell align="center">
                  {new Date(right.creation_datetime).toLocaleDateString(
                    "fr-FR"
                  )}{" "}
                  {new Date(right.creation_datetime).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </TableCell>
                <TableCell align="center">
                  {right.is_active ? <CheckIcon /> : <CloseIcon />}
                </TableCell>
              </TableRow>
              // @ts-ignore
              // right.map((profile: any) => {
              //   return (
              //     profile && (
              //       <TableRow
              //         key={profile.id}
              //         className={classes.tableBodyRows}
              //         hover
              //         onClick={() => window.open(`/profile/${profile.id}`)}
              //       >
              //         <TableCell align="center">
              //           {profile.providerSourceValue}
              //         </TableCell>
              //         <TableCell align="center">{profile.lastName}</TableCell>
              //         <TableCell align="center">{profile.firstName}</TableCell>
              //         <TableCell align="center">{profile.email}</TableCell>
              //       </TableRow>
              //     )
              //   )
              // })
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

      <AddAccessForm
        open={open}
        onClose={() => setOpen(false)}
        entityId={right.provider_history_id}
      />
    </Grid>
  )
}

export default RightsTable
