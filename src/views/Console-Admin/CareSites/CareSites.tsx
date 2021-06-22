import React, { useState } from "react"
import { useHistory } from "react-router-dom"

import { Button, Grid, Paper, Typography } from "@material-ui/core"

import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"

import useStyles from "./styles"
import { getCareSites } from "services/Console-Admin/careSiteService"
import { ScopeTreeRow } from "types"

const CareSites: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const [selectedItem, onChangeSelectedItem] =
    useState<ScopeTreeRow | null>(null)

  return (
    <Grid container direction="column">
      <Grid container justify="center" alignItems="center">
        <Grid
          container
          item
          xs={12}
          sm={9}
          direction="column"
          alignItems="flex-end"
        >
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des périmètres
          </Typography>
          <Paper style={{ width: "100%" }}>
            <CareSiteTree
              getCareSites={getCareSites}
              defaultSelectedItems={selectedItem}
              onChangeSelectedItem={onChangeSelectedItem}
            />
          </Paper>
          <Button
            variant="contained"
            disableElevation
            disabled={!selectedItem}
            className={classes.button}
            onClick={() =>
              history.push(`/caresite/${selectedItem?.care_site_id}`)
            }
          >
            Valider
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareSites
