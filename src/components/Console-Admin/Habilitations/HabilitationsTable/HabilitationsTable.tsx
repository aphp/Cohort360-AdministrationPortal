import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'

import useStyles from './styles'
import { Column, Order, Role, UserRole } from 'types'
import { getRoles, deleteRole } from 'services/Console-Admin/rolesService'
import HabilitationDialog from '../HabilitationDialog/HabilitationDialog'
import { userDefaultRoles } from 'utils/userRoles'
import DataTable from 'components/DataTable/DataTable'
import CommonSnackbar from 'components/Snackbar/Snackbar'

const defaultRole: Role = {
  name: '',
  ...userDefaultRoles
}

type HabilitationsTableProps = {
  userRights: UserRole
}

const HabilitationsTable: React.FC<HabilitationsTableProps> = ({ userRights }) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const columns: Column[] = [
    {
      label: 'Habilitation',
      align: 'left'
    }
  ]

  if (userRights.right_full_admin || userRights.right_manage_users) {
    columns.push({
      label: 'Actions',
      align: 'right'
    })
  }

  const [roles, setRoles] = useState<Role[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [addRoleSuccess, setAddRoleSuccess] = useState(false)
  const [addRoleFail, setAddRoleFail] = useState(false)
  const [editRoleSuccess, setEditRoleSuccess] = useState(false)
  const [editRoleFail, setEditRoleFail] = useState(false)
  const [deleteRoleSuccess, setRoleToDeleteSuccess] = useState(false)
  const [deleteRoleFail, setRoleToDeleteFail] = useState(false)

  useEffect(() => {
    _getRoles()
  }, [])

  useEffect(() => {
    if (addRoleSuccess) _getRoles()
    if (editRoleSuccess) _getRoles()
    if (deleteRoleSuccess) _getRoles()
  }, [addRoleSuccess, editRoleSuccess, roleToDelete])

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

  const handleDeleteRole = async () => {
    try {
      const terminateAccessResp = await deleteRole(roleToDelete?.id)

      if (terminateAccessResp) {
        setRoleToDeleteSuccess(true)
      } else {
        setRoleToDeleteFail(true)
      }
      setRoleToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'habilitation", error)
      setRoleToDeleteFail(true)
      setRoleToDelete(null)
    }
  }

  return (
    <Grid container justifyContent="flex-end" className={classes.table}>
      {userRights.right_full_admin && (
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
          roles?.map((role: Role) => {
            return (
              role && (
                <TableRow key={role.id} className={classes.tableBodyRows} hover>
                  <TableCell align="left">
                    <Typography
                      variant="h6"
                      className={classes.recordName}
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedRole(role)
                      }}
                    >
                      {role.name}
                    </Typography>
                  </TableCell>
                  {(userRights.right_full_admin || userRights.right_manage_users) && (
                    <TableCell align="right">
                      {userRights.right_manage_users && (
                        <Tooltip title="Afficher les utilisateurs">
                          <IconButton
                            onClick={() => {
                              navigate(`/console-admin/habilitations/${role.id}/users`)
                            }}
                          >
                            <PeopleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {userRights.right_full_admin && (
                        <Tooltip title="Supprimer l'habilitation">
                          <IconButton
                            onClick={() => {
                              setRoleToDelete(role)
                            }}
                            size="large"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )
            )
          })
        )}
      </DataTable>

      {selectedRole && (
        <HabilitationDialog
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

      {roleToDelete && (
        <Dialog open onClose={() => setRoleToDelete(null)}>
          <DialogContent>
            <Typography>Êtes-vous sûr(e) de vouloir supprimer l'habilitation {roleToDelete?.name} ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoleToDelete(null)} color="secondary">
              Annuler
            </Button>
            <Button onClick={handleDeleteRole}>Confirmer</Button>
          </DialogActions>
        </Dialog>
      )}

      {(addRoleSuccess || editRoleSuccess || deleteRoleSuccess) && (
        <CommonSnackbar
          onClose={() => {
            if (addRoleSuccess) setAddRoleSuccess(false)
            if (editRoleSuccess) setEditRoleSuccess(false)
            if (deleteRoleSuccess) setRoleToDeleteSuccess(false)
          }}
          severity="success"
          message={`L'habilitation a bien été ${
            (addRoleSuccess && 'créée') || (editRoleSuccess && 'éditée') || (deleteRoleSuccess && 'supprimée')
          }.`}
        />
      )}
      {(addRoleFail || editRoleFail || deleteRoleFail) && (
        <CommonSnackbar
          onClose={() => {
            if (addRoleFail) setAddRoleFail(false)
            if (editRoleFail) setEditRoleFail(false)
            if (deleteRoleFail) setRoleToDeleteFail(false)
          }}
          severity="error"
          message={`Erreur lors de ${
            (addRoleFail && 'la création') || (editRoleFail && "l'édition") || (deleteRoleFail && 'la suppression')
          } de l'habilitation.`}
        />
      )}
    </Grid>
  )
}

export default HabilitationsTable
