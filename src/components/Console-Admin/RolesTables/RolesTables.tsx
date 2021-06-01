import React, { useEffect, useState } from "react"

import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

// import EditIcon from "@material-ui/icons/Add"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import EditIcon from '@material-ui/icons/Edit'
import FiberManualRecordRoundedIcon from "@material-ui/icons/FiberManualRecordRounded"

import useStyles from "./styles"
// import AddAccessForm from "../providers/AddAccessForm/AddAccessForm"
// import { submitGetAccesses } from "services/Console-Admin/providersHistoryService"
import { Access ,Roles } from "types"

type RolesTableProps = {
  roles: Roles[]
}

const RightsTable: React.FC<RolesTableProps> = ({ roles }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(`roles`, roles)


  const columns = [
    // {
    //   label : "right_edit_roles"
    // },
    // {
    //   label : "right_add_users"
    // },
    // {
    //   label : "right_edit_users"
    // },
    // {
    //   label : "right_read_users"
    // },
    // {
    //   label : "right_manage_admin_accesses_same_level"
    // },
    // {
    //   label : "right_read_admin_accesses_same_level"
    // },
    // {
    //   label : "right_manage_admin_accesses_inferior_levels"
    // },
    // {
    //   label : "right_read_admin_accesses_inferior_levels"
    // },
    // {
    //   label : "right_manage_data_accesses_same_level"
    // },
    // {
    //   label : "right_read_data_accesses_same_level"
    // },
    // {
    //   label : "right_manage_data_accesses_inferior_levels"
    // },
    // {
    //   label : "right_read_data_accesses_inferior_levels"
    // },
    // {
    //   label : "right_read_patient_nominative"
    // },
    // {
    //   label : "right_read_patient_pseudo_anonymised"
    // },
    // {
    //   label : "right_export_jupyter_patient_nominative"
    // },
    // {
    //   label : "right_export_jupyter_patient_pseudo_anonymised"
    // },
    // {
    //   label: "toto"
    // }
    {
      label: 'droit',
    },
    {
      label: 'status actif/inactif'  
    }
  ]

  return (
    <Grid container justify="flex-end">
      {roles && roles.length > 0 ? (
        roles.map((role: Roles) => {
          return (
            <>
              <Grid container justify="space-between" alignItems="center">
                <Typography align="left" variant="h2" className={classes.title}>
                  Type de droit : {role.name}
                </Typography>
                {role.name && (
                  <Button
                  // variant="contained"
                  // disableElevation
                  startIcon={<EditIcon />}
                  // className={classes.searchButton}
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
                        align={column.label === "Droit" ? "left" : "center"}
                        className={classes.tableHeadCell}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={role.role_id} className={classes.tableBodyRows}>
                      <TableCell align="center">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_edit_roles ? "#BDEA88" : "#ED6D91",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <FiberManualRecordRoundedIcon
                          fontSize="small"
                          style={{
                            color: role.right_add_users ? "#BDEA88" : "#ED6D91",
                          }}
                        />
                      </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_edit_users ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_users ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_manage_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_admin_accesses_same_level ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_manage_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_admin_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_manage_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_data_accesses_same_level ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_manage_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_patient_nominative ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_read_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_export_jupyter_patient_nominative ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_export_jupyter_patient_pseudo_anonymised ? "#BDEA88" : "#ED6D91",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <FiberManualRecordRoundedIcon
                        fontSize="small"
                        style={{
                          color: role.right_manage_data_accesses_inferior_levels ? "#BDEA88" : "#ED6D91",
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
    </Grid>
  )
}
export default RightsTable
