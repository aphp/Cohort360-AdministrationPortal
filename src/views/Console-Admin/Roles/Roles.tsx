import React, { useState, useEffect } from 'react'
import { CircularProgress, Grid } from '@material-ui/core'

import { getRoles } from 'services/Console-Admin/rolesService'
import RolesTables from 'components/Console-Admin/RolesTables/RolesTables' 

const Roles:React.FC = () => {

   const [loading, setLoading] = useState(false)
   const [retrieveRoles, setRetrieveRoles] = useState<any>()

   useEffect(() => {
      setLoading(true)
      getRoles()
         .then((rolesResp:any) => {
            setRetrieveRoles(rolesResp)
            console.log(`rolesResp`, rolesResp)
            console.log(`retrieveRoles`, retrieveRoles)
         }).then(() => (setLoading(false)))
      },[])

   return (
      <Grid>
         {loading ? (
            <CircularProgress />
         ) : (
            <Grid>
               {retrieveRoles && (
                  <>
                     {retrieveRoles.map(
                        (
                           rolesRetrieve: any
                        )  => (
                           <RolesTables roles={rolesRetrieve} />
                        )
                     )}
                  </>
               )}
            </Grid>
         )}
      </Grid>
   )
}

export default Roles