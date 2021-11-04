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
  Snackbar,
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

import AssignmentIcon from "@material-ui/icons/Assignment"
import CancelIcon from "@material-ui/icons/Cancel"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import InfoIcon from "@material-ui/icons/Info"
import LaunchIcon from "@material-ui/icons/Launch"
import TimerOffIcon from "@material-ui/icons/TimerOff"

import useStyles from "./styles"
import EditAccessForm from "../../providers/EditAccessForm/EditAccessForm"
import { Access, Role } from "types"
import { Alert } from "@material-ui/lab"
import moment from "moment"
import { getRoles } from "services/Console-Admin/rolesService"
import { onDeleteOrTerminateAccess } from "services/Console-Admin/providersHistoryService"
import { useAppSelector } from "state"

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
  const [terminateAccess, setTerminateAccess] = useState(false)

  const { me } = useAppSelector((state) => ({ me: state.me }))
  const seeLogs = me?.seeLogs ?? false

  const rowsPerPage = 100

  useEffect(() => {
    const _getRoles = async () => {
      try {
        const rolesResp = await getRoles()
        setRoles(rolesResp)
      } catch (error) {
        console.error("Erreur lors de la récupération des habilitations", error)
      }
    }

    _getRoles()
  }, [])

  useEffect(() => {
    if (editAccessSuccess) getAccesses()
    if (deleteAccessSuccess) getAccesses()
  }, [editAccessSuccess, deleteAccessSuccess]) // eslint-disable-line

  const columns = displayName
    ? [
        "Nom",
        "Habilitation",
        "Date de début",
        "Date de fin",
        "Actif",
        "Actions",
      ]
    : [
        "Périmètre",
        "Habilitation",
        "Date de début",
        "Date de fin",
        "Actif",
        "Actions",
      ]

  const handleDeleteAction = async () => {
    try {
      const terminateAccessResp = await onDeleteOrTerminateAccess(
        terminateAccess,
        deleteAccess?.care_site_history_id
      )

      if (terminateAccessResp) {
        setDeleteAccessSuccess(true)
      } else {
        setDeleteAccessFail(true)
      }

      getAccesses()
      setDeleteAccess(null)
    } catch (error) {
      console.error(
        "Erreur lors de la suppression ou la clôture de l'accès",
        error
      )
      setDeleteAccessFail(true)
      setDeleteAccess(null)
    }
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
                        {access.care_site.care_site_source_value} -{" "}
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
                                <Typography>- {text}</Typography>
                              ))}
                          >
                            <InfoIcon
                              color="action"
                              fontSize="small"
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
                      <Tooltip
                        title={
                          access.is_valid ? "Accès actif" : "Accès inactif"
                        }
                      >
                        {access.is_valid ? (
                          <CheckCircleIcon style={{ color: "#BDEA88" }} />
                        ) : (
                          <CancelIcon style={{ color: "#ED6D91" }} />
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Grid
                        container
                        item
                        alignContent="center"
                        justify="space-between"
                      >
                        <Grid item xs={seeLogs ? 4 : 6}>
                          {(access.actual_start_datetime ||
                            access.actual_end_datetime) && (
                            <Tooltip title="Éditer l'accès">
                              <IconButton
                                onClick={() => {
                                  setSelectedAccess(access)
                                }}
                                style={{ padding: "4px 12px" }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                        <Grid item xs={seeLogs ? 4 : 6}>
                          {access.actual_start_datetime &&
                            moment(access.actual_start_datetime).isSameOrBefore(
                              moment(),
                              "day"
                            ) &&
                            access.is_valid && (
                              <Tooltip title="Clôturer l'accès">
                                <IconButton
                                  onClick={() => {
                                    setDeleteAccess(access)
                                    setTerminateAccess(true)
                                  }}
                                  style={{ padding: "4px 12px" }}
                                >
                                  <TimerOffIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          {access.actual_start_datetime &&
                            moment(access.actual_start_datetime).isAfter(
                              moment(),
                              "day"
                            ) && (
                              <Tooltip title="Supprimer l'accès">
                                <IconButton
                                  onClick={() => {
                                    setDeleteAccess(access)
                                    setTerminateAccess(false)
                                  }}
                                  style={{ padding: "4px 12px" }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                        </Grid>
                        {seeLogs && (
                          <Grid item xs={4}>
                            <Tooltip title="Voir les logs de l'accès">
                              <IconButton
                                onClick={() => {
                                  history.push({
                                    pathname: "/logs",
                                    search: `?access=${access.care_site_history_id}`,
                                  })
                                }}
                                style={{ padding: "4px 12px" }}
                              >
                                <AssignmentIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )}
                      </Grid>
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
            Êtes-vous sûr(e) de vouloir{" "}
            {terminateAccess ? "clôturer" : "supprimer"} cet accès sur le
            périmètre {deleteAccess?.care_site.care_site_name} ?
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
        <Snackbar
          open
          onClose={() => {
            if (editAccessSuccess) setEditAccessSuccess(false)
            if (deleteAccessSuccess) setDeleteAccessSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (editAccessSuccess) setEditAccessSuccess(false)
              if (deleteAccessSuccess) setDeleteAccessSuccess(false)
            }}
          >
            {editAccessSuccess && "Les dates d'accès ont bien été éditées."}
            {deleteAccessSuccess &&
              `L'accès a bien été ${terminateAccess ? "clôturé" : "supprimé"}.`}
          </Alert>
        </Snackbar>
      )}
      {(editAccessFail || deleteAccessFail) && (
        <Snackbar
          open
          onClose={() => {
            if (editAccessFail) setEditAccessFail(false)
            if (deleteAccessFail) setDeleteAccessFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (editAccessFail) setEditAccessFail(false)
              if (deleteAccessFail) setDeleteAccessFail(false)
            }}
          >
            {editAccessFail && "Erreur lors de l'édition de l'accès."}
            {deleteAccessFail &&
              `Erreur lors de la ${
                terminateAccess ? "clôture" : "suppression"
              } de l'accès.`}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default RightsTable
