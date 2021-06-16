import React, { useEffect, useState } from "react"

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
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
import EditIcon from "@material-ui/icons/Edit"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import useStyles from "./styles"
import AddAccessForm from "../providers/AddAccessForm/AddAccessForm"
import EditAccessForm from "../providers/EditAccessForm/EditAccessForm"
import { getAccesses } from "services/Console-Admin/providersHistoryService"
import { Access, Profile } from "types"
import { Alert } from "@material-ui/lab"

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
  const [selectedAccess, setSelectedAccess] = useState<Access | null>(null)
  const [success, setSuccess] = useState(false)

  const rowsPerPage = 100

  const _getAccesses = () => {
    setLoading(true)
    getAccesses(right.provider_history_id, page)
      .then((res) => {
        setAccesses(res?.accesses)
        setTotal(res?.total)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    _getAccesses()
  }, [accesses?.length, page]) // eslint-disable-line

  useEffect(() => {
    if (success) _getAccesses()
  }, [success]) // eslint-disable-line

  const onClose = () => {
    setOpen(false)
    _getAccesses()
  }

  const columns = [
    "Périmètre",
    "Droit",
    "Date de début",
    "Date de fin",
    "Actif",
    "",
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
                  align={column === "Périmètre" ? "left" : "center"}
                  className={classes.tableHeadCell}
                >
                  {column}
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
                      {access.actual_start_datetime
                        ? new Date(
                            access.actual_start_datetime
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {access.actual_end_datetime
                        ? new Date(
                            access.actual_end_datetime
                          ).toLocaleDateString("fr-FR")
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
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          setSelectedAccess(access)
                        }}
                      >
                        <EditIcon />
                      </IconButton>
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
        onChange={(event, page: number) => setPage(page)}
        page={page}
      />

      <AddAccessForm
        open={open}
        onClose={onClose}
        entityId={right.provider_history_id}
        onSuccess={setSuccess}
      />
      <EditAccessForm
        open={selectedAccess ? true : false}
        onClose={() => setSelectedAccess(null)}
        access={selectedAccess}
      />
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess(false)}
          className={classes.successAlert}
        >
          Le droit a bien été créé.
        </Alert>
      )}
    </Grid>
  )
}

export default RightsTable
