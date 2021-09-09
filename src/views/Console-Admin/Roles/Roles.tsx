import React, { useState, useEffect } from "react"
import { CircularProgress, Grid } from "@material-ui/core"

import { getRoles } from "services/Console-Admin/rolesService"
import RolesTables from "components/Console-Admin/Roles/RolesTables/RolesTables"
import RolesTable from "components/Console-Admin/Roles/RolesTables/RolesTable"
import useStyles from "./styles"
import { Role } from "types"

const Roles: React.FC = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [retrieveRoles, setRetrieveRoles] = useState<any>()

  useEffect(() => {
    const _getRoles = async () => {
      try {
        const rolesResp = await getRoles()

        setRetrieveRoles(rolesResp)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles", error)
        setLoading(false)
      }
    }

    _getRoles()
  }, []) // eslint-disable-line

  console.log(`retrieveRoles`, retrieveRoles)

  return (
    <Grid container direction="column">
      <Grid container justify="center">
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          <Grid container item xs={12} sm={9}>
            {/* {retrieveRoles && (
              <>
                <RolesTables roles={retrieveRoles} />
              </>
            )} */}
            {retrieveRoles &&
              retrieveRoles.map((role: Role) => <RolesTable role={role} />)}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default Roles
