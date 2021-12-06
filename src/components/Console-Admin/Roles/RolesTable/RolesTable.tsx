import React, { useEffect, useState } from 'react'

import {
  Button,
  CircularProgress,
  // Dialog,
  // DialogActions,
  // DialogContent,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
  // Typography,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import AddIcon from '@material-ui/icons/Add'
// import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from '@material-ui/icons/Visibility'

import useStyles from './styles'
import { Role, UserRole } from 'types'
import {
  getRoles
  //  deleteRole
} from 'services/Console-Admin/rolesService'
import RoleDialog from '../RoleDialog/RoleDialog'

const defaultRole: Role = {
  name: '',
  right_edit_roles: false,
  right_read_logs: false,
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
  right_export_jupyter_patient_pseudo_anonymised: false
}

type RolesTableProps = {
  userRights: UserRole
}

const RolesTable: React.FC<RolesTableProps> = ({ userRights }) => {
  const classes = useStyles()

  const columns = ['Habilitation', 'Actions']

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
    editRoleSuccess
    //  _deleteRole
  ]) // eslint-disable-line

  const _getRoles = async () => {
    try {
      setLoading(true)
      const rolesResp = await getRoles()

      setRoles(rolesResp)
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des habilitations', error)
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
  //     console.error("Erreur lors de la suppression de l'habilitation", error)
  //     setDeleteRoleFail(true)
  //     setDeleteRole(null)
  //   }
  // }

  return (
    <Grid container justify="flex-end">
      {userRights.right_edit_roles && (
        <Grid container justify="flex-end" alignItems="center">
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon height="15px" fill="#FFF" />}
            className={classes.buttons}
            onClick={() => setSelectedRole(defaultRole)}
          >
            Nouvelle habilitation
          </Button>
        </Grid>
      )}
      <TableContainer component={Paper} style={{ marginBottom: 50 }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column, index: number) => (
                <TableCell
                  key={index}
                  align={column === 'Habilitation' ? 'left' : 'right'}
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
                    <TableRow key={role.role_id} className={classes.tableBodyRows} hover>
                      <TableCell align="left">{role.name}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Visualiser l'habilitation">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation()
                              setSelectedRole(role)
                            }}
                            style={{ padding: '0 12px' }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Supprimer l'habilitation">
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
          userRights={userRights}
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
            Êtes-vous sûr(e) de vouloir supprimer l'habilitation {_deleteRole?.name} ?
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
        <Snackbar
          open
          onClose={() => {
            if (addRoleSuccess) setAddRoleSuccess(false)
            if (editRoleSuccess) setEditRoleSuccess(false)
            // if (deleteRoleSuccess) setDeleteRoleSuccess(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="success"
            onClose={() => {
              if (addRoleSuccess) setAddRoleSuccess(false)
              if (editRoleSuccess) setEditRoleSuccess(false)
              // if (deleteRoleSuccess) setDeleteRoleSuccess(false)
            }}
          >
            {addRoleSuccess && "L'habilitation a bien été créée."}
            {editRoleSuccess && "L'habilitation a bien été éditée."}
            {/* {deleteRoleSuccess && "L'habilitation a bien été supprimé."} */}
          </Alert>
        </Snackbar>
      )}
      {(addRoleFail || editRoleFail) && (
        <Snackbar
          open
          onClose={() => {
            if (addRoleFail) setAddRoleFail(false)
            if (editRoleFail) setEditRoleFail(false)
            // if (deleteRoleFail) setDeleteRoleFail(false)
          }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity="error"
            onClose={() => {
              if (addRoleFail) setAddRoleFail(false)
              if (editRoleFail) setEditRoleFail(false)
              // if (deleteRoleFail) setDeleteRoleFail(false)
            }}
          >
            {addRoleFail && "Erreur lors de la création de l'habilitation."}
            {editRoleFail && "Erreur lors de l'édition de l'habilitation."}
            {/* {deleteRoleFail && "Erreur lors de la suppression de l'habilitation."} */}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  )
}

export default RolesTable
