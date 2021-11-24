import React, { useEffect, useState } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core"

import CancelIcon from "@material-ui/icons/Cancel"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import EditIcon from "@material-ui/icons/Edit"

import useStyles from "./styles"
import {
  createRoles,
  submitEditRoles,
} from "services/Console-Admin/rolesService"
import { Role, RoleKeys, UserRole } from "types"

type RoleDialogProps = {
  open: boolean
  userRights: UserRole
  selectedRole: Role
  onClose: () => void
  onAddRoleSuccess: (success: boolean) => void
  onEditRoleSuccess: (fail: boolean) => void
  onAddRoleFail: (success: boolean) => void
  onEditRoleFail: (fail: boolean) => void
}

const RoleDialog: React.FC<RoleDialogProps> = ({
  open,
  userRights,
  selectedRole,
  onClose,
  onAddRoleSuccess,
  onEditRoleSuccess,
  onAddRoleFail,
  onEditRoleFail,
}) => {
  const classes = useStyles()

  const [role, setRole] = useState<Role>(selectedRole)
  const [errorName, setErrorName] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const isEditable = selectedRole?.role_id ? true : false

  const columns = ["Droit", "Statut"]

  const rows = [
    {
      label: "Gestion des habilitations",
      status: role?.right_edit_roles,
      keyName: "right_edit_roles",
    },
    {
      label: "Consulter la liste des logs",
      status: role?.right_read_logs,
      keyName: "right_read_logs",
    },
    {
      label: "Ajouter un utilisateur / profil",
      status: role?.right_add_users,
      keyName: "right_add_users",
    },
    {
      label: "Modifier un utilisateur / profil",
      status: role?.right_edit_users,
      keyName: "right_edit_users",
    },
    {
      label: "Consulter la liste des utilisateurs / profils",
      status: role?.right_read_users,
      keyName: "right_read_users",
    },
    {
      label: "Éditer les accès administrateurs d'un périmètre",
      status: role?.right_manage_admin_accesses_same_level,
      keyName: "right_manage_admin_accesses_same_level",
    },
    {
      label: "Consulter la liste des accès administrateur d'un périmètre",
      status: role?.right_read_admin_accesses_same_level,
      keyName: "right_read_admin_accesses_same_level",
    },
    {
      label: "Éditer les accès administrateurs des sous-périmètres",
      status: role?.right_manage_admin_accesses_inferior_levels,
      keyName: "right_manage_admin_accesses_inferior_levels",
    },
    {
      label: "Consulter la liste des accès administrateur des sous-périmètres",
      status: role?.right_read_admin_accesses_inferior_levels,
      keyName: "right_read_admin_accesses_inferior_levels",
    },
    {
      label: "Éditer les accès aux données patients d'un périmètre",
      status: role?.right_manage_data_accesses_same_level,
      keyName: "right_manage_data_accesses_same_level",
    },
    {
      label: "Consulter la liste des accès aux données patients d'un périmètre",
      status: role?.right_read_data_accesses_same_level,
      keyName: "right_read_data_accesses_same_level",
    },
    {
      label: "Éditer les accès aux données patients des sous-périmètres",
      status: role?.right_manage_data_accesses_inferior_levels,
      keyName: "right_manage_data_accesses_inferior_levels",
    },
    {
      label:
        "Consulter la liste des accès aux données patients des sous-périmètres",
      status: role?.right_read_data_accesses_inferior_levels,
      keyName: "right_read_data_accesses_inferior_levels",
    },
    {
      label: "Lecture des données patients nominatives",
      status: role?.right_read_patient_nominative,
      keyName: "right_read_patient_nominative",
    },
    {
      label: "Lecture des données patients pseudonymisées",
      status: role?.right_read_patient_pseudo_anonymised,
      keyName: "right_read_patient_pseudo_anonymised",
    },
    {
      label: "Export des données patients nominatives",
      status: role?.right_export_jupyter_patient_nominative,
      keyName: "right_export_jupyter_patient_nominative",
    },
    {
      label: "Export des données patients pseudonymisées",
      status: role?.right_export_jupyter_patient_pseudo_anonymised,
      keyName: "right_export_jupyter_patient_pseudo_anonymised",
    },
  ]

  useEffect(() => {
    if ((role.name && role.name.length < 4) || !role.name) {
      setErrorName(true)
    } else {
      setErrorName(false)
    }
  }, [role])

  const _onChangeValue = (key: RoleKeys, value: any) => {
    const _role = { ...role }
    // @ts-ignore
    _role[key] = value

    setRole(_role)
  }

  const onSubmit = async () => {
    try {
      const roleData = {
        name: role?.name,
        right_edit_roles: role?.right_edit_roles,
        right_read_logs: role?.right_read_logs,
        right_add_users: role?.right_add_users,
        right_edit_users: role?.right_edit_users,
        right_read_users: role?.right_read_users,
        right_manage_admin_accesses_same_level:
          role?.right_manage_admin_accesses_same_level,
        right_read_admin_accesses_same_level:
          role?.right_read_admin_accesses_same_level,
        right_manage_admin_accesses_inferior_levels:
          role?.right_manage_admin_accesses_inferior_levels,
        right_read_admin_accesses_inferior_levels:
          role?.right_read_admin_accesses_inferior_levels,
        right_manage_data_accesses_same_level:
          role?.right_manage_data_accesses_same_level,
        right_read_data_accesses_same_level:
          role?.right_read_data_accesses_same_level,
        right_manage_data_accesses_inferior_levels:
          role?.right_manage_data_accesses_inferior_levels,
        right_read_data_accesses_inferior_levels:
          role?.right_read_data_accesses_inferior_levels,
        right_read_patient_nominative: role?.right_read_patient_nominative,
        right_read_patient_pseudo_anonymised:
          role?.right_read_patient_pseudo_anonymised,
        right_export_jupyter_patient_nominative:
          role?.right_export_jupyter_patient_nominative,
        right_export_jupyter_patient_pseudo_anonymised:
          role?.right_export_jupyter_patient_pseudo_anonymised,
      }

      if (isEditable) {
        const roleEditResp = await submitEditRoles(roleData, role?.role_id)

        roleEditResp ? onEditRoleSuccess(true) : onEditRoleFail(true)
      } else {
        const createRoleResp = await createRoles(roleData)

        createRoleResp ? onAddRoleSuccess(true) : onAddRoleFail(true)
      }

      onClose()
    } catch (error) {
      console.error(
        `Erreur lors de ${
          isEditable ? "l'édition" : "la création"
        } de l'habilitation`,
        error
      )
      isEditable ? onEditRoleFail(true) : onAddRoleFail(true)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle className={classes.title}>
        {isEditable ? role?.name : "Créer une nouvelle habilitation :"}
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        {(isEditable && editMode) || !isEditable ? (
          <Grid container direction="column" className={classes.filter}>
            <Typography variant="h3">Nom de l'habilitation :</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              autoFocus
              placeholder="Nom de l'habilitation"
              value={role?.name}
              onChange={(event) => _onChangeValue("name", event.target.value)}
              error={errorName}
              helperText={
                errorName &&
                "Le nom de l'habilitation doit contenir au moins 4 caractères."
              }
            />
          </Grid>
        ) : (
          ""
        )}
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.tableHead}>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column === "Droit" ? "left" : "right"}
                    className={classes.tableHeadCell}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} className={classes.tableBodyRows}>
                  <TableCell className={classes.tableBodyCell}>
                    {row.label}
                  </TableCell>
                  <TableCell align="right" className={classes.tableBodyCell}>
                    {(isEditable && editMode) || !isEditable ? (
                      <Switch
                        color="primary"
                        checked={row.status ? true : false}
                        onChange={(event) =>
                          // @ts-ignore
                          _onChangeValue(row.keyName, event.target.checked)
                        }
                      />
                    ) : row.status ? (
                      <CheckCircleIcon style={{ color: "#BDEA88" }} />
                    ) : (
                      <CancelIcon style={{ color: "#ED6D91" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {isEditable ? "Fermer" : "Annuler"}
        </Button>
        {(isEditable && editMode) || !isEditable ? (
          <Button
            variant="contained"
            disableElevation
            disabled={errorName || !role.name}
            onClick={() => onSubmit()}
            className={classes.buttons}
          >
            Valider
          </Button>
        ) : (
          userRights.right_edit_roles && (
            <Button
              variant="contained"
              disableElevation
              endIcon={<EditIcon height="15px" fill="#FFF" />}
              onClick={() => setEditMode(true)}
              className={classes.buttons}
            >
              Éditer
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  )
}

export default RoleDialog
