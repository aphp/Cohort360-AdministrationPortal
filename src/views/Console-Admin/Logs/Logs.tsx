import React, { useEffect } from "react"

import { Grid, Typography } from "@material-ui/core"

import LogsTable from "components/Console-Admin/LogsTable/LogsTable"

import useStyles from "./styles"

const Logs: React.FC = () => {
  const classes = useStyles()

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des logs
          </Typography>
          <LogsTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Logs
