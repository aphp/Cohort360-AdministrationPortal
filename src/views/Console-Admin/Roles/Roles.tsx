import React, { useState, useEffect } from "react"
import { CircularProgress, Grid } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import { getRoles } from "services/Console-Admin/rolesService"
import RolesTable from "components/Console-Admin/Roles/RolesTables/RolesTable"
import useStyles from "./styles"
import { Role } from "types"

const Roles: React.FC = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [onEditSuccess, setOnEditSuccess] = useState(false)
  const [onEditFail, setOnEditFail] = useState(false)

  useEffect(() => {
    const _getRoles = async () => {
      try {
        setLoading(true)
        const rolesResp = await getRoles()

        setRoles(rolesResp)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles", error)
        setLoading(false)
      }
    }

    _getRoles()
  }, []) // eslint-disable-line

  return (
    <>
      <Grid container direction="column">
        <Grid container justify="center">
          {loading ? (
            <CircularProgress className={classes.loading} />
          ) : (
            <Grid container item xs={12} sm={9}>
              {roles ? (
                roles.map((role: Role) => (
                  <RolesTable
                    role={role}
                    onEditRoleSuccess={setOnEditSuccess}
                    onEditRoleFail={setOnEditSuccess}
                  />
                ))
              ) : (
                <Alert severity="error" className={classes.alert}>
                  Erreur lors de la récupération des rôles. Veuillez réessayer
                  ultérieurement.
                </Alert>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      {onEditSuccess && (
        <Alert
          severity="success"
          onClose={() => {
            if (onEditSuccess) setOnEditSuccess(false)
          }}
          className={classes.alert}
        >
          {onEditSuccess && "Le rôle a bien été édité."}
        </Alert>
      )}
      {onEditFail && (
        <Alert
          severity="error"
          onClose={() => {
            if (onEditFail) setOnEditFail(false)
          }}
          className={classes.alert}
        >
          {onEditFail && "Erreur lors de l'édition du rôle."}
        </Alert>
      )}
    </>
  )
}

export default Roles
