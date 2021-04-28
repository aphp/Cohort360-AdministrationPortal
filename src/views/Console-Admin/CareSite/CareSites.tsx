import React from "react"
import { Grid, Paper, Typography } from "@material-ui/core"

import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"

import useStyles from "./styles"

const CareSite = () => {
  const classes = useStyles()

  return (
    <Grid container direction="column">
      <Grid container justify="center" alignItems="center">
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des périmètres
          </Typography>
          <Paper>
            <CareSiteTree />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareSite
