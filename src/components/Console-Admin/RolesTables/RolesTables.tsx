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

import AddIcon from "@material-ui/icons/Add"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"

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
    {
      label: "Droit"
    },
    {
      label: "Actif"
    },
    {
      label: "Inactif"
    }
  ]

  return (
    <div>On va bien voir ce que tu vas voir </div>
  )
}
export default RightsTable
