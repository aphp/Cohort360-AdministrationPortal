import React, { useState } from "react"
import { Grid, Paper, Typography } from "@material-ui/core"

import CareSiteTree from "components/Console-Admin/CareSite/CareSiteTree"

import useStyles from "./styles"

const CareSite: React.FC = () => {
  const classes = useStyles()
  const [selectedItems, onChangeSelectedItems] = useState([])

  console.log(`selectedItems`, selectedItems)

  return (
    <Grid container direction="column">
      <Grid container justify="center" alignItems="center">
        <Grid container item xs={12} sm={9} direction="column">
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des périmètres
          </Typography>
          <Paper>
            <CareSiteTree
              defaultSelectedItems={selectedItems}
              //@ts-ignore
              onChangeSelectedItem={onChangeSelectedItems}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareSite
