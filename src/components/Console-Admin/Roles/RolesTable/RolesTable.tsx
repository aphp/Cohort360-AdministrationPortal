import React, { useEffect, useState } from "react"

import {
  Button,
  CircularProgress,
  // Dialog,
  // DialogActions,
  // DialogContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  // Typography,
} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import AddIcon from "@material-ui/icons/Add"
// import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from "@material-ui/icons/Visibility"

import useStyles from "./styles"
import { Role } from "types"
import {
  getRoles,
  //  deleteRole
} from "services/Console-Admin/rolesService"
import RoleDialog from "../RoleDialog/RoleDialog"

const defaultRole: Role = {
  name: "",
  right_edit_roles: false,
  right_add_users: false,
  right_edit_users: false,
  right_read_users: false,
  right_manage_admin_accesses_same_level: false,
  right_read_admin_accesses_same_level: false,
  right_manage_admin_accesses_inferior_levels: false,
  right_read_admin_accesses_inferior_levels: false,
  right_manage_data_accesses_same_level: false,
  right_read_data_accesses_same_level: false,
  right_manage_data_accesses_inferior_levels: false,
  right_read_data_accesses_inferior_levels: false,
  right_read_patient_nominative: false,
  right_read_patient_pseudo_anonymised: false,
  right_export_jupyter_patient_nominative: false,
  right_export_jupyter_patient_pseudo_anonymised: false,
}

const RolesTable: React.FC = () => {
  const classes = useStyles()

  const columns = ["Rôle", "Actions"]

  const [_roles, setRoles] = useState<Role[] | null>(null)
  const [loading, setLoading] = useState(false)
  // const [_deleteRole, setDeleteRole] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [addRoleSuccess, setAddRoleSuccess] = useState(false)
  const [addRoleFail, setAddRoleFail] = useState(false)
  const [editRoleSuccess, setEditRoleSuccess] = useState(false)
  const [editRoleFail, setEditRoleFail] = useState(false)
  // const [deleteRoleSuccess, setDeleteRoleSuccess] = useState(false)
  // const [deleteRoleFail, setDeleteRoleFail] = useState(false)

  useEffect(() => {
    _getRoles()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (addRoleSuccess) _getRoles()
    if (editRoleSuccess) _getRoles()
    // if (_deleteRole) _getRoles()
  }, [
    addRoleSuccess,
    editRoleSuccess,
    //  _deleteRole
  ]) // eslint-disable-line

  const _getRoles = async () => {
    try {
      setLoading(true)
      const rolesResp = await getRoles()

      setRoles(rolesResp)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles", error)
      setLoading(false)
    }
  }

  // const handleDeleteRole = async () => {
  //   try {
  //     const terminateAccessResp = await deleteRole(_deleteRole?.role_id)

  //     if (terminateAccessResp) {
  //       setDeleteRoleSuccess(true)
  //     } else {
  //       setDeleteRoleFail(true)
  //     }
  //     setDeleteRole(null)
  //   } catch (error) {
  //     console.error("Erreur lors de la suppression du rôle", error)
  //     setDeleteRoleFail(true)
  //     setDeleteRole(null)
  //   }
  // }

  return (
    <Grid container justify="flex-end">
      <Grid container justify="flex-end" alignItems="center">
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddIcon height="15px" fill="#FFF" />}
          className={classes.buttons}
          onClick={() => setSelectedRole(defaultRole)}
        >
          Nouveau rôle
        </Button>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column) => (
                <TableCell
                  align={column === "Rôle" ? "left" : "right"}
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
            ) : (
              _roles &&
              _roles.map((role: Role) => {
                return (
                  role && (
                    <TableRow
                      key={role.role_id}
                      className={classes.tableBodyRows}
                      hover
                    >
                      <TableCell align="left">{role.name}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualiser le rôle">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedRole(role)
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Supprimer le rôle">
                          <IconButton
                            onClick={() => {
                              setDeleteRole(role)
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip> */}
                      </TableCell>
                    </TableRow>
                  )
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedRole && (
        <RoleDialog
          open
          selectedRole={selectedRole}
          onClose={() => setSelectedRole(null)}
          onAddRoleSuccess={setAddRoleSuccess}
          onEditRoleSuccess={setEditRoleSuccess}
          onAddRoleFail={setAddRoleFail}
          onEditRoleFail={setEditRoleFail}
        />
      )}

      {/* <Dialog
        open={_deleteRole ? true : false}
        onClose={() => setDeleteRole(null)}
      >
        <DialogContent>
          <Typography>
            Êtes-vous sûr(e) de vouloir supprimer le rôle {_deleteRole?.name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRole(null)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteRole}>Confirmer</Button>
        </DialogActions>
      </Dialog> */}

      {(addRoleSuccess || editRoleSuccess) && (
        <Alert
          severity="success"
          onClose={() => {
            if (addRoleSuccess) setAddRoleSuccess(false)
            if (editRoleSuccess) setEditRoleSuccess(false)
            // if (deleteRoleSuccess) setDeleteRoleSuccess(false)
          }}
          className={classes.alert}
        >
          {addRoleSuccess && "Le rôle a bien été créé."}
          {editRoleSuccess && "Le rôle a bien été édité."}
          {/* {deleteRoleSuccess && "Le rôle a bien été supprimé."} */}
        </Alert>
      )}
      {(addRoleFail || editRoleFail) && (
        <Alert
          severity="error"
          onClose={() => {
            if (addRoleFail) setAddRoleFail(false)
            if (editRoleFail) setEditRoleFail(false)
            // if (deleteRoleFail) setDeleteRoleFail(false)
          }}
          className={classes.alert}
        >
          {addRoleFail && "Erreur lors de la création du rôle."}
          {editRoleFail && "Erreur lors de l'édition du rôle."}
          {/* {deleteRoleFail && "Erreur lors de la suppression du rôle."} */}
        </Alert>
      )}
    </Grid>
  )
}

export default RolesTable
