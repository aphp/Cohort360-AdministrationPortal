import React from "react";
// import { useSelector } from "react-redux";
import clsx from "clsx";

import { Grid, Typography } from "@material-ui/core";

import ProvidersTable from "components/providers/ProvidersTable/ProvidersTable";
// import UsersTable from "../../components/users/UsersTable-Manelle/UsersTable";

// import { IReduxStore } from "types";

import useStyles from "./styles";

const ProfilesView = () => {
  const classes = useStyles();

  // const [selectedItems, onChangeSelectedItem] = useState([])
  //   const { drawerOpen } = useSelector((state: IReduxStore) => state.ui);

  return (
    <Grid
      container
      direction="column"
      className={clsx(classes.appBar, {
        // [classes.appBarShift]: drawerOpen,
      })}
    >
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
