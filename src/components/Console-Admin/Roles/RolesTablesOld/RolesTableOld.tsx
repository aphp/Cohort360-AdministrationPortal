import React, { useState } from "react"
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core"

import EditIcon from "@material-ui/icons/Edit"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import { Role, RoleKeys } from "types"

import useStyles from "./styles"
import { submitEditRoles } from "services/Console-Admin/rolesService"

type RolesTableProps = {
  role: Role
  onEditRoleSuccess: (success: boolean) => void
  onEditRoleFail: (success: boolean) => void
}

const RolesTableOld: React.FC<RolesTableProps> = ({
  role,
  onEditRoleSuccess,
  onEditRoleFail,
}) => {
  const classes = useStyles()

  const [_role, setRole] = useState(role)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      label: "droit",
      key: 0,
    },
    {
      label: "statut actif/inactif",
      key: 1,
    },
  ]

  const rows = [
    {
      label: "Gestion des rôles",
      status: _role.right_edit_roles,
      keyName: "right_edit_roles",
    },
    {
      label: "Ajouter un utilisateur / profil",
      status: _role.right_add_users,
      keyName: "right_add_users",
    },
    {
      label: "Modifier un utilisateur / profil",
      status: _role.right_edit_users,
      keyName: "right_edit_users",
    },
    {
      label: "Consulter la liste des utilisateurs / profils",
      status: _role.right_read_users,
      keyName: "right_read_users",
    },
    {
      label: "Éditer les accès administrateurs d'un périmètre",
      status: _role.right_manage_admin_accesses_same_level,
      keyName: "right_manage_admin_accesses_same_level",
    },
    {
      label: "Consulter la liste des accès administrateur d'un périmètre",
      status: _role.right_read_admin_accesses_same_level,
      keyName: "right_read_admin_accesses_same_level",
    },
    {
      label: "Éditer les accès administrateurs des sous-périmètres",
      status: _role.right_manage_admin_accesses_inferior_levels,
      keyName: "right_manage_admin_accesses_inferior_levels",
    },
    {
      label: "Consulter la liste des accès administrateur des sous-périmètres",
      status: _role.right_read_admin_accesses_inferior_levels,
      keyName: "right_read_admin_accesses_inferior_levels",
    },
    {
      label: "Éditer les accès aux données patients d'un périmètre",
      status: _role.right_manage_data_accesses_same_level,
      keyName: "right_manage_data_accesses_same_level",
    },
    {
      label: "Consulter la liste des accès aux données patients d'un périmètre",
      status: _role.right_read_data_accesses_same_level,
      keyName: "right_read_data_accesses_same_level",
    },
    {
      label: "Éditer les accès aux données patients des sous-périmètres",
      status: _role.right_manage_data_accesses_inferior_levels,
      keyName: "right_manage_data_accesses_inferior_levels",
    },
    {
      label:
        "Consulter la liste des accès aux données patients des sous-périmètres",
      status: _role.right_read_data_accesses_inferior_levels,
      keyName: "right_read_data_accesses_inferior_levels",
    },
    {
      label: "Lecture des données patients nominatives",
      status: _role.right_read_patient_nominative,
      keyName: "right_read_patient_nominative",
    },
    {
      label: "Lecture des données patients pseudonymisées",
      status: _role.right_read_patient_pseudo_anonymised,
      keyName: "right_read_patient_pseudo_anonymised",
    },
    {
      label: "Export des données patients nominatives",
      status: _role.right_export_jupyter_patient_nominative,
      keyName: "right_export_jupyter_patient_nominative",
    },
    {
      label: "Export des données patients pseudonymisées",
      status: _role.right_export_jupyter_patient_pseudo_anonymised,
      keyName: "right_export_jupyter_patient_pseudo_anonymised",
    },
  ]

  const _onChangeValue = (key: RoleKeys, value: any) => {
    const _roleCopy = { ..._role }
    _roleCopy[key] = value

    setRole(_roleCopy)
  }

  const onSubmitEditRole = async () => {
    try {
      setLoading(true)
      const roleData = {
        right_edit_roles: _role.right_edit_roles,
        right_add_users: _role.right_add_users,
        right_edit_users: _role.right_edit_users,
        right_read_users: _role.right_read_users,
        right_manage_admin_accesses_same_level:
          _role.right_manage_admin_accesses_same_level,
        right_read_admin_accesses_same_level:
          _role.right_read_admin_accesses_same_level,
        right_manage_admin_accesses_inferior_levels:
          _role.right_manage_admin_accesses_inferior_levels,
        right_read_admin_accesses_inferior_levels:
          _role.right_read_admin_accesses_inferior_levels,
        right_manage_data_accesses_same_level:
          _role.right_manage_data_accesses_same_level,
        right_read_data_accesses_same_level:
          _role.right_read_data_accesses_same_level,
        right_manage_data_accesses_inferior_levels:
          _role.right_manage_data_accesses_inferior_levels,
        right_read_data_accesses_inferior_levels:
          _role.right_read_data_accesses_inferior_levels,
        right_read_patient_nominative: _role.right_read_patient_nominative,
        right_read_patient_pseudo_anonymised:
          _role.right_read_patient_pseudo_anonymised,
        right_export_jupyter_patient_nominative:
          _role.right_export_jupyter_patient_nominative,
        right_export_jupyter_patient_pseudo_anonymised:
          _role.right_export_jupyter_patient_pseudo_anonymised,
      }

      const roleEditResp = await submitEditRoles(roleData, _role.role_id)

      roleEditResp ? onEditRoleSuccess(true) : onEditRoleFail(true)
      setLoading(false)
      setEditMode(false)
    } catch (error) {
      console.error("Erreur lors de l'édition du rôle", error)
      onEditRoleFail(true)
      setLoading(false)
      setEditMode(false)
    }
  }

  return (
    <Grid container justify="center" style={{ margin: 24 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container justify="space-between" alignItems="center">
            <Typography align="left" variant="h2">
              Rôle: {_role.name}
            </Typography>
            {editMode ? (
              <Button
                variant="contained"
                disableElevation
                onClick={() => onSubmitEditRole()}
                className={classes.buttons}
              >
                Valider
              </Button>
            ) : (
              <Button
                variant="contained"
                disableElevation
                startIcon={<EditIcon height="15px" fill="#FFF" />}
                onClick={() => setEditMode(true)}
                className={classes.buttons}
              >
                Éditer
              </Button>
            )}
          </Grid>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.tableHead}>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.label === "droit" ? "left" : "right"}
                      className={classes.tableHeadCell}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index} className={classes.tableBodyRows}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell align="right">
                      {editMode ? (
                        <Switch
                          checked={row.status ? true : false}
                          onChange={(event) =>
                            // @ts-ignore
                            _onChangeValue(row.keyName, event.target.checked)
                          }
                        />
                      ) : (
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{ color: row.status ? "#BDEA88" : "#ED6D91" }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Grid>
  )
}

export default RolesTableOld
