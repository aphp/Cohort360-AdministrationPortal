import React, { useState, useEffect } from "react"
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"
import EditIcon from '@material-ui/icons/Edit'
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Switch
} from "@material-ui/core"

import { submitEditRoles } from 'services/Console-Admin/rolesService'
import useStyles from "./styles"
import { Role } from "types"

type RolesTableProps = {
  roles: Role[]
}

const RightsTable: React.FC<RolesTableProps> = ({ roles }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const classes = useStyles()

  const [rightState, setRightState] = useState<{
    right_edit_roles: boolean;
    right_add_users: boolean;
    right_edit_users: boolean;
    right_read_users: boolean;
    right_manage_admin_accesses_same_level: boolean;
    right_read_admin_accesses_same_level: boolean;
    right_manage_admin_accesses_inferior_levels: boolean;
    right_read_admin_accesses_inferior_levels: boolean;
    right_manage_data_accesses_same_level: boolean;
    right_read_data_accesses_same_level: boolean;
    right_manage_data_accesses_inferior_levels: boolean;
    right_read_data_accesses_inferior_levels: boolean;
    right_read_patient_nominative: boolean;
    right_read_patient_pseudo_anonymised: boolean;
    right_export_jupyter_patient_nominative: boolean;
    right_export_jupyter_patient_pseudo_anonymised: boolean;
  }[]>([])

  const columns = [
    {
      label: 'droit',
      key: 0
    },
    {
      label: 'statut actif/inactif',
      key: 1
    }
  ]

  useEffect(() => {
    if (roles) {
      setRightState(roles.map((role) => ({
        right_edit_roles: !!role.right_edit_roles,
        right_add_users: !!role.right_add_users,
        right_edit_users: !!role.right_edit_users,
        right_read_users: !!role.right_read_users,
        right_manage_admin_accesses_same_level: !!role.right_manage_admin_accesses_same_level,
        right_read_admin_accesses_same_level: !!role.right_read_admin_accesses_same_level,
        right_manage_admin_accesses_inferior_levels: !!role.right_manage_admin_accesses_inferior_levels,
        right_read_admin_accesses_inferior_levels: !!role.right_read_admin_accesses_inferior_levels,
        right_manage_data_accesses_same_level: !!role.right_manage_data_accesses_same_level,
        right_read_data_accesses_same_level: !!role.right_read_data_accesses_same_level,
        right_manage_data_accesses_inferior_levels: !!role.right_manage_data_accesses_inferior_levels, 
        right_read_data_accesses_inferior_levels: !!role.right_read_data_accesses_inferior_levels,
        right_read_patient_nominative: !!role.right_read_patient_nominative,
        right_read_patient_pseudo_anonymised: !!role.right_read_patient_pseudo_anonymised,
        right_export_jupyter_patient_nominative: !!role.right_export_jupyter_patient_nominative,
        right_export_jupyter_patient_pseudo_anonymised: !!role.right_export_jupyter_patient_pseudo_anonymised,
      })))
    }
  }, [roles])
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (roles) {
      setRightState(roles.map((role, index) => ({
        ...rightState[index],
        [event.target.name]: event.target.checked
      })))
    }
  }

  const onSubmitEditRole = () => {

    // const editData = rightState

    // submitEditRoles(editData, selectedRole?.role_id)
    _onClose()
  }

  // const onSubmitEditRole = (roles: Role[]) => {
  //   if (roles) {
  //     roles.map((role) => ({

  //       editData = {
  //         right_edit_roles: role.right_edit_roles,
  //         right_add_users: role.right_add_users,
  //         right_edit_users: role.right_edit_users,
  //         right_read_users: role.right_read_users,
  //         right_manage_admin_accesses_same_level: role.right_manage_admin_accesses_same_level,
  //         right_read_admin_accesses_same_level: role.right_read_admin_accesses_same_level,
  //         right_manage_admin_accesses_inferior_levels: role.right_manage_admin_accesses_inferior_levels,
  //         right_read_admin_accesses_inferior_levels: role.right_read_admin_accesses_inferior_levels,
  //         right_manage_data_accesses_same_level: role.right_manage_data_accesses_same_level,
  //         right_read_data_accesses_same_level: role.right_read_data_accesses_same_level,
  //         right_manage_data_accesses_inferior_levels: role.right_manage_data_accesses_inferior_levels, 
  //         right_read_data_accesses_inferior_levels: role.right_read_data_accesses_inferior_levels,
  //         right_read_patient_nominative: role.right_read_patient_nominative,
  //         right_read_patient_pseudo_anonymised: role.right_read_patient_pseudo_anonymised,
  //         right_export_jupyter_patient_nominative: role.right_export_jupyter_patient_nominative,
  //         right_export_jupyter_patient_pseudo_anonymised: role.right_export_jupyter_patient_pseudo_anonymised,
  //       },
  //       submitEditRoles(editData, role.role_id)
  //     }))
  //   }
  // }

  const _onClose = () => {
    setSelectedRole(null)
  }

  console.log(`rightState`, rightState)

  return (
    <Grid container justify="flex-end">
      {roles && roles.length > 0 ? (
        roles.map((role: Role, index: number) => {
          return (
            <>
              <Grid container className={classes.gridContainer}>
                <Typography>
                  Rôle: {role.name}
                </Typography>
                  {selectedRole && selectedRole?.role_id === role.role_id ?
                  <Grid>
                    <Button
                      className={classes.editButton}
                      onClick={() => _onClose()}
                    >
                      Annuler
                    </Button>
                    <Button
                      className={classes.editButton}
                      onClick={() => onSubmitEditRole()}
                    >
                      Valider
                    </Button>
                  </Grid> :
                  <Button 
                    variant="contained"
                    disableElevation
                    startIcon={<EditIcon />}
                    className={classes.editButton}
                    onClick={() => setSelectedRole(role)}
                  />
                  }
              </Grid>
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableHead}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          align={column.label === "droit" ? "left" : "right"}
                          className={classes.tableHeadCell}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className={classes.tableBodyRows}>
                      <TableCell>Gestion des rôles</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_edit_roles"
                          checked={rightState[index] ? rightState[index].right_edit_roles : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_edit_roles ? "#BDEA88" : "#ED6D91",
                          }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ajouter un utilisateur / profil</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_add_users"
                          checked={rightState[index] ? rightState[index].right_add_users : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_add_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Modifier un utilisateur / profil</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_edit_users"
                          checked={rightState[index] ? rightState[index].right_edit_users : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_edit_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des utilisateurs / profils</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_users"
                          checked={rightState[index] ? rightState[index].right_read_users : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès administrateurs d'un périmètre</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_manage_admin_accesses_same_level"
                          checked={rightState[index] ? rightState[index].right_manage_admin_accesses_same_level : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès administrateur d'un périmètre</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_admin_accesses_same_level"
                          checked={rightState[index] ? rightState[index].right_read_admin_accesses_same_level : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès administrateurs des sous-périmètres</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_manage_admin_accesses_inferior_levels"
                          checked={rightState[index] ? rightState[index].right_manage_admin_accesses_inferior_levels : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès administrateur des sous-périmètres</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_admin_accesses_inferior_levels"
                          checked={rightState[index] ? rightState[index].right_read_admin_accesses_inferior_levels : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès aux données patients d'un périmètre</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_manage_data_accesses_same_level"
                          checked={rightState[index] ? rightState[index].right_manage_data_accesses_same_level : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès aux données patients d'un périmètre</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_data_accesses_same_level"
                          checked={rightState[index] ? rightState[index].right_read_data_accesses_same_level : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès aux données patients des sous-périmètres</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_manage_data_accesses_inferior_levels"
                          checked={rightState[index] ? rightState[index].right_manage_data_accesses_inferior_levels : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès aux données patients des sous-périmètres</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_data_accesses_inferior_levels"
                          checked={rightState[index] ? rightState[index].right_read_data_accesses_inferior_levels : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lecture des données patients nominatives</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_patient_nominative"
                          checked={rightState[index] ? rightState[index].right_read_patient_nominative : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_patient_nominative ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lecture des données patients pseudonymisées</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_read_patient_pseudo_anonymised"
                          checked={rightState[index] ? rightState[index].right_read_patient_pseudo_anonymised : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Export des données patients nominatives</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_export_jupyter_patient_nominative"
                          checked={rightState[index] ? rightState[index].right_export_jupyter_patient_nominative : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_export_jupyter_patient_nominative ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Export des données patients pseudonymisées</TableCell>
                      <TableCell align="right">
                      {selectedRole && selectedRole.role_id === role.role_id ?
                        <Switch
                          size="small"
                          name="right_export_jupyter_patient_pseudo_anonymised"
                          checked={rightState[index] ? rightState[index].right_export_jupyter_patient_pseudo_anonymised : false}
                          onChange={handleChange}
                        /> :
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_export_jupyter_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      }
                      </TableCell>
                    </TableRow>
                   </TableBody>
                 </Table>
               </TableContainer>
             </>
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
    </Grid>
  )
}
export default RightsTable
