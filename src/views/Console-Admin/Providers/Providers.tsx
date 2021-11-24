import React, { useEffect, useState } from "react"
// import { useSelector } from "react-redux";
import clsx from "clsx"

import { CircularProgress, Grid, Typography } from "@material-ui/core"

import ProvidersTable from "components/Console-Admin/providers/ProvidersTable/ProvidersTable"

import { useAppSelector } from "state"
// import { IReduxStore } from "types";

import useStyles from "./styles"
import { getUserRights, userDefaultRoles } from "utils/userRoles"

const ProfilesView: React.FC = () => {
  const classes = useStyles()
  const [userRights, setUserRights] = useState(userDefaultRoles)
  const [loading, setLoading] = useState(false)
  const { me } = useAppSelector((state) => ({ me: state.me }))

  useEffect(() => {
    const _getUserRights = async () => {
      try {
        setLoading(true)

        const getUserRightsResponse = await getUserRights(
          me?.providerSourceValue
        )

        setUserRights(getUserRightsResponse)
        setLoading(false)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des habilitations de l'utilisateur",
          error
        )
        setLoading(false)
      }
    }

    _getUserRights()
  }, []) // eslint-disable-line

  // const [selectedItems, onChangeSelectedItem] = useState([])
  //   const { drawerOpen } = useSelector((state: IReduxStore) => state.ui);

  return (
    <Grid container direction="column" className={clsx(classes.appBar, {})}>
      <Grid container justify="center">
        <Grid container item xs={12} sm={9}>
          <Typography variant="h1" color="primary" className={classes.title}>
            Liste des utilisateurs
          </Typography>
          {loading ? (
            <Grid container item justify="center">
              <CircularProgress />
            </Grid>
          ) : (
            <ProvidersTable userRights={userRights} />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfilesView
