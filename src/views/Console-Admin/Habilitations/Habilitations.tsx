import React from "react"

import { Grid, Typography } from "@material-ui/core"

import RolesTable from "components/Console-Admin/Roles/RolesTable/RolesTable"

import useStyles from "./styles"

const Habilitations: React.FC = () => {
  const classes = useStyles()

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des habilitations
          </Typography>
          <RolesTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Habilitations
