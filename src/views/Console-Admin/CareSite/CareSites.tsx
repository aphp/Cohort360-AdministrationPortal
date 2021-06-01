import React, { useState } from "react"
import { Grid, Paper, Typography } from "@material-ui/core"

import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"

import useStyles from "./styles"
import { getCareSites } from "services/Console-Admin/careSiteService"
import { ScopeTreeRow } from "types"

const CareSite: React.FC = () => {
  const classes = useStyles()
  const [selectedItem, onChangeSelectedItem] =
    useState<ScopeTreeRow | null>(null)

  return (
    <Grid container direction="column">
      <Grid container justify="center" alignItems="center">
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des périmètres
          </Typography>
          <Paper>
            <CareSiteTree
              getCareSites={getCareSites}
              defaultSelectedItems={selectedItem}
              onChangeSelectedItem={onChangeSelectedItem}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareSite
