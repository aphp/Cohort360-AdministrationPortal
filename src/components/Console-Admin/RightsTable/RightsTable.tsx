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
  Typography,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

import AddIcon from "@material-ui/icons/Add"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import useStyles from "./styles"
import AddAccessForm from "../providers/AddAccessForm/AddAccessForm"
import { getAccesses } from "services/Console-Admin/providersHistoryService"
import { Access, Profile } from "types"

type RightsTableProps = {
  right: Profile
}

const RightsTable: React.FC<RightsTableProps> = ({ right }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [accesses, setAccesses] = useState<Access[] | undefined>()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const rowsPerPage = 100

  console.log(`right`, right)
  console.log(`accesses`, accesses)

  useEffect(() => {
    setLoading(true)
    getAccesses(right.provider_history_id)
      .then((res) => {
        setAccesses(res?.accesses)
        setTotal(res?.total)
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  const columns = [
    {
      label: "Périmètre",
    },
    {
      label: "Droit",
    },
    {
      label: "Date de début",
    },
    {
      label: "Date de fin",
    },
    {
      label: "Actif",
    },
  ]

  return (
    <Grid container justify="flex-end">
      <Grid container justify="space-between" alignItems="center">
        <Typography align="left" variant="h2" className={classes.title}>
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
                  align={column.label === "Périmètre" ? "left" : "center"}
                  className={classes.tableHeadCell}
                >
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
            ) : accesses && accesses.length > 0 ? (
              accesses.map((access: Access) => {
                return (
                  <TableRow key={access.id} className={classes.tableBodyRows}>
                    <TableCell align="left">
                      {access.care_site.care_site_name}
                    </TableCell>
                    <TableCell align="center">{access?.role?.name}</TableCell>
                    <TableCell align="center">
                      {access.start_datetime
                        ? new Date(access.start_datetime).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {access.end_datetime
                        ? new Date(access.end_datetime).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: access.is_valid ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
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
