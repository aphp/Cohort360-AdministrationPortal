import React, { useEffect, useState } from "react"

import {
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

import EditIcon from "@material-ui/icons/Edit"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import useStyles from "./styles"
import EditAccessForm from "../../providers/EditAccessForm/EditAccessForm"
import { Access } from "types"
import { Alert } from "@material-ui/lab"
import moment from "moment"

type RightsTableProps = {
  displayName: boolean
  loading: boolean
  page: number
  setPage: (page: number) => void
  total: number
  accesses: Access[] | undefined
  getAccesses: () => void
}

const RightsTable: React.FC<RightsTableProps> = ({
  displayName,
  loading,
  page,
  setPage,
  total,
  accesses,
  getAccesses,
}) => {
  const classes = useStyles()

  const [selectedAccess, setSelectedAccess] = useState<Access | null>(null)
  const [editAccessSuccess, setEditAccessSuccess] = useState(false)
  const [editAccessFail, setEditAccessFail] = useState(false)
  const rowsPerPage = 100

  useEffect(() => {
    if (editAccessSuccess) getAccesses()
  }, [editAccessSuccess]) // eslint-disable-line

  const columns = displayName
    ? ["Nom", "Périmètre", "Droit", "Date de début", "Date de fin", "Actif", ""]
    : ["Périmètre", "Droit", "Date de début", "Date de fin", "Actif", ""]

  return (
    <Grid container justify="flex-end">
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column) => (
                <TableCell
                  align={
                    displayName
                      ? column === "Nom"
                        ? "left"
                        : "center"
                      : column === "Périmètre"
                      ? "left"
                      : "center"
                  }
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
                    {displayName && (
                      <TableCell align="left">
                        {access.provider_history.lastname}{" "}
                        {access.provider_history.firstname}
                      </TableCell>
                    )}
                    <TableCell align={displayName ? "center" : "left"}>
                      {access.care_site.care_site_name}
                    </TableCell>
                    <TableCell align="center">{access?.role?.name}</TableCell>
                    <TableCell align="center">
                      {access.actual_start_datetime
                        ? moment(access.actual_start_datetime).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {access.actual_end_datetime
                        ? moment(access.actual_end_datetime).format(
                            "DD/MM/YYYY"
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

      <EditAccessForm
        open={selectedAccess ? true : false}
        onClose={() => setSelectedAccess(null)}
        access={selectedAccess}
        onSuccess={setEditAccessSuccess}
        onFail={setEditAccessFail}
      />
      {editAccessSuccess && (
        <Alert
          severity="success"
          onClose={() => setEditAccessSuccess(false)}
          className={classes.alert}
        >
          Les dates d'accès ont bien été éditées.
        </Alert>
      )}
      {editAccessFail && (
        <Alert
          severity="error"
          onClose={() => setEditAccessFail(false)}
          className={classes.alert}
        >
          Erreur lors de l'édition de l'accès.
        </Alert>
      )}
    </Grid>
  )
}

export default RightsTable
