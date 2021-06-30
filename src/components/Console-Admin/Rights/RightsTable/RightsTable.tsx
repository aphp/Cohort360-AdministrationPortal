import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"
import InfoIcon from "@material-ui/icons/Info"
import LaunchIcon from "@material-ui/icons/Launch"

import useStyles from "./styles"
import EditAccessForm from "../../providers/EditAccessForm/EditAccessForm"
import { Access, Role } from "types"
import { Alert } from "@material-ui/lab"
import moment from "moment"
import { getRoles } from "services/Console-Admin/rolesService"
import { onDeleteAccess } from "services/Console-Admin/careSiteService"

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
  const history = useHistory()

  const [selectedAccess, setSelectedAccess] = useState<Access | null>(null)
  const [roles, setRoles] = useState<Role[] | undefined>()
  const [deleteAccess, setDeleteAccess] = useState<Access | null>(null)
  const [editAccessSuccess, setEditAccessSuccess] = useState(false)
  const [editAccessFail, setEditAccessFail] = useState(false)
  const [deleteAccessSuccess, setDeleteAccessSuccess] = useState(false)
  const [deleteAccessFail, setDeleteAccessFail] = useState(false)

  const rowsPerPage = 100

  useEffect(() => {
    getRoles().then((res) => {
      setRoles(res)
    })
  }, [])

  useEffect(() => {
    if (editAccessSuccess) getAccesses()
    if (deleteAccessSuccess) getAccesses()
  }, [editAccessSuccess, deleteAccessSuccess]) // eslint-disable-line

  const columns = displayName
    ? ["Nom", "Rôle", "Date de début", "Date de fin", "Actif", "Actions"]
    : ["Périmètre", "Rôle", "Date de début", "Date de fin", "Actif", "Actions"]

  const handleDeleteAction = () => {
    onDeleteAccess(deleteAccess?.care_site_history_id).then((success) => {
      setDeleteAccess(null)
      if (success) {
        setDeleteAccessSuccess(true)
      } else {
        setDeleteAccessFail(true)
      }
    })
  }

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
                        <IconButton
                          onClick={() =>
                            history.push(
                              `/user-profile/${access.provider_history.provider_id}`
                            )
                          }
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                    {!displayName && (
                      <TableCell align={"left"}>
                        {access.care_site.care_site_name}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <div className={classes.roleColumn}>
                        {access?.role?.name}
                        {roles && (
                          <Tooltip
                            classes={{ tooltip: classes.tooltip }}
                            // @ts-ignore
                            title={roles
                              .find(
                                (role: Role) => role.role_id === access.role_id
                              )
                              ?.help_text.map((text) => (
                                <Typography>{text}</Typography>
                              ))}
                          >
                            <InfoIcon
                              color="action"
                              className={classes.infoIcon}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
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
                      <IconButton
                        onClick={() => {
                          setDeleteAccess(access)
                        }}
                      >
                        <DeleteIcon />
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

      <Dialog
        open={deleteAccess ? true : false}
        onClose={() => setDeleteAccess(null)}
      >
        <DialogContent>
          <Typography>
            Êtes-vous sûr(e) de vouloir supprimer cet accès sur le périmètre{" "}
            {deleteAccess?.care_site.care_site_name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccess(null)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteAction}>Confirmer</Button>
        </DialogActions>
      </Dialog>

      {(editAccessSuccess || deleteAccessSuccess) && (
        <Alert
          severity="success"
          onClose={() => {
            if (editAccessSuccess) setEditAccessSuccess(false)
            if (deleteAccessSuccess) setDeleteAccessSuccess(false)
          }}
          className={classes.alert}
        >
          {editAccessSuccess && "Les dates d'accès ont bien été éditées."}
          {deleteAccessSuccess && "L'accès a bien été supprimé."}
        </Alert>
      )}
      {(editAccessFail || deleteAccessFail) && (
        <Alert
          severity="error"
          onClose={() => {
            if (editAccessFail) setEditAccessFail(false)
            if (deleteAccessFail) setDeleteAccessFail(false)
          }}
          className={classes.alert}
        >
          {editAccessFail && "Erreur lors de l'édition de l'accès."}
          {deleteAccessFail && "Erreur lors de la suppression de l'accès."}
        </Alert>
      )}
    </Grid>
  )
}

export default RightsTable
