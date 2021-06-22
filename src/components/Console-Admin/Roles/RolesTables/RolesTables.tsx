import React, { useState } from "react"

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
} from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit'
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import EditRolesModal from '../EditRolesModal/EditRolesModal'
import useStyles from "./styles"

import { Role } from "types"

type RolesTableProps = {
  roles: Role[]
}

const RightsTable: React.FC<RolesTableProps> = ({ roles }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  // const [loading, setLoading] = useState(false)

  console.log(`roles`, roles)

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

  return (
    <Grid container justify="flex-end">
      {roles && roles.length > 0 ? (
        roles.map((role: Role) => {
          return (
            <>
              <Grid container className={classes.gridContainer}>
                <Typography>
                  Rôle: {role.name}
                </Typography>
                {role.name && (
                  <Button 
                    variant="contained"
                    disableElevation
                    startIcon={<EditIcon />}
                    className={classes.editButton}
                    onClick={() => setOpen(true)}
                  />
                )}
              </Grid>
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.tableHead}>
                      {columns.map((column) => (
                        <TableCell
                          // key={column.key}
                          align={column.label === "droit" ? "left" : "right"}
                          className={classes.tableHeadCell}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Gestion des rôles</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_edit_roles ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ajouter un utilisateur / profil</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_add_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Modifier un utilisateur / profil</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_edit_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des utilisateurs / profils</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_users ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès administrateurs d'un périmètre</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès administrateur d'un périmètre</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès administrateurs des sous-périmètres</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès administrateur des sous-périmètres</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès aux données patients d'un périmètre</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès aux données patients d'un périmètre</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Éditer les accès aux données patients des sous-périmètres</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_manage_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Consulter la liste des accès aux données patients des sous-périmètres</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lecture des données patients nominatives</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_patient_nominative ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lecture des données patients pseudonymisées</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_read_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Export des données patients nominatives</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_export_jupyter_patient_nominative ? "#BDEA88" : "#ED6D91",
                           }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Export des données patients pseudonymisées</TableCell>
                      <TableCell align="right">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_export_jupyter_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                           }}
                        />
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

      <EditRolesModal open={open} onClose={() => setOpen(false)} />
    </Grid>
  )

  // return (
  //   <Grid container justify="flex-end">
  //     {roles && roles.length > 0 ? (
  //       roles.map((role: Role) => {
  //         return (
  //           <>
  //             <Grid container justify="space-between" alignItems="center">
  //               <Typography>
  //                 Rôle: {role.name}
  //               </Typography>
  //               {role.name && (
  //                 <Button 
  //                   variant="contained"
  //                   disableElevation
  //                   startIcon={<EditIcon />}
  //                   className={classes.searchButton}
  //                   onClick={() => setOpen(true)}
  //                 />
  //               )}
  //             </Grid>
  //             <TableContainer component={Paper}>
  //               <Table className={classes.table}>
  //                 <TableHead>
  //                   <TableRow className={classes.tableHead}>
  //                     {roles.map((role: Role) => (
  //                       <TableCell
  //                         key={role.name}
  //                         align={role.role_id === 0 ? "left" : "center"}
  //                         className={classes.tableHeadCell}
  //                       >
  //                         {role.name}
  //                       </TableCell>
  //                     ))}
  //                   </TableRow>
  //                 </TableHead>
  //                 <TableBody>
  //                   <TableRow>
  //                     <TableCell>droit 1</TableCell>
  //                     <TableCell>salut</TableCell>
  //                     <TableCell>
  //                       <FiberManualRecordRoundedIcon
  //                         fontSize="small"
  //                         style={{
  //                           color: role.right_edit_roles ? "#BDEA88" : "#ED6D91",
  //                          }}
  //                       />
  //                     </TableCell>
  //                   </TableRow>
  //                   </TableBody>
  //               </Table>
  //             </TableContainer>
  //           </>
  //         )
  //       })
  //     ) : (
  //       <TableRow>
  //         <TableCell colSpan={7}>
  //           <Typography className={classes.loadingSpinnerContainer}>
  //             Aucun résultat à afficher
  //           </Typography>
  //         </TableCell>
  //       </TableRow>
  //     )}
  //   </Grid>
  // )

}
export default RightsTable
