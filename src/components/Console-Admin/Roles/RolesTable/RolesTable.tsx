import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  CircularProgress,
  // Dialog,
  // DialogActions,
  // DialogContent,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Tooltip
  // Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
// import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleIcon from '@mui/icons-material/People'

import useStyles from './styles'
import { Column, Order, Role, UserRole } from 'types'
import {
  getRoles
  //  deleteRole
} from 'services/Console-Admin/rolesService'
import RoleDialog from '../RoleDialog/RoleDialog'
import { userDefaultRoles } from 'utils/userRoles'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'

const defaultRole: Role = {
  name: '',
  ...userDefaultRoles
}

type RolesTableProps = {
  userRights: UserRole
}

const RolesTable: React.FC<RolesTableProps> = ({ userRights }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const columns: Column[] = [
    {
      label: 'Habilitation',
      align: 'left'
    },
    {
      label: 'Actions',
      align: 'right'
    }
  ]

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
    <Grid container justifyContent="flex-end" className={classes.table}>
      {userRights.right_edit_roles && (
        <Grid container justifyContent="flex-end" alignItems="center">
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
      <DataTable columns={columns} order={{} as Order}>
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
                    <Tooltip title="Afficher les utilisateurs">
                      <IconButton
                        onClick={() => {
                          navigate(`/console-admin/habilitation/${role.role_id}/users`)
                        }}
                      >
                        <PeopleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Visualiser l'habilitation">
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedRole(role)
                        }}
                        style={{ padding: '0 12px' }}
                        size="large"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Supprimer l'habilitation">
                    <IconButton
                      onClick={() => {
                        setDeleteRole(role)
                      }}
                      size="large"
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
      </DataTable>

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
        <CommonSnackbar
          onClose={() => {
            if (addRoleSuccess) setAddRoleSuccess(false)
            if (editRoleSuccess) setEditRoleSuccess(false)
            // if (deleteRoleSuccess) setDeleteRoleSuccess(false)
          }}
          severity="success"
          message={`L'habilitation a bien été ${addRoleSuccess && 'créée'}${editRoleSuccess && 'éditée'}.`}
          // {/* {deleteRoleSuccess && "L'habilitation a bien été supprimé."} */}
        />
      )}
      {(addRoleFail || editRoleFail) && (
        <CommonSnackbar
          onClose={() => {
            if (addRoleFail) setAddRoleFail(false)
            if (editRoleFail) setEditRoleFail(false)
            // if (deleteRoleFail) setDeleteRoleFail(false)
          }}
          severity="error"
          message={`Erreur lors de ${addRoleFail && 'la création'}${editRoleFail && "l'édition"} de l'habilitation.`}
          // {/* {deleteRoleFail && "Erreur lors de la suppression de l'habilitation."} */}
        />
      )}
    </Grid>
  )
}

export default RolesTable
