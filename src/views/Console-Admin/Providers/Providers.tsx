import React from "react"
import clsx from "clsx"

import { Grid, Typography } from "@material-ui/core"

import ProvidersTable from "components/Console-Admin/providers/ProvidersTable/ProvidersTable"


import useStyles from "./styles"

const ProfilesView: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid id="qui suis-je" container direction="column" className={clsx(classes.appBar, {})}>
      <Grid container justify="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des utilisateurs
          </Typography>
          <ProvidersTable />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilesView;
