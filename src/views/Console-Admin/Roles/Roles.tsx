import React, { useState, useEffect } from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

import { getRoles } from 'services/Console-Admin/rolesService'
import RolesTables from 'components/Console-Admin/RolesTables/RolesTables' 
import useStyles from './styles'

const Roles:React.FC = () => {

   const classes = useStyles()
   const [loading, setLoading] = useState(false)
   const [retrieveRoles, setRetrieveRoles] = useState<any>()

   useEffect(() => {
      setLoading(true)
      getRoles()
         .then((rolesResp:any) => {
            setRetrieveRoles(rolesResp)
            // console.log(`rolesResp`, rolesResp)
            // console.log(`retrieveRoles`, retrieveRoles)
         }).then(() => (setLoading(false)))
      },[] ) // eslint-disable-line

   return (
      <Grid container direction="column">
         <Grid container justify="center">
            {loading ? (
               <CircularProgress className={classes.loading}/>
            ) : (
               <Grid container item xs={12} sm={9}>
                  {retrieveRoles && (
                     <>
                        <RolesTables roles={retrieveRoles} />
                     </>
                  )}   
               </Grid>
            )}
         </Grid>
      </Grid>
   )
}

export default Roles